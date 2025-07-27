(function () {
  const generateBtn = document.getElementById('generate-btn');
  const jsInput = document.getElementById('js-input');
  const outputContainer = document.getElementById('output-container');
  const bookmarkletLinkContainer = document.getElementById(
    'bookmarklet-link-container'
  );
  const rawOutput = document.getElementById('raw-output');
  const copyBtn = document.getElementById('copy-btn');

  generateBtn.addEventListener('click', () => {
    const rawJs = jsInput.value;
    if (!rawJs.trim()) {
      alert('Please enter some JavaScript code.');
      return;
    }

    // 1. Trim whitespace. We are NOT removing comments as it's unreliable
    // and can corrupt strings (e.g. in URLs). The user should provide
    // clean, valid JavaScript.
    const processedJs = rawJs.trim();

    // 2. Wrap in a void IIFE for safety using string concatenation
    // to avoid issues with backticks in the source code.
    const bookmarkletJs = 'void(function(){' + processedJs + '})()';

    // 3. URL-encode the final code
    const encodedJs = encodeURIComponent(bookmarkletJs);

    // 4. Create the final bookmarklet string
    const bookmarkletCode = 'javascript:' + encodedJs;

    // 5. Display the output
    outputContainer.classList.remove('hidden');

    // Create draggable link
    const bookmarkletLink = document.createElement('a');
    bookmarkletLink.href = bookmarkletCode;
    bookmarkletLink.textContent = 'Drag Me to Bookmarks';
    bookmarkletLinkContainer.innerHTML = ''; // Clear previous link
    bookmarkletLinkContainer.appendChild(bookmarkletLink);

    // Show raw code
    rawOutput.value = bookmarkletCode;
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard
      .writeText(rawOutput.value)
      .then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please copy it manually.');
      });
  });
})();
