// Firebase is defined as a global in ESLint config

// --- DOM Elements ---
const userSetupSection = document.getElementById('user-setup');
const pokerRoomSection = document.getElementById('poker-room');
const nameInput = document.getElementById('name-input');
const joinBtn = document.getElementById('join-btn');
const createSessionBtn = document.getElementById('create-session-btn');
const participantsList = document.getElementById('participants-list');
const cardsContainer = document.getElementById('cards-container');
const revealBtn = document.getElementById('reveal-btn');
const resetBtn = document.getElementById('reset-btn');
const sessionUrlLink = document.getElementById('session-url');
const copyContainer = document.getElementById('copy-container');
const copyFeedback = document.getElementById('copy-feedback');
const suggestionContainer = document.getElementById('suggestion-container');
const suggestionValue = document.getElementById('suggestion-value');
const qrCode = document.getElementById('qr-code');
const qrCodeLarge = document.getElementById('qr-code-large');
const qrModal = document.getElementById('qr-modal');
const qrCloseBtn = document.getElementById('qr-close-btn');
const bookmarkletBtn = document.getElementById('bookmarklet-btn');
const bookmarkletModal = document.getElementById('bookmarklet-modal');
const bookmarkletCloseBtn = document.getElementById('bookmarklet-close-btn');
const bookmarkletLink = document.getElementById('bookmarklet-link');
const bookmarkletCode = document.getElementById('bookmarklet-code');
const copyBookmarkletBtn = document.getElementById('copy-bookmarklet-btn');

// New DOM Elements
const autoRevealOverlay = document.getElementById('auto-reveal-countdown');
const countdownNumber = document.getElementById('countdown-number');
const cancelRevealBtn = document.getElementById('cancel-reveal-btn');
const confettiCanvas = document.getElementById('confetti-canvas');
const notificationToast = document.getElementById('notification-toast');
const notificationMessage = document.getElementById('notification-message');
const notificationClose = document.getElementById('notification-close');

