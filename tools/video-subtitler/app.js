import { initFFmpeg, extractAudio, burnSubtitles, generateASS } from './ffmpeg-utils.js';
import SubtitleEditor from './subtitle-editor.js';

const State = {
  IDLE: 'idle',
  DOWNLOADING_MODEL: 'downloading-model',
  TRANSCRIBING: 'transcribing',
  EDITING: 'editing',
  EXPORTING: 'exporting',
};

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const videoPreview = document.getElementById('video-preview');
const progressSection = document.getElementById('progress-section');
const modelProgress = document.getElementById('model-progress');
const modelProgressFill = document.getElementById('model-progress-fill');
const modelProgressText = document.getElementById('model-progress-text');
const transcriptionSpinner = document.getElementById('transcription-spinner');
const exportProgress = document.getElementById('export-progress');
const exportProgressFill = document.getElementById('export-progress-fill');
const exportProgressText = document.getElementById('export-progress-text');
const transcribeBtn = document.getElementById('transcribe-btn');
const exportBtn = document.getElementById('export-btn');
const editorContainer = document.getElementById('subtitle-editor-container');

let currentState = State.IDLE;
let videoFile = null;
let worker = null;
const editor = new SubtitleEditor(editorContainer);

editor.onSegmentClick((segment) => {
  videoPreview.currentTime = segment.start;
  videoPreview.play();
});

// -- File handling --

function handleVideoFile(file) {
  if (!file.type.startsWith('video/')) return;

  videoFile = file;
  const objectUrl = URL.createObjectURL(file);
  videoPreview.src = objectUrl;
  videoPreview.hidden = false;
  dropZone.classList.add('hidden');
  transcribeBtn.disabled = false;
}

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleVideoFile(fileInput.files[0]);
  }
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) handleVideoFile(file);
});

// -- State management --

function setState(state) {
  currentState = state;

  progressSection.classList.toggle('hidden', state === State.IDLE || state === State.EDITING);
  modelProgress.classList.toggle('hidden', state !== State.DOWNLOADING_MODEL);
  transcriptionSpinner.classList.toggle('hidden', state !== State.TRANSCRIBING);
  exportProgress.classList.toggle('hidden', state !== State.EXPORTING);

  transcribeBtn.disabled = state !== State.IDLE && state !== State.EDITING;
  exportBtn.disabled = state !== State.EDITING;

  if (state === State.IDLE) {
    transcribeBtn.disabled = !videoFile;
  }
}

// -- Worker communication --

function getWorker() {
  if (worker) return worker;
  worker = new Worker('./whisper-worker.js', { type: 'module' });
  worker.addEventListener('message', handleWorkerMessage);
  worker.addEventListener('error', (event) => {
    console.error('Whisper worker error:', event);
    setState(State.IDLE);
    alert('Worker failed: ' + (event.message || 'unknown error'));
  });
  return worker;
}

const fileProgress = {};

function handleWorkerMessage(event) {
  const msg = event.data;

  if (msg.type === 'download-progress') {
    setState(State.DOWNLOADING_MODEL);
    fileProgress[msg.file] = { loaded: msg.loaded, total: msg.total };
    const totalLoaded = Object.values(fileProgress).reduce((sum, f) => sum + f.loaded, 0);
    const totalSize = Object.values(fileProgress).reduce((sum, f) => sum + f.total, 0);
    const percent = totalSize > 0 ? Math.round((totalLoaded / totalSize) * 100) : 0;
    modelProgressFill.style.width = percent + '%';
    modelProgressText.textContent = percent + '%';
    return;
  }

  if (msg.type === 'model-ready') {
    setState(State.TRANSCRIBING);
    return;
  }

  if (msg.type === 'result') {
    editor.setSegments(msg.segments);
    updateSubtitlePreview(msg.segments);
    setState(State.EDITING);
    return;
  }

  if (msg.type === 'error') {
    console.error('Whisper worker error:', msg.message || msg);
    setState(State.IDLE);
    alert('Transcription failed: ' + (msg.message || 'unknown error - check console'));
  }
}

