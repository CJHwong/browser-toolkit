/**
 * Web Worker for Whisper speech recognition via transformers.js.
 * Accepts Float32Array audio (16kHz mono) and returns timestamped segments.
 *
 * Uses Breeze-ASR-25 (fine-tuned for Traditional Chinese) when language is 'zh',
 * and whisper-large-v3-turbo for all other languages.
 */

const MODELS = {
  zh: {
    id: 'a2d8a4v/Breeze-ASR-25-ONNX',
    dtype: 'q4f16',
  },
  default: {
    id: 'onnx-community/whisper-large-v3-turbo',
    dtype: 'q4',
  },
};

let createPipeline = null;
const pipelines = {}; // keyed by model id
const loadingPromises = {};

function handleProgressEvent(event) {
  if (event.status === 'progress') {
    self.postMessage({
      type: 'download-progress',
      file: event.file,
      progress: event.progress,
      loaded: event.loaded,
      total: event.total,
    });
  }
}

async function ensureTransformers() {
  if (createPipeline) return;
  const mod = await import(
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3'
  );
  createPipeline = mod.pipeline;
}

async function ensureModel(language) {
  const modelKey = language === 'zh' ? 'zh' : 'default';
  const model = MODELS[modelKey];

  if (pipelines[model.id]) return pipelines[model.id];
  if (loadingPromises[model.id]) return loadingPromises[model.id];

  loadingPromises[model.id] = (async () => {
    await ensureTransformers();

    const pipe = await createPipeline(
      'automatic-speech-recognition',
      model.id,
      {
        dtype: model.dtype,
        device: 'wasm',
        progress_callback: handleProgressEvent,
      },
    );

    pipelines[model.id] = pipe;
    self.postMessage({ type: 'model-ready' });
    return pipe;
  })();

  return loadingPromises[model.id];
}

async function transcribe(audio, language) {
  const pipe = await ensureModel(language);

  const SAMPLE_RATE = 16000;
  const CHUNK_SEC = 10;
  const CHUNK_SAMPLES = CHUNK_SEC * SAMPLE_RATE;
  const audioDuration = audio.length / SAMPLE_RATE;
  console.log(`[whisper] starting transcription: ${audioDuration.toFixed(1)}s audio, language=${language || 'auto'}`);

  // Slice audio into <=30s chunks (Whisper's max context window)
  const chunks = [];
  for (let i = 0; i < audio.length; i += CHUNK_SAMPLES) {
    chunks.push(audio.slice(i, Math.min(i + CHUNK_SAMPLES, audio.length)));
  }

  const pipelineOpts = { return_timestamps: true };
  if (language) pipelineOpts.language = language;

  console.log(`[whisper] ${chunks.length} chunks to process`);
  const allSegments = [];

  for (let i = 0; i < chunks.length; i++) {
    const offsetSec = (i * CHUNK_SAMPLES) / SAMPLE_RATE;
    const chunkDuration = chunks[i].length / SAMPLE_RATE;
    console.log(`[whisper] chunk ${i + 1}/${chunks.length}: offset=${offsetSec.toFixed(1)}s, length=${chunkDuration.toFixed(1)}s`);
    const t0 = performance.now();

    const result = await pipe(chunks[i], pipelineOpts);
    const elapsed = ((performance.now() - t0) / 1000).toFixed(1);

    const chunkSegments = [];
    for (const chunk of result.chunks || []) {
      chunkSegments.push({
        text: chunk.text.trim(),
        start: (chunk.timestamp[0] ?? 0) + offsetSec,
        end: (chunk.timestamp[1] ?? 0) + offsetSec,
      });
    }
    allSegments.push(...chunkSegments);

    console.log(`[whisper] chunk ${i + 1} done in ${elapsed}s, got ${chunkSegments.length} segment(s):`);
    chunkSegments.forEach(seg => console.log(`  [${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s] ${seg.text}`));

    self.postMessage({
      type: 'transcribe-progress',
      progress: (i + 1) / chunks.length,
      segments: allSegments.flatMap(splitAtPunctuation),
    });
  }

  const segments = allSegments.flatMap(splitAtPunctuation);
  console.log(`[whisper] transcription complete: ${segments.length} segments total`);
  self.postMessage({ type: 'result', segments });
}

/**
 * Split a segment at CJK sentence-ending punctuation.
 * Time is distributed proportionally by character count.
 */
function splitAtPunctuation(segment) {
  const parts = segment.text.split(/(?<=[。！？；])/);
  if (parts.length <= 1) return [segment];

  const totalChars = parts.reduce((sum, p) => sum + p.length, 0);
  const duration = segment.end - segment.start;
  const results = [];
  let cursor = segment.start;

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const partDuration = (part.length / totalChars) * duration;
    results.push({
      text: trimmed,
      start: cursor,
      end: cursor + partDuration,
    });
    cursor += partDuration;
  }

  return results;
}

self.addEventListener('message', async (event) => {
  const { type, audio, language } = event.data;

  try {
    if (type === 'load') {
      await ensureModel(language);
    } else if (type === 'transcribe') {
      await transcribe(audio, language);
    }
  } catch (err) {
    console.error('[whisper-worker] error:', err);
    self.postMessage({ type: 'error', message: err?.message || String(err) });
  }
});