// --- App State ---
let sessionId = null;
let userId = null;
let sessionRef = null;
let database = null;
const pokerCards = ['0.5', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

// Feature State
let autoRevealTimeout = null;
let autoRevealInterval = null;
let autoRevealDismissed = false;
let lastVotedCount = 0;
let nudgeShown = false;
let hasShownConsensus = false;

// --- Core Functions ---

/**
 * Hides the loading overlay with a fade-out animation.
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    // Remove from DOM after animation completes
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
}

/**
 * Handles database errors, showing an alert to the user.
 * @param {Error} error - The error object from Firebase.
 */
function handleDatabaseError(error) {
  console.error('Database error:', error);
  alert(
    `A database error occurred: ${error.message}. You might not have permission for this action or your connection was interrupted.`
  );
}

/**
 * Generates QR code URL for the given session URL.
 * @param {string} url - The session URL to encode.
 * @returns {string} The QR code image URL.
 */
function generateQRCode(url) {
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  return qrApiUrl;
}

/**
 * Generates a session-specific bookmarklet code.
 * @param {string} sessionUrl - The session URL to embed in the bookmarklet.
 * @returns {string} The bookmarklet JavaScript code.
 */
function generateBookmarklet(sessionUrl) {
  // Read the bookmarklet template and inject the session URL
  const bookmarkletTemplate = `
(function () {
  const SCRUM_POKER_SESSION_URL = '${sessionUrl}';
  const PANEL_ID = 'scrum-poker-panel-container';
  const PANEL_WIDTH_KEY = 'scrumPokerPanel_width';
  const PANEL_COLLAPSED_KEY = 'scrumPokerPanel_collapsed';
  const DEFAULT_WIDTH = 380;
  const MIN_WIDTH = 280;

  const ICON_COLLAPSE = "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'></polyline></svg>";
  const ICON_EXPAND = "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'></polyline></svg>";
  const ICON_CLOSE = "<svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>";

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

  const styles = \`
    #\${PANEL_ID} {
      position: fixed; top: 0; right: 0;
      width: \${localStorage.getItem(PANEL_WIDTH_KEY) || DEFAULT_WIDTH}px;
      min-width: \${MIN_WIDTH}px; max-width: 90vw; height: 100%;
      z-index: 2147483647;
      background-color: #f5f4ed;
      border-left: 1px solid #e4e2da;
      box-shadow: -4px 0 15px rgba(0,0,0,0.15);
      transition: transform 0.3s ease-out;
      transform: translateX(100%);
    }
    #\${PANEL_ID}.open { transform: translateX(0); }
    #\${PANEL_ID}.collapsed { transform: translateX(calc(100% - 50px)); }
    #\${PANEL_ID}.collapsed > #\${PANEL_ID}-resizer { display: none; }
    #\${PANEL_ID}-iframe { width: 100%; height: 100%; border: none; }
    #\${PANEL_ID}.resizing > #\${PANEL_ID}-iframe { pointer-events: none; }
    
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

    #\${PANEL_ID}-resizer {
      position: absolute; top: 0; left: -5px;
      width: 10px; height: 100%;
      cursor: col-resize;
    }
  \`;

  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;

  const container = document.createElement('div');
  container.id = PANEL_ID;

  const iframe = document.createElement('iframe');
  iframe.id = \`\${PANEL_ID}-iframe\`;
  iframe.src = SCRUM_POKER_SESSION_URL;

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
  resizer.id = \`\${PANEL_ID}-resizer\`;

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
    if (newWidth >= MIN_WIDTH) container.style.width = \`\${newWidth}px\`;
  };

  const stopResize = () => {
    container.classList.remove('resizing');
    localStorage.setItem(PANEL_WIDTH_KEY, container.offsetWidth);
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  const isInitiallyCollapsed = localStorage.getItem(PANEL_COLLAPSED_KEY) === 'true';
  if (isInitiallyCollapsed) {
    container.classList.add('collapsed');
    toggleButton.innerHTML = ICON_EXPAND;
  } else {
    toggleButton.innerHTML = ICON_COLLAPSE;
  }

  toggleButton.onclick = toggleCollapse;
  closeButton.onclick = permanentlyClose;
  resizer.addEventListener('mousedown', startResize);

  container.appendChild(resizer);
  container.appendChild(toggleButton);
  container.appendChild(closeButton);
  container.appendChild(iframe);
  document.head.appendChild(styleSheet);
  document.body.appendChild(container);

  setTimeout(() => container.classList.add('open'), 50);
})();`;

  return `javascript:${encodeURIComponent(bookmarkletTemplate.trim())}`;
}

/**
 * Initializes the application, handling session creation or joining.
 */
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  sessionId = urlParams.get('session');

  // Check if user ID is already in localStorage
  userId = localStorage.getItem('scrum_poker_global_userid');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('scrum_poker_global_userid', userId);
  }

  // Pre-fill name if available in localStorage
  const savedName = localStorage.getItem('scrum_poker_username');
  if (savedName) {
    nameInput.value = savedName;
  }

  if (sessionId) {
    // Join existing session
    sessionRef = database.ref(`scrum-poker-sessions/${sessionId}`);
    updateSessionUrl();
    listenForSessionChanges();

    // Auto-join if user has a saved name
    if (savedName) {
      // Check if user is already in the session before auto-joining
      sessionRef
        .once('value')
        .then(snapshot => {
          const sessionData = snapshot.val();
          if (sessionData && !sessionData.users?.[userId]) {
            // User is not in session yet, auto-join
            joinSession();
          }
          // Hide loading after checking session
          hideLoadingOverlay();
        })
        .catch(error => {
          console.error('Error checking session:', error);
          hideLoadingOverlay();
        });
    } else {
      // No saved name, show join screen immediately
      hideLoadingOverlay();
    }
  } else {
    // No session, user must create one.
    document.getElementById('session-info').classList.add('hidden');
    joinBtn.disabled = true;
    hideLoadingOverlay();
  }

  generatePokerCards();
}

/**
 * Updates the session URL link and copy functionality.
 */
function updateSessionUrl() {
  const url = window.location.href;
  sessionUrlLink.href = url;
  sessionUrlLink.textContent = `Session: ${sessionId}`;

  // Generate and set QR codes
  const qrUrl = generateQRCode(url);
  qrCode.src = qrUrl;
  qrCodeLarge.src = qrUrl;

  // Generate and set bookmarklet
  const bookmarkletHref = generateBookmarklet(url);
  bookmarkletLink.href = bookmarkletHref;
  bookmarkletCode.value = bookmarkletHref;
} /**
 * Listens for any changes in the session data and re-renders the UI.
 */
