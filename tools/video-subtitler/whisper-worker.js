/**
 * Web Worker for Whisper speech recognition via transformers.js.
 * Accepts Float32Array audio (16kHz mono) and returns timestamped segments.
 */

let pipeline = null;
let loadingPromise = null;

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

async function ensureModel() {
  if (pipeline) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const { pipeline: createPipeline } = await import(
      'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3'
    );

    pipeline = await createPipeline(
      'automatic-speech-recognition',
      'onnx-community/whisper-large-v3-turbo',
      {
        dtype: 'q4',
        device: 'wasm',
        progress_callback: handleProgressEvent,
      },
    );

    self.postMessage({ type: 'model-ready' });
  })();

  return loadingPromise;
}

async function transcribe(audio, language) {
  await ensureModel();

  const result = await pipeline(audio, {
    return_timestamps: true,
    chunk_length_s: 30,
    language: language || 'zh',
  });

  const segments = (result.chunks || []).map(chunk => ({
    text: chunk.text.trim(),
    start: chunk.timestamp[0],
    end: chunk.timestamp[1],
  }));

  self.postMessage({ type: 'result', segments });
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
