const locales = {
  en: {
    'title': 'Video Subtitler',
    'subtitle': 'Transcribe videos and add subtitles using AI, entirely in your browser. No data leaves your machine.',
    'drop.hint': 'Drop a video file here or click to browse',
    'progress.model': 'Loading model...',
    'progress.transcribe': 'Transcribing...',
    'progress.export': 'Burning subtitles into video...',
    'btn.transcribe': 'Transcribe',
    'btn.export': 'Export',
    'btn.extracting': 'Extracting audio...',
    'editor.offset': 'Time Offset',
    'editor.add': '+ Add Segment',
    'editor.empty': 'No segments yet',
    'editor.insert': 'Insert segment',
    'editor.delete': 'Delete segment',
    'error.worker': 'Worker failed: ',
    'error.transcribe': 'Transcription failed: ',
    'error.export': 'Export failed: ',
    'error.process': 'Failed to process video: ',
    'lang.label': 'Language',
  },
  'zh-TW': {
    'title': '影片字幕產生器',
    'subtitle': '使用 AI 在瀏覽器中轉錄影片並加入字幕，資料不會離開你的電腦。',
    'drop.hint': '拖放影片檔案至此，或點擊瀏覽',
    'progress.model': '載入模型中...',
    'progress.transcribe': '轉錄中...',
    'progress.export': '字幕燒錄中...',
    'btn.transcribe': '轉錄',
    'btn.export': '匯出',
    'btn.extracting': '擷取音訊中...',
    'editor.offset': '時間偏移',
    'editor.add': '+ 新增字幕',
    'editor.empty': '尚無字幕',
    'editor.insert': '插入字幕',
    'editor.delete': '刪除字幕',
    'error.worker': 'Worker 錯誤：',
    'error.transcribe': '轉錄失敗：',
    'error.export': '匯出失敗：',
    'error.process': '影片處理失敗：',
    'lang.label': '語言',
  },
};

const detected = navigator.language.startsWith('zh') ? 'zh-TW' : 'en';

export function t(key) {
  return locales[detected]?.[key] ?? locales.en[key] ?? key;
}

export function getLocale() {
  return detected;
}