function listenForSessionChanges() {
  if (!sessionRef) return;

  sessionRef.on(
    'value',
    snapshot => {
      const sessionData = snapshot.val();
      if (sessionData) {
        render(sessionData);
      } else {
        // Session was likely reset or doesn't exist
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('session')) {
          alert(
            'Session not found or has been deleted. You will be redirected to the homepage.'
          );
          window.location.href = window.location.pathname;
        }
      }
    },
    error => {
      handleDatabaseError(error);
      alert(
        'Could not connect to the session. You will be redirected to the homepage.'
      );
      window.location.href = window.location.pathname;
    }
  );
}

/**
 * Checks if auto-reveal should be triggered (Local Countdown).
 * @param {object} sessionData
 */
function checkAutoReveal(sessionData) {
  if (sessionData.isRevealed) {
    cancelAutoReveal(false);
    return;
  }

  const users = sessionData.users || {};
  const userIds = Object.keys(users).sort();
  const totalUsers = userIds.length;
  const votedUsers = userIds.filter(id => users[id].hasVoted).length;

  // Reset dismissed state if vote count drops
  if (votedUsers < lastVotedCount) {
    autoRevealDismissed = false;
  }
  lastVotedCount = votedUsers;

  if (
    totalUsers > 1 &&
    votedUsers === totalUsers &&
    !autoRevealDismissed &&
    !autoRevealInterval
  ) {
    startLocalAutoReveal(sessionData);
  } else if (votedUsers !== totalUsers) {
    cancelAutoReveal(false);
  }
}

function startLocalAutoReveal(sessionData) {
  autoRevealOverlay.classList.remove('hidden');
  let timeLeft = 3;
  countdownNumber.textContent = timeLeft;

  autoRevealInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      countdownNumber.textContent = timeLeft;
    } else {
      countdownNumber.textContent = '0';
      clearInterval(autoRevealInterval);
      autoRevealInterval = null;

      // Only the leader (or creator) triggers the actual DB update
      const leaderId = Object.keys(sessionData.users || {}).sort()[0];
      if (userId === leaderId || userId === sessionData.creatorId) {
        console.log('Local timer finished. Triggering reveal...');
        revealVotes();
      }
      
      autoRevealOverlay.classList.add('hidden');
    }
  }, 1000);
}

function cancelAutoReveal(dismissed = true) {
  if (autoRevealInterval) {
    clearInterval(autoRevealInterval);
    autoRevealInterval = null;
  }
  autoRevealOverlay.classList.add('hidden');
  if (dismissed) {
    autoRevealDismissed = true;
  }
}

/**
 * Checks if a nudge notification should be shown to the current user.
 * @param {object} sessionData
 */
function checkVoteNudge(sessionData) {
  if (sessionData.isRevealed) {
    hideNotification();
    return;
  }

  const users = sessionData.users || {};
  const currentUser = users[userId];

  if (!currentUser || currentUser.hasVoted || nudgeShown) return;

  const userIds = Object.keys(users);
  const totalUsers = userIds.length;
  if (totalUsers < 3) return; // Don't nudge in very small groups

  const votedCount = userIds.filter(id => users[id].hasVoted).length;
  const participationRate = votedCount / totalUsers;

  if (participationRate >= 0.75) {
    showNotification('Waiting on you! Most of the team has voted.');
    nudgeShown = true;
  }
}

/**
 * Checks if consensus has been reached and triggers animation.
 * @param {object} sessionData
 */
function checkConsensus(sessionData) {
  if (!sessionData.isRevealed) {
    hasShownConsensus = false;
    return;
  }

  if (hasShownConsensus) return;

  const users = sessionData.users || {};
  const votes = Object.values(users)
    .map(u => u.vote)
    .filter(v => v != null);

  if (votes.length < 2) return;

  // Check if all votes are the same
  const firstVote = votes[0];
  const allSame = votes.every(v => v === firstVote);

  if (allSame) {
    triggerConfetti();
    hasShownConsensus = true;
  }
}

