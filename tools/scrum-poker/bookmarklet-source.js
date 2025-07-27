(function () {
  // --- Config & Constants ---
  const SCRUM_POKER_SESSION_URL = null; // Set this to your Scrum Poker session URL if needed
  const PANEL_ID = 'scrum-poker-panel-container';
  const PANEL_WIDTH_KEY = 'scrumPokerPanel_width';
  const PANEL_COLLAPSED_KEY = 'scrumPokerPanel_collapsed';
  const DEFAULT_WIDTH = 380;
  const MIN_WIDTH = 280;

  // --- SVG Icons (using single quotes for attributes) ---
  const ICON_COLLAPSE =
    "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>";
  const ICON_EXPAND =
    "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>";
  const ICON_CLOSE =
    "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>";

  // --- Initial Check ---
  const existingPanel = document.getElementById(PANEL_ID);
  if (existingPanel) {
    if (existingPanel.classList.contains('collapsed')) {
      existingPanel.classList.remove('collapsed');
      const toggleBtn = document.getElementById('sp-panel-toggle-btn');
      if (toggleBtn) toggleBtn.innerHTML = ICON_COLLAPSE;
      localStorage.setItem(PANEL_COLLAPSED_KEY, 'false');
    }
    return;
  }

  // --- Styles ---
  const styles = `
        #${PANEL_ID} {
            position: fixed; top: 0; right: 0;
            width: ${localStorage.getItem(PANEL_WIDTH_KEY) || DEFAULT_WIDTH}px;
            min-width: ${MIN_WIDTH}px; max-width: 90vw; height: 100%;
            z-index: 2147483647;
            background-color: #f5f4ed;
            border-left: 1px solid #e4e2da;
            box-shadow: -4px 0 15px rgba(0,0,0,0.15);
            transition: transform 0.3s ease-out;
            transform: translateX(100%);
        }
        #${PANEL_ID}.open { transform: translateX(0); }
        #${PANEL_ID}.collapsed { transform: translateX(calc(100% - 50px)); }
        #${PANEL_ID}.collapsed > #${PANEL_ID}-resizer { display: none; }
        #${PANEL_ID}-iframe { width: 100%; height: 100%; border: none; }
        #${PANEL_ID}.resizing > #${PANEL_ID}-iframe { pointer-events: none; }
        
        .sp-panel-btn {
            position: absolute; left: -45px;
            width: 35px; height: 35px;
            background-color: #607d8b; color: white;
            border: none; border-radius: 50% 0 0 50%;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
        }
        .sp-panel-btn:hover { background-color: #546e7a; }
        #sp-panel-toggle-btn { top: 12px; }
        #sp-panel-close-btn { top: 52px; }

        #${PANEL_ID}-resizer {
            position: absolute; top: 0; left: -5px;
            width: 10px; height: 100%;
            cursor: col-resize;
        }
    `;

  // --- Element Creation ---
  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;

  const container = document.createElement('div');
  container.id = PANEL_ID;

  const iframe = document.createElement('iframe');
  iframe.id = `${PANEL_ID}-iframe`;
  iframe.src =
    SCRUM_POKER_SESSION_URL ||
    'https://cjhwong.github.io/browser-toolkit/scrum-poker/';

  const toggleButton = document.createElement('button');
  toggleButton.id = 'sp-panel-toggle-btn';
  toggleButton.className = 'sp-panel-btn';
  toggleButton.title = 'Collapse / Expand';

  const closeButton = document.createElement('button');
  closeButton.id = 'sp-panel-close-btn';
  closeButton.className = 'sp-panel-btn';
  closeButton.innerHTML = ICON_CLOSE;
  closeButton.title = 'Close Panel';

  const resizer = document.createElement('div');
  resizer.id = `${PANEL_ID}-resizer`;

  // --- Logic ---
  const permanentlyClose = () => {
    container.classList.remove('open');
    setTimeout(() => {
      document.body.removeChild(container);
      document.head.removeChild(styleSheet);
    }, 300);
  };

  const toggleCollapse = () => {
    const isCollapsed = container.classList.toggle('collapsed');
    toggleButton.innerHTML = isCollapsed ? ICON_EXPAND : ICON_COLLAPSE;
    localStorage.setItem(PANEL_COLLAPSED_KEY, isCollapsed);
  };

  const startResize = e => {
    e.preventDefault();
    container.classList.add('resizing');
    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };

  const doResize = e => {
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= MIN_WIDTH) container.style.width = `${newWidth}px`;
  };

  const stopResize = () => {
    container.classList.remove('resizing');
    localStorage.setItem(PANEL_WIDTH_KEY, container.offsetWidth);
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // --- Initial State ---
  const isInitiallyCollapsed =
    localStorage.getItem(PANEL_COLLAPSED_KEY) === 'true';
  if (isInitiallyCollapsed) {
    container.classList.add('collapsed');
    toggleButton.innerHTML = ICON_EXPAND;
  } else {
    toggleButton.innerHTML = ICON_COLLAPSE;
  }

  // --- Event Listeners ---
  toggleButton.onclick = toggleCollapse;
  closeButton.onclick = permanentlyClose;
  resizer.addEventListener('mousedown', startResize);

  // --- Assembly & Injection ---
  container.appendChild(resizer);
  container.appendChild(toggleButton);
  container.appendChild(closeButton);
  container.appendChild(iframe);
  document.head.appendChild(styleSheet);
  document.body.appendChild(container);

  // Trigger slide-in animation
  setTimeout(() => container.classList.add('open'), 50);
})();