// -- Transcribe flow --

transcribeBtn.addEventListener('click', async () => {
  if (!videoFile) return;

  transcribeBtn.disabled = true;
  transcribeBtn.textContent = 'Extracting audio...';

  try {
    console.log('[app] initializing ffmpeg...');
    await initFFmpeg();
    console.log('[app] ffmpeg ready, extracting audio...');
    const audioData = await extractAudio(videoFile);
    console.log('[app] audio extracted, samples:', audioData.length);

    setState(State.DOWNLOADING_MODEL);
    transcribeBtn.textContent = 'Transcribe';

    const w = getWorker();
    w.postMessage({ type: 'transcribe', audio: audioData });
  } catch (err) {
    console.error('Transcription pipeline error:', err);
    transcribeBtn.textContent = 'Transcribe';
    setState(State.IDLE);
    alert('Failed to process video: ' + err.message);
  }
});

// -- Refresh preview on editor changes --

const refreshPreview = () => {
  if (currentState !== State.EDITING) return;
  updateSubtitlePreview(editor.getSegments());
};

editorContainer.addEventListener('input', refreshPreview);
editorContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('segment-delete') ||
      event.target.classList.contains('offset-btn') ||
      event.target.classList.contains('add-segment-btn')) {
    setTimeout(refreshPreview, 50);
  }
});

// -- Export flow --

exportBtn.addEventListener('click', async () => {
  if (!videoFile) return;

  const segments = editor.getSegments();
  if (!segments || segments.length === 0) return;

  setState(State.EXPORTING);
  exportProgressFill.style.width = '0%';
  exportProgressText.textContent = '0%';

  try {
    const assString = generateASS(segments);
    const downloadUrl = await burnSubtitles(videoFile, assString, (progress) => {
      const percent = Math.round(progress * 100);
      exportProgressFill.style.width = percent + '%';
      exportProgressText.textContent = percent + '%';
    });

    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = videoFile.name.replace(/\.[^.]+$/, '') + '_subtitled.mp4';
    anchor.click();

    setState(State.EDITING);
  } catch (err) {
    console.error('Export error:', err);
    setState(State.EDITING);
    alert('Export failed: ' + err.message);
  }
});

// -- Subtitle preview on video --

let trackBlobUrl = null;

function generateVTT(segments) {
  let vtt = 'WEBVTT\n\n';
  segments.forEach((seg, idx) => {
    const startTime = formatVTTTime(seg.start);
    const endTime = formatVTTTime(seg.end);
    vtt += `${idx + 1}\n${startTime} --> ${endTime}\n${seg.text}\n\n`;
  });
  return vtt;
}

function formatVTTTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = Math.round((totalSeconds % 1) * 1000);
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(millis).padStart(3, '0')
  );
}

function updateSubtitlePreview(segments) {
  const oldTrack = videoPreview.querySelector('track');
  if (oldTrack) oldTrack.remove();
  if (trackBlobUrl) URL.revokeObjectURL(trackBlobUrl);

  const vttBlob = new Blob([generateVTT(segments)], { type: 'text/vtt' });
  trackBlobUrl = URL.createObjectURL(vttBlob);

  const track = document.createElement('track');
  track.kind = 'subtitles';
  track.label = 'Subtitles';
  track.srclang = 'zh';
  track.src = trackBlobUrl;
  track.default = true;
  videoPreview.appendChild(track);

  // Force the track to show
  if (videoPreview.textTracks.length > 0) {
    videoPreview.textTracks[0].mode = 'showing';
  }
}

// -- Video time sync --

videoPreview.addEventListener('timeupdate', () => {
  if (currentState !== State.EDITING) return;

  const segments = editor.getSegments();
  const currentTime = videoPreview.currentTime;
  const activeIndex = segments.findIndex(
    (seg) => currentTime >= seg.start && currentTime <= seg.end,
  );

  if (activeIndex >= 0) {
    editor.highlightSegment(activeIndex);
  }
});