/**
 * Triggers a confetti animation on the canvas.
 */
function triggerConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 150;
  const colors = ['#607d8b', '#ffeb3b', '#ff5722', '#4caf50', '#2196f3'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      angle: Math.random() * 360,
      spin: Math.random() * 10 - 5,
    });
  }

  let animationFrame;

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let activeParticles = 0;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.angle += p.spin;

      if (p.y < confettiCanvas.height) {
        activeParticles++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  animate();
}

function showNotification(msg) {
  notificationMessage.textContent = msg;
  notificationToast.classList.remove('hidden');
}

function hideNotification() {
  notificationToast.classList.add('hidden');
}

function resetFeatureState() {
  nudgeShown = false;
  hasShownConsensus = false;
  autoRevealDismissed = false;
  lastVotedCount = 0;
  cancelAutoReveal(false);
  hideNotification();
}

/**
 * Renders the entire UI based on the current session state.
 * @param {object} sessionData - The data for the current session from Firebase.
 */
function render(sessionData) {
  const users = sessionData.users || {};

  // Decide which view to show
  if (users[userId]) {
    userSetupSection.classList.add('hidden');
    pokerRoomSection.classList.remove('hidden');
  } else {
    userSetupSection.classList.remove('hidden');
    pokerRoomSection.classList.add('hidden');
  }

  // Render participants
  participantsList.innerHTML = '';
  for (const id in users) {
    const user = users[id];
    const li = document.createElement('li');

    let voteDisplay = '';
    if (sessionData.isRevealed) {
      voteDisplay = `<span class="vote-status">${
        user.vote != null ? user.vote : '-'
      }</span>`;
    } else {
      const status = user.hasVoted ? 'Voted' : 'Waiting...';
      const statusClass = user.hasVoted ? 'voted' : 'waiting';
      voteDisplay = `<span class="vote-status ${statusClass}">${status}</span>`;
    }

    // Create action buttons
    let actionButtons = '';

    // Rename button for current user
    if (id === userId) {
      actionButtons += `<button class="rename-btn" onclick="renameUser()" title="Rename">✎</button>`;
    }

    // Kick button for other users
    if (id !== userId) {
      actionButtons += `<button class="kick-btn" onclick="kickUser('${id}')" title="Remove user">×</button>`;
    }

    // XSS Fix: Use textContent for user-provided names
    li.innerHTML = `<div class="participant-info"><span></span> ${voteDisplay}</div>${actionButtons}`;
    li.querySelector('span').textContent = user.name;
    participantsList.appendChild(li);
  }

  // Handle suggestion display and card disabling
  if (sessionData.isRevealed) {
    suggestionContainer.classList.remove('hidden');
    const analysis = analyzeVotes(users);
    suggestionValue.textContent = analysis.suggestion;
    if (analysis.suggestion.length > 5) {
      suggestionValue.classList.add('long-text');
    } else {
      suggestionValue.classList.remove('long-text');
    }

    // Display reasoning
    const reasoningEl = document.getElementById('suggestion-reasoning');
    if (reasoningEl) {
      reasoningEl.textContent = analysis.reasoning;
    }

    // Display vote distribution
    const distributionEl = document.getElementById('vote-distribution');
    if (distributionEl) {
      distributionEl.innerHTML = '';
      const sortedVotes = Object.entries(analysis.distribution).sort(
        (a, b) => b[1] - a[1]
      );

      const totalVotes = sortedVotes.reduce((sum, [, count]) => sum + count, 0);

      sortedVotes.forEach(([vote, count]) => {
        const bar = document.createElement('div');
        bar.className = 'distribution-bar';

        const label = document.createElement('span');
        label.className = 'distribution-label';
        label.textContent = vote;

        const barFill = document.createElement('div');
        barFill.className = 'distribution-fill';
        const percentage = (count / totalVotes) * 100;
        barFill.style.width = `${percentage}%`;

        const countLabel = document.createElement('span');
        countLabel.className = 'distribution-count';
        countLabel.textContent = count;

        bar.appendChild(label);
        bar.appendChild(barFill);
        bar.appendChild(countLabel);
        distributionEl.appendChild(bar);
      });
    }

    cardsContainer.classList.add('disabled');
  } else {
    suggestionContainer.classList.add('hidden');
    cardsContainer.classList.remove('disabled');

    // Sync card selection with current user's vote
    document
      .querySelectorAll('.card')
      .forEach(c => c.classList.remove('selected'));

    const currentUser = users[userId];
    if (currentUser && currentUser.vote != null) {
      const selectedCard = document.querySelector(
        `.card[data-value="${currentUser.vote}"]`
      );
      if (selectedCard) {
        selectedCard.classList.add('selected');
      }
    }
  }

  // Feature Checks
  checkAutoReveal(sessionData);
  checkVoteNudge(sessionData);
  checkConsensus(sessionData);
}

