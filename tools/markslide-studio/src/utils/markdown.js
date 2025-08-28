// Syntax highlighter for markdown editor
// Returns syntax-highlighted HTML spans instead of rendered markdown

export const parseMarkdownForPreview = markdown => {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const highlightedLines = [];

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let highlightedLine = '';

    // Handle code blocks
    if (line.match(/^```/)) {
      if (!inCodeBlock) {
        // Starting code block
        inCodeBlock = true;
        highlightedLine = `<span class="md-code-fence">${escapeHtml(line)}</span>`;
      } else {
        // Ending code block
        inCodeBlock = false;
        highlightedLine = `<span class="md-code-fence">${escapeHtml(line)}</span>`;
      }
    } else if (inCodeBlock) {
      // Inside code block - minimal highlighting
      highlightedLine = `<span class="md-code-block">${escapeHtml(line)}</span>`;
    } else {
      // Regular markdown syntax highlighting
      highlightedLine = highlightMarkdownSyntax(line);
    }

    highlightedLines.push(highlightedLine);
  }

  return highlightedLines.join('\n');
};

// Highlight markdown syntax elements
const highlightMarkdownSyntax = line => {
  let highlighted = escapeHtml(line);

  // Headers
  highlighted = highlighted.replace(
    /^(#{1,6})\s+(.*)$/,
    '<span class="md-header-marker">$1</span> <span class="md-header-text">$2</span>'
  );

  // Horizontal rules
  highlighted = highlighted.replace(
    /^(---+|\*\*\*+|___+)$/,
    '<span class="md-hr">$1</span>'
  );

  // Lists
  highlighted = highlighted.replace(
    /^(\s*)([-*+])\s+(.*)$/,
    '$1<span class="md-list-marker">$2</span> <span class="md-list-text">$3</span>'
  );

  highlighted = highlighted.replace(
    /^(\s*)(\d+\.)\s+(.*)$/,
    '$1<span class="md-list-marker">$2</span> <span class="md-list-text">$3</span>'
  );

  // Task lists
  highlighted = highlighted.replace(
    /^(\s*[-*+]\s+)(\[[ x]\])\s+(.*)$/,
    '$1<span class="md-task-marker">$2</span> <span class="md-task-text">$3</span>'
  );

  // Blockquotes
  highlighted = highlighted.replace(
    /^(>\s?)(.*)$/,
    '<span class="md-blockquote-marker">$1</span><span class="md-blockquote-text">$2</span>'
  );

  // Bold text
  highlighted = highlighted.replace(
    /(\*\*|__)(.*?)\1/g,
    '<span class="md-bold-marker">$1</span><span class="md-bold-text">$2</span><span class="md-bold-marker">$1</span>'
  );

  // Italic text (after bold to avoid conflicts)
  highlighted = highlighted.replace(
    /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g,
    '<span class="md-italic-marker">*</span><span class="md-italic-text">$1</span><span class="md-italic-marker">*</span>'
  );

  highlighted = highlighted.replace(
    /(?<!_)_(?!_)([^_]+)_(?!_)/g,
    '<span class="md-italic-marker">_</span><span class="md-italic-text">$1</span><span class="md-italic-marker">_</span>'
  );

  // Strikethrough
  highlighted = highlighted.replace(
    /(~~)(.*?)\1/g,
    '<span class="md-strikethrough-marker">$1</span><span class="md-strikethrough-text">$2</span><span class="md-strikethrough-marker">$1</span>'
  );

  // Inline code
  highlighted = highlighted.replace(
    /(`+)([^`]+)\1/g,
    '<span class="md-code-marker">$1</span><span class="md-code-text">$2</span><span class="md-code-marker">$1</span>'
  );

  // Links
  highlighted = highlighted.replace(
    /(\[)([^\]]+)(\])(\()([^)]+)(\))/g,
    '<span class="md-link-marker">$1</span><span class="md-link-text">$2</span><span class="md-link-marker">$3$4</span><span class="md-link-url">$5</span><span class="md-link-marker">$6</span>'
  );

  // Images
  highlighted = highlighted.replace(
    /(!\[)([^\]]*)(\])(\()([^)]+)(\))/g,
    '<span class="md-image-marker">$1</span><span class="md-image-alt">$2</span><span class="md-image-marker">$3$4</span><span class="md-image-url">$5</span><span class="md-image-marker">$6</span>'
  );

  // Superscript and subscript
  highlighted = highlighted.replace(
    /(\^)([^^]+)(\^)/g,
    '<span class="md-sup-marker">$1</span><span class="md-sup-text">$2</span><span class="md-sup-marker">$3</span>'
  );

  highlighted = highlighted.replace(
    /(~)([^~]+)(~)/g,
    '<span class="md-sub-marker">$1</span><span class="md-sub-text">$2</span><span class="md-sub-marker">$3</span>'
  );

  return highlighted;
};

// Escape HTML characters
const escapeHtml = text => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Keyboard shortcut handlers
export const handleKeyboardShortcuts = (event, textarea) => {
  const { ctrlKey, metaKey, key } = event;
  const isModKey = ctrlKey || metaKey;

  if (!isModKey) return false;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);

  let replacement = null;

  switch (key.toLowerCase()) {
    case 'b':
      replacement = selectedText ? `**${selectedText}**` : '**bold**';
      break;
    case 'i':
      replacement = selectedText ? `*${selectedText}*` : '*italic*';
      break;
    case '`':
    case 'backquote':
      replacement = selectedText ? `\`${selectedText}\`` : '`code`';
      break;
    default:
      return false;
  }

  if (replacement) {
    event.preventDefault();

    const newValue =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    // Update textarea value
    textarea.value = newValue;

    // Set cursor position
    const newCursorPos = selectedText
      ? start + replacement.length
      : start + replacement.length - (replacement.includes('**') ? 2 : 1);

    textarea.setSelectionRange(newCursorPos, newCursorPos);

    // Trigger change event
    const changeEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(changeEvent);

    return true;
  }

  return false;
};
