/**
 * FFmpeg utilities for video audio extraction, subtitle muxing, and SRT generation.
 * All operations run client-side via ffmpeg.wasm.
 */

const CORE_BASE = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';

let ffmpeg = null;

/**
 * Load and initialize ffmpeg.wasm. Cached after first call.
 * Uses UMD globals loaded via script tags in index.html.
 * @returns {Promise<FFmpeg>}
 */
export async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;

  const { FFmpeg } = FFmpegWASM;
  const { toBlobURL } = FFmpegUtil;

  ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => {
    console.log('[ffmpeg]', message);
  });

  console.log('[ffmpeg] downloading core assets...');
  const [coreURL, wasmURL] = await Promise.all([
    toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
    toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
  ]);

  console.log('[ffmpeg] assets downloaded, calling load...');
  await ffmpeg.load({ coreURL, wasmURL });
  console.log('[ffmpeg] load complete');
  return ffmpeg;
}

/**
 * Extract audio from a video file as Float32Array (16kHz mono PCM).
 * This is the format Whisper expects.
 * @param {Blob} videoFileBlob
 * @returns {Promise<Float32Array>}
 */
export async function extractAudio(videoFileBlob) {
  const instance = await initFFmpeg();

  await instance.writeFile('input', new Uint8Array(await videoFileBlob.arrayBuffer()));

  await instance.exec([
    '-i', 'input',
    '-vn',
    '-ar', '16000',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    '-f', 'wav',
    'output.wav',
  ]);

  const wavData = await instance.readFile('output.wav');

  // Cleanup virtual FS
  await instance.deleteFile('input');
  await instance.deleteFile('output.wav');

  return wavToFloat32(wavData);
}

/**
 * Parse a 16-bit PCM WAV (from ffmpeg output) into Float32Array.
 * WAV header is 44 bytes for standard PCM format.
 * @param {Uint8Array} wavBytes
 * @returns {Float32Array}
 */
function wavToFloat32(wavBytes) {
  const view = new DataView(wavBytes.buffer, wavBytes.byteOffset, wavBytes.byteLength);

  // Find the 'data' chunk by scanning for its FourCC marker.
  // Standard WAV has it at byte 36, but some encoders add extra chunks.
  let dataOffset = 12; // skip RIFF header (12 bytes)
  while (dataOffset < view.byteLength - 8) {
    const chunkId =
      String.fromCharCode(view.getUint8(dataOffset)) +
      String.fromCharCode(view.getUint8(dataOffset + 1)) +
      String.fromCharCode(view.getUint8(dataOffset + 2)) +
      String.fromCharCode(view.getUint8(dataOffset + 3));
    const chunkSize = view.getUint32(dataOffset + 4, true);

    if (chunkId === 'data') {
      dataOffset += 8; // skip chunk header
      const sampleCount = chunkSize / 2; // 16-bit = 2 bytes per sample
      const float32 = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        float32[i] = view.getInt16(dataOffset + i * 2, true) / 32768;
      }
      return float32;
    }

    dataOffset += 8 + chunkSize;
  }

  throw new Error('WAV data chunk not found');
}

const CJK_FONT_URL = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/OTC/NotoSansCJK-Regular.ttc';
let fontCached = false;

async function ensureCJKFont(instance) {
  if (fontCached) return;
  console.log('[ffmpeg] downloading CJK font (~19MB, one-time)...');
  const response = await fetch(CJK_FONT_URL);
  const fontData = new Uint8Array(await response.arrayBuffer());
  await instance.writeFile('NotoSansCJK.ttc', fontData);
  fontCached = true;
  console.log('[ffmpeg] CJK font ready');
}

/**
 * Burn subtitles into video pixels (hard subs).
 * Returns a Blob URL of the output MP4.
 * @param {Blob} videoFileBlob
 * @param {string} assString - ASS subtitle content
 * @returns {Promise<string>} Blob URL
 */
export async function burnSubtitles(videoFileBlob, assString, onProgress) {
  const instance = await initFFmpeg();
  await ensureCJKFont(instance);

  await instance.writeFile('input.mp4', new Uint8Array(await videoFileBlob.arrayBuffer()));
  await instance.writeFile('subs.ass', new TextEncoder().encode(assString));

  // Parse duration from input for progress calculation
  let durationSec = 0;
  const logHandler = ({ message }) => {
    const durationMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/);
    if (durationMatch) {
      durationSec = Number(durationMatch[1]) * 3600 +
        Number(durationMatch[2]) * 60 +
        Number(durationMatch[3]) +
        Number(durationMatch[4]) / 100;
    }
    const timeMatch = message.match(/time=(\d+):(\d+):(\d+)\.(\d+)/);
    if (timeMatch && durationSec > 0 && onProgress) {
      const currentSec = Number(timeMatch[1]) * 3600 +
        Number(timeMatch[2]) * 60 +
        Number(timeMatch[3]) +
        Number(timeMatch[4]) / 100;
      onProgress(Math.min(currentSec / durationSec, 1));
    }
  };
  instance.on('log', logHandler);

  await instance.exec([
    '-i', 'input.mp4',
    '-vf', 'ass=subs.ass:fontsdir=.',
    '-preset', 'ultrafast',
    '-c:a', 'copy',
    'output.mp4',
  ]);

  instance.off('log', logHandler);

  const outputData = await instance.readFile('output.mp4');

  await instance.deleteFile('input.mp4');
  await instance.deleteFile('subs.ass');
  await instance.deleteFile('output.mp4');

  const blob = new Blob([outputData], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
}

/**
 * Convert segments to ASS subtitle format for hard sub burning.
 * @param {Array<{text: string, start: number, end: number}>} segments
 * @returns {string}
 */
export function generateASS(segments) {
  const header = `[Script Info]
Title: Subtitles
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans CJK TC,56,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,20,20,40,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

  const events = segments.map(seg => {
    const start = formatASSTime(seg.start);
    const end = formatASSTime(seg.end);
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${seg.text}`;
  });

  return header + '\n' + events.join('\n') + '\n';
}

/**
 * Format seconds to ASS timestamp: H:MM:SS.cc (centiseconds)
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatASSTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centis = Math.round((totalSeconds % 1) * 100);
  return (
    hours + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(centis).padStart(2, '0')
  );
}

/**
 * Convert transcription segments to SRT format.
 * @param {Array<{text: string, start: number, end: number}>} segments
 * @returns {string} Valid SRT content
 */
export function generateSRT(segments) {
  return segments
    .map((segment, index) => {
      const startTime = formatSRTTimestamp(segment.start);
      const endTime = formatSRTTimestamp(segment.end);
      return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}`;
    })
    .join('\n\n');
}

/**
 * Format seconds to SRT timestamp: HH:MM:SS,mmm
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatSRTTimestamp(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds % 1) * 1000);

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0') +
    ',' +
    String(milliseconds).padStart(3, '0')
  );
}