/**
 * Calculates vote statistics and distribution.
 * @param {object} users - The user objects from the session data.
 * @returns {object} Vote statistics and reasoning.
 */
function analyzeVotes(users) {
  const allVotes = Object.values(users)
    .map(u => u.vote)
    .filter(v => v != null);

  if (allVotes.length === 0) {
    return {
      suggestion: '-',
      reasoning: 'No votes yet',
      distribution: {},
    };
  }

  // Build vote distribution
  const distribution = {};
  allVotes.forEach(vote => {
    distribution[vote] = (distribution[vote] || 0) + 1;
  });

  // Separate numeric and special votes
  const numericVotes = allVotes.filter(v => !isNaN(v)).map(v => Number(v));
  const coffeeCount = allVotes.filter(v => v === '☕').length;
  const uncertainCount = allVotes.filter(v => v === '?').length;

  // Rule 1: Coffee break majority (>50%)
  if (coffeeCount > allVotes.length / 2) {
    return {
      suggestion: "Let's take a break",
      reasoning: `${coffeeCount}/${allVotes.length} voted for coffee break`,
      distribution,
    };
  }

  // Rule 2: Uncertainty majority (>50%)
  if (uncertainCount > allVotes.length / 2) {
    return {
      suggestion: 'Discuss & Re-vote',
      reasoning: `${uncertainCount}/${allVotes.length} voted uncertain (?)`,
      distribution,
    };
  }

  // Rule 3: No numeric votes
  if (numericVotes.length === 0) {
    const uniqueVotes = [...new Set(allVotes)];
    return {
      suggestion: uniqueVotes.join(' / '),
      reasoning: 'No numeric votes cast',
      distribution,
    };
  }

  // Rule 4: Check for majority consensus (>50% same numeric vote)
  const numericDistribution = {};
  numericVotes.forEach(vote => {
    numericDistribution[vote] = (numericDistribution[vote] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(numericDistribution));
  if (maxCount > numericVotes.length / 2) {
    const consensusValue = Object.keys(numericDistribution).find(
      key => numericDistribution[key] === maxCount
    );
    return {
      suggestion: consensusValue,
      reasoning: `Majority consensus: ${maxCount}/${numericVotes.length} votes`,
      distribution,
    };
  }

  // Rule 5: Check vote spread - if range > 3 Fibonacci steps, discuss
  const sortedVotes = [...numericVotes].sort((a, b) => a - b);
  const min = sortedVotes[0];
  const max = sortedVotes[sortedVotes.length - 1];
  const numericPokerCards = pokerCards.filter(c => !isNaN(c)).map(Number);

  const minIndex = numericPokerCards.indexOf(min);
  const maxIndex = numericPokerCards.indexOf(max);
  const fibonacciSteps = maxIndex - minIndex;

  if (fibonacciSteps > 3) {
    return {
      suggestion: 'Discuss',
      reasoning: `Large spread: ${min} to ${max} (${fibonacciSteps} steps apart)`,
      distribution,
    };
  }

  // Rule 6: Use median for better outlier resistance
  const median =
    numericVotes.length % 2 === 0
      ? (sortedVotes[numericVotes.length / 2 - 1] +
          sortedVotes[numericVotes.length / 2]) /
        2
      : sortedVotes[Math.floor(numericVotes.length / 2)];

  // Rule 7: Round to nearest Fibonacci value (favor lower on exact tie)
  const closest = numericPokerCards.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev - median);
    const currDiff = Math.abs(curr - median);
    if (prevDiff === currDiff) {
      return prev < curr ? prev : curr; // Favor lower on tie
    }
    return currDiff < prevDiff ? curr : prev;
  });

  const avg = (
    numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length
  ).toFixed(1);

  return {
    suggestion: closest.toString(),
    reasoning: `Median: ${median}, Avg: ${avg} → Round to ${closest}`,
    distribution,
  };
}

