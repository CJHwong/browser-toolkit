const TIME_REGEX = /^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/;
const OFFSET_STEP = 0.1; // 100ms

function parseTime(str) {
  const match = str.match(TIME_REGEX);
  if (!match) return null;
  const [, hours, minutes, seconds, millis] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(millis) / 1000;
}

function formatTime(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = Math.floor(clamped % 60);
  const millis = Math.round((clamped % 1) * 1000);
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + '.' +
    String(millis).padStart(3, '0')
  );
}

export default class SubtitleEditor {
  constructor(container, t) {
    this.container = container;
    this.t = t;
    this.segments = [];
    this.clickCallback = null;
    this.offsetValue = 0;

    this.container.classList.add('subtitle-editor');
    this._renderShell();
  }

  setSegments(segments) {
    this.segments = segments.map(seg => ({ ...seg }));
    this.offsetValue = 0;
    this._updateOffsetDisplay();
    this._renderSegments();
  }

  getSegments() {
    return Array.from(this.segmentList.querySelectorAll('.segment-row')).map(row => ({
      text: row.querySelector('.segment-text').value,
      start: parseTime(row.querySelector('.segment-start').value) ?? 0,
      end: parseTime(row.querySelector('.segment-end').value) ?? 0,
    }));
  }

  onSegmentClick(callback) {
    this.clickCallback = callback;
  }

  highlightSegment(index) {
    const rows = this.segmentList.querySelectorAll('.segment-row');
    rows.forEach((row, idx) => {
      row.classList.toggle('active', idx === index);
    });

    const targetRow = rows[index];
    if (targetRow) {
      targetRow.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  // -- Private --

  _renderShell() {
    const header = document.createElement('div');
    header.className = 'subtitle-editor-header';
    header.innerHTML = `
      <span class="offset-label">${this.t('editor.offset')}</span>
      <button type="button" class="offset-btn offset-minus" title="\u2212100ms">\u2212</button>
      <span class="offset-display">+0.0s</span>
      <button type="button" class="offset-btn offset-plus" title="+100ms">+</button>
    `;

    header.querySelector('.offset-minus').addEventListener('click', () => this._applyOffset(-OFFSET_STEP));
    header.querySelector('.offset-plus').addEventListener('click', () => this._applyOffset(OFFSET_STEP));

    this.offsetDisplay = header.querySelector('.offset-display');

    this.segmentList = document.createElement('div');
    this.segmentList.className = 'segment-list';

    this.emptyPlaceholder = document.createElement('div');
    this.emptyPlaceholder.className = 'segment-list-empty';
    this.emptyPlaceholder.textContent = this.t('editor.empty');
    this.segmentList.appendChild(this.emptyPlaceholder);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-segment-btn';
    addBtn.textContent = this.t('editor.add');
    addBtn.addEventListener('click', () => this._insertAt(this.segments.length));

    this.container.append(header, this.segmentList, addBtn);
  }

  _renderSegments() {
    this.segmentList.innerHTML = '';

    if (this.segments.length === 0) {
      this.segmentList.appendChild(this.emptyPlaceholder);
      return;
    }

    // Gap button before first row
    this.segmentList.appendChild(this._createGapButton(0));

    this.segments.forEach((seg, idx) => {
      this.segmentList.appendChild(this._createSegmentRow(seg, idx));
      // Gap button after each row
      this.segmentList.appendChild(this._createGapButton(idx + 1));
    });
  }

  _createGapButton(insertIndex) {
    const gap = document.createElement('button');
    gap.type = 'button';
    gap.className = 'segment-gap-insert';
    gap.textContent = '+';
    gap.title = this.t('editor.insert');
    gap.addEventListener('click', () => this._insertAt(insertIndex));
    return gap;
  }

  _createSegmentRow(segment, index) {
    const row = document.createElement('div');
    row.className = 'segment-row';
    row.dataset.index = index;

    const indexLabel = document.createElement('span');
    indexLabel.className = 'segment-index';
    indexLabel.textContent = index + 1;

    const startInput = document.createElement('input');
    startInput.type = 'text';
    startInput.className = 'segment-start';
    startInput.value = formatTime(segment.start);
    startInput.setAttribute('aria-label', `Segment ${index + 1} start time`);
    this._addTimeValidation(startInput);

    const arrow = document.createElement('span');
    arrow.className = 'segment-arrow';
    arrow.textContent = '\u2192';

    const endInput = document.createElement('input');
    endInput.type = 'text';
    endInput.className = 'segment-end';
    endInput.value = formatTime(segment.end);
    endInput.setAttribute('aria-label', `Segment ${index + 1} end time`);
    this._addTimeValidation(endInput);

    const textarea = document.createElement('textarea');
    textarea.className = 'segment-text';
    textarea.rows = 1;
    textarea.value = segment.text;
    textarea.setAttribute('aria-label', `Segment ${index + 1} text`);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'segment-delete';
    deleteBtn.textContent = '\u00d7';
    deleteBtn.title = this.t('editor.delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._deleteSegment(index);
    });

    row.addEventListener('click', () => {
      if (!this.clickCallback) return;
      const seg = {
        text: textarea.value,
        start: parseTime(startInput.value) ?? 0,
        end: parseTime(endInput.value) ?? 0,
      };
      this.clickCallback(seg);
    });

    row.append(indexLabel, startInput, arrow, endInput, textarea, deleteBtn);
    return row;
  }

  _addTimeValidation(input) {
    let lastValid = input.value;
    input.addEventListener('focus', () => {
      lastValid = input.value;
    });
    input.addEventListener('blur', () => {
      if (parseTime(input.value) === null) {
        input.value = lastValid;
      }
    });
  }

  _insertAt(index) {
    const current = this.getSegments();
    const before = index > 0 ? current[index - 1] : null;
    const after = index < current.length ? current[index] : null;
    const start = before ? before.end : 0;
    const end = after ? after.start : start;
    current.splice(index, 0, { text: '', start, end });
    this.segments = current;
    this._renderSegments();

    const rows = this.segmentList.querySelectorAll('.segment-row');
    const newRow = rows[index];
    if (newRow) {
      newRow.querySelector('.segment-text').focus();
    }
  }

  _deleteSegment(index) {
    this.segments = this.getSegments();
    this.segments.splice(index, 1);
    this._renderSegments();
  }

  _applyOffset(delta) {
    const current = this.getSegments();
    this.segments = current.map(seg => ({
      ...seg,
      start: Math.max(0, seg.start + delta),
      end: Math.max(0, seg.end + delta),
    }));
    this.offsetValue += delta;
    this._updateOffsetDisplay();
    this._renderSegments();
  }

  _updateOffsetDisplay() {
    const sign = this.offsetValue >= 0 ? '+' : '';
    const rounded = Math.round(this.offsetValue * 10) / 10;
    this.offsetDisplay.textContent = `${sign}${rounded.toFixed(1)}s`;
  }
}
