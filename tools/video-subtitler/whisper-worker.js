/**
 * Web Worker for Whisper speech recognition via transformers.js.
 * Accepts Float32Array audio (16kHz mono) and returns timestamped segments.
 */

const MODEL_ID = 'onnx-community/whisper-large-v3-turbo';
const MODEL_DTYPE = 'q4';

let createPipeline = null;
let pipe = null;
let pipePromise = null;

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

let detectedDevice = null;

async function ensureTransformers() {
  if (createPipeline) return;
  const mod = await import(
    'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3'
  );
  createPipeline = mod.pipeline;

  // Detect WebGPU support
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        detectedDevice = 'webgpu';
        console.log('[whisper] WebGPU available, using GPU acceleration');
      }
    } catch {
      // WebGPU request failed, fall back
    }
  }
  if (!detectedDevice) {
    detectedDevice = 'wasm';
    console.log('[whisper] WebGPU not available, falling back to WASM (CPU)');
  }
  self.postMessage({ type: 'device-info', device: detectedDevice });
}

async function ensureModel() {
  if (pipe) return pipe;
  if (pipePromise) return pipePromise;

  pipePromise = (async () => {
    await ensureTransformers();

    pipe = await createPipeline(
      'automatic-speech-recognition',
      MODEL_ID,
      {
        dtype: MODEL_DTYPE,
        device: detectedDevice,
        progress_callback: handleProgressEvent,
      },
    );

    self.postMessage({ type: 'model-ready' });
    return pipe;
  })();

  return pipePromise;
}

async function transcribe(audio, language) {
  await ensureModel();

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
      await ensureModel();
    } else if (type === 'transcribe') {
      await transcribe(audio, language);
    }
  } catch (err) {
    console.error('[whisper-worker] error:', err);
    self.postMessage({ type: 'error', message: err?.message || String(err) });
  }
});