/**
 * Generates the clickable poker cards.
 */
function generatePokerCards() {
  cardsContainer.innerHTML = '';
  pokerCards.forEach(cardValue => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = cardValue;
    card.dataset.value = cardValue;
    card.addEventListener('click', () => castVote(cardValue));
    cardsContainer.appendChild(card);
  });
}

/**
 * Handles a user joining the session.
 */
function joinSession() {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Please enter your name.');
    return;
  }

  // Save name to localStorage
  localStorage.setItem('scrum_poker_username', name);

  const userRef = sessionRef.child('users').child(userId);
  userRef
    .set({
      name: name,
      vote: null,
      hasVoted: false,
    })
    .catch(handleDatabaseError);
}

/**
 * Casts a vote for the current user.
 * @param {string} vote - The value of the card clicked.
 */
function castVote(vote) {
  sessionRef.once('value', snapshot => {
    const sessionData = snapshot.val();
    // Improvement: Prevent voting if the session is already revealed
    if (sessionData && sessionData.isRevealed) {
      console.log('Voting is closed for this round.');
      return;
    }

    sessionRef
      .child('users')
      .child(userId)
      .update({
        vote: vote,
        hasVoted: true,
      })
      .catch(handleDatabaseError);

    // Highlight selected card
    document
      .querySelectorAll('.card')
      .forEach(c => c.classList.remove('selected'));
    document
      .querySelector(`.card[data-value="${vote}"]`)
      .classList.add('selected');
  });
}

/**
 * Reveals all votes.
 */
function revealVotes() {
  sessionRef.update({ isRevealed: true }).catch(handleDatabaseError);
}

/**
 * Resets the round for a new vote.
 */
function newRound() {
  sessionRef.once('value', snapshot => {
    const sessionData = snapshot.val();
    if (!sessionData) return; // Session doesn't exist, do nothing.

    resetFeatureState();

    const updates = {
      isRevealed: false,
    };

    if (sessionData.users) {
      Object.keys(sessionData.users).forEach(id => {
        updates[`users/${id}/vote`] = null;
        updates[`users/${id}/hasVoted`] = false;
      });
    }

    sessionRef.update(updates).catch(handleDatabaseError);

    // Clear card selection visual state
    document
      .querySelectorAll('.card')
      .forEach(c => c.classList.remove('selected'));
  });
}

/**
 * Kicks a user from the session (available to all users).
 * @param {string} userIdToKick - The ID of the user to remove.
 */
window.kickUser = function kickUser(userIdToKick) {
  if (confirm('Are you sure you want to remove this user from the session?')) {
    sessionRef
      .child('users')
      .child(userIdToKick)
      .remove()
      .catch(handleDatabaseError);
  }
};

/**
 * Allows the current user to rename themselves.
 */
window.renameUser = function renameUser() {
  const currentName = localStorage.getItem('scrum_poker_username') || '';

  const newName = prompt('Enter your new name:', currentName);

  if (newName && newName.trim() && newName.trim() !== currentName) {
    const trimmedName = newName.trim();
    // Update localStorage
    localStorage.setItem('scrum_poker_username', trimmedName);

    // Update in database
    sessionRef
      .child('users')
      .child(userId)
      .update({
        name: trimmedName,
      })
      .catch(handleDatabaseError);
  }
};

// --- Event Listeners ---
joinBtn.addEventListener('click', joinSession);
revealBtn.addEventListener('click', revealVotes);
resetBtn.addEventListener('click', newRound);

cancelRevealBtn.addEventListener('click', () => {
  cancelAutoReveal(true);
});

notificationClose.addEventListener('click', hideNotification);

