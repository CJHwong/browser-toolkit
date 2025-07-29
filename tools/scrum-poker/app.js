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

// --- App State ---
let sessionId = null;
let userId = null;
let sessionRef = null;
let database = null;
const pokerCards = ['0', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];

// --- Core Functions ---

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
 * Initializes the application, handling session creation or joining.
 */
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  sessionId = urlParams.get('session');

  if (sessionId) {
    // Join existing session
    sessionRef = database.ref(`scrum-poker-sessions/${sessionId}`);
    updateSessionUrl();
    listenForSessionChanges();
  } else {
    // No session, user must create one.
    document.getElementById('session-info').classList.add('hidden');
    joinBtn.disabled = true;
  }

  generatePokerCards();

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
}

/**
 * Updates the session URL link and copy functionality.
 */
function updateSessionUrl() {
  const url = window.location.href;
  sessionUrlLink.href = url;
  sessionUrlLink.textContent = `Session: ${sessionId}`;
}

/**
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

    // XSS Fix: Use textContent for user-provided names
    li.innerHTML = `<span></span> ${voteDisplay}`;
    li.querySelector('span').textContent = user.name;
    participantsList.appendChild(li);
  }

  // Handle suggestion display and card disabling
  if (sessionData.isRevealed) {
    suggestionContainer.classList.remove('hidden');
    const suggestion = calculateSuggestion(users);
    suggestionValue.textContent = suggestion;
    if (suggestion.length > 5) {
      suggestionValue.classList.add('long-text');
    } else {
      suggestionValue.classList.remove('long-text');
    }
    cardsContainer.classList.add('disabled');
  } else {
    suggestionContainer.classList.add('hidden');
    cardsContainer.classList.remove('disabled');
  }
}

/**
 * Calculates a suggested vote based on the revealed results.
 * @param {object} users - The user objects from the session data.
 * @returns {string} The suggested value or "Discuss".
 */
function calculateSuggestion(users) {
  const allVotes = Object.values(users)
    .map(u => u.vote)
    .filter(v => v != null);

  if (allVotes.length === 0) {
    return '-';
  }

  // 1. Check for coffee break
  const coffeeVotesCount = allVotes.filter(v => v === '☕').length;
  if (coffeeVotesCount > allVotes.length / 2) {
    return "Let's take a break";
  }

  // 2. Check for major disagreement
  const uniqueVotes = [...new Set(allVotes)];
  if (uniqueVotes.length > 2) {
    return 'Discuss';
  }

  // 3. If not major disagreement, calculate suggestion
  const numericVotes = allVotes.filter(v => !isNaN(v)).map(v => Number(v));

  if (numericVotes.length === 0) {
    // Only non-numeric votes left (e.g., ['?'] or ['?', '☕'])
    return uniqueVotes.join(' / '); // e.g. "? / ☕"
  }

  const average =
    numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length;

  const numericPokerCards = pokerCards.filter(c => !isNaN(c)).map(Number);

  // Find the closest valid card value to the average
  const closest = numericPokerCards.reduce((prev, curr) => {
    return Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev;
  });

  return closest.toString();
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
  });
}

// --- Event Listeners ---
joinBtn.addEventListener('click', joinSession);
revealBtn.addEventListener('click', revealVotes);
resetBtn.addEventListener('click', newRound);

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
        alert('Could not connect to the session. Please refresh the page.');
      });
  })
  .catch(error => {
    console.error('Initialization failed:', error);
    alert(`Error: ${error.message}`);
  });
