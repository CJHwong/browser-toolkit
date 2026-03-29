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
  constructor(container) {
    this.container = container;
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
    // Offset controls
    const header = document.createElement('div');
    header.className = 'subtitle-editor-header';
    header.innerHTML = `
      <span class="offset-label">Time Offset</span>
      <button type="button" class="offset-btn offset-minus" title="−100ms">−</button>
      <span class="offset-display">+0.0s</span>
      <button type="button" class="offset-btn offset-plus" title="+100ms">+</button>
    `;

    header.querySelector('.offset-minus').addEventListener('click', () => this._applyOffset(-OFFSET_STEP));
    header.querySelector('.offset-plus').addEventListener('click', () => this._applyOffset(OFFSET_STEP));

    this.offsetDisplay = header.querySelector('.offset-display');

    // Segment list
    this.segmentList = document.createElement('div');
    this.segmentList.className = 'segment-list';

    // Add button
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-segment-btn';
    addBtn.textContent = '+ Add Segment';
    addBtn.addEventListener('click', () => this._addSegment());

    this.container.append(header, this.segmentList, addBtn);
  }

  _renderSegments() {
    this.segmentList.innerHTML = '';
    this.segments.forEach((seg, idx) => {
      this.segmentList.appendChild(this._createSegmentRow(seg, idx));
    });
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
    deleteBtn.title = 'Delete segment';
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

  _deleteSegment(index) {
    this.segments = this.getSegments();
    this.segments.splice(index, 1);
    this._renderSegments();
  }

  _addSegment() {
    const current = this.getSegments();
    const lastEnd = current.length > 0 ? current[current.length - 1].end : 0;
    current.push({ text: '', start: lastEnd, end: lastEnd });
    this.segments = current;
    this._renderSegments();

    // Focus the new textarea
    const rows = this.segmentList.querySelectorAll('.segment-row');
    const lastRow = rows[rows.length - 1];
    if (lastRow) {
      lastRow.querySelector('.segment-text').focus();
    }
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