// Suggestion help modal
const suggestionHelpBtn = document.getElementById('suggestion-help-btn');
const suggestionHelpModal = document.getElementById('suggestion-help-modal');
const suggestionHelpCloseBtn = document.getElementById(
  'suggestion-help-close-btn'
);

if (suggestionHelpBtn) {
  suggestionHelpBtn.addEventListener('click', () => {
    suggestionHelpModal.classList.remove('hidden');
  });
}

if (suggestionHelpCloseBtn) {
  suggestionHelpCloseBtn.addEventListener('click', () => {
    suggestionHelpModal.classList.add('hidden');
  });
}

if (suggestionHelpModal) {
  suggestionHelpModal.addEventListener('click', e => {
    if (e.target === suggestionHelpModal) {
      suggestionHelpModal.classList.add('hidden');
    }
  });
}

createSessionBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Please enter your name before creating a session.');
    return;
  }
  localStorage.setItem('scrum_poker_username', name);

  const newSessionId = database.ref('scrum-poker-sessions').push().key;
  const newSessionRef = database.ref(`scrum-poker-sessions/${newSessionId}`);

  const initialSessionData = {
    users: {
      [userId]: {
        name: name,
        vote: null,
        hasVoted: false,
      },
    },
    isRevealed: false,
    creatorId: userId,
  };

  newSessionRef
    .set(initialSessionData)
    .then(() => {
      window.location.href =
        window.location.pathname + '?session=' + newSessionId;
    })
    .catch(handleDatabaseError);
});

copyContainer.addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      copyFeedback.textContent = 'Copied!';
      setTimeout(() => {
        copyFeedback.textContent = '';
      }, 2000);
    })
    .catch(err => {
      copyFeedback.textContent = 'Failed!';
      console.error('Failed to copy URL: ', err);
    });
});

// QR Modal event listeners
qrCode.addEventListener('click', () => {
  qrModal.classList.remove('hidden');
});

qrCloseBtn.addEventListener('click', () => {
  qrModal.classList.add('hidden');
});

qrModal.addEventListener('click', e => {
  if (e.target === qrModal) {
    qrModal.classList.add('hidden');
  }
});

// Bookmarklet Modal event listeners
bookmarkletBtn.addEventListener('click', () => {
  bookmarkletModal.classList.remove('hidden');
});

bookmarkletCloseBtn.addEventListener('click', () => {
  bookmarkletModal.classList.add('hidden');
});

bookmarkletModal.addEventListener('click', e => {
  if (e.target === bookmarkletModal) {
    bookmarkletModal.classList.add('hidden');
  }
});

copyBookmarkletBtn.addEventListener('click', () => {
  bookmarkletCode.select();
  navigator.clipboard
    .writeText(bookmarkletCode.value)
    .then(() => {
      const originalText = copyBookmarkletBtn.textContent;
      copyBookmarkletBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBookmarkletBtn.textContent = originalText;
      }, 2000);
    })
    .catch(err => {
      console.error('Failed to copy bookmarklet: ', err);
      copyBookmarkletBtn.textContent = 'Failed!';
      setTimeout(() => {
        copyBookmarkletBtn.textContent = 'Copy Code';
      }, 2000);
    });
});

// --- App Initialization ---
// Load configuration from external file.
// IMPORTANT: Create a 'firebase-config.json' in this directory (from firebase-config.json.example)
// with your own Firebase project details and reCAPTCHA v3 site key.
fetch('firebase-config.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(
        'firebase-config.json not found. Please copy firebase-config.json.example to firebase-config.json and fill in your details.'
      );
    }
    return response.json();
  })
  .then(config => {
    // --- Initialize Firebase ---
    firebase.initializeApp(config.firebaseConfig);
    const appCheck = firebase.appCheck();
    appCheck.activate(
      new firebase.appCheck.ReCaptchaV3Provider(config.recaptchaKey),
      true
    );
    database = firebase.database();

    // --- Authenticate and Start App ---
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously.');
        init();
      })
      .catch(error => {
        console.error('Anonymous sign-in failed:', error);
        hideLoadingOverlay();
        alert('Could not connect to the session. Please refresh the page.');
      });
  })
  .catch(error => {
    console.error('Initialization failed:', error);
    hideLoadingOverlay();
    alert(`Error: ${error.message}`);
  });
