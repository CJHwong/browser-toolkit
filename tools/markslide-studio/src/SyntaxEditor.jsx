import { useState, useRef, useEffect, useCallback } from 'react';
import {
  parseMarkdownForPreview,
  handleKeyboardShortcuts,
} from './utils/markdown';
import './SyntaxEditor.css';

// The design was inspired by https://overtype.dev/

const SyntaxEditor = ({
  value,
  onChange,
  placeholder = 'Enter your markdown here...',
}) => {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Parse markdown to HTML for preview
  const previewHTML = parseMarkdownForPreview(value);

  // Sync scroll between textarea and preview
  const syncScroll = useCallback(() => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;

      // Calculate scroll percentage
      const scrollPercentage =
        textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);

      // Apply to preview
      const maxScroll = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = scrollPercentage * maxScroll;
    }
  }, []);

  // Handle textarea input
  const handleTextareaChange = useCallback(
    event => {
      onChange(event.target.value);
    },
    [onChange]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    event => {
      const handled = handleKeyboardShortcuts(event, textareaRef.current);
      if (handled) {
        // Trigger change event for React
        onChange(textareaRef.current.value);
      }
    },
    [onChange]
  );

  // Handle focus and blur
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Update textarea value when prop changes
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value;
    }
  }, [value]);

  return (
    <div className="syntax-editor" ref={containerRef}>
      {/* Preview layer (behind textarea) */}
      <div
        className="syntax-preview"
        ref={previewRef}
        dangerouslySetInnerHTML={{ __html: previewHTML }}
        aria-hidden="true"
      />

      {/* Transparent textarea (on top) */}
      <textarea
        ref={textareaRef}
        className={`syntax-textarea ${isFocused ? 'focused' : ''}`}
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onScroll={syncScroll}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {/* Keyboard shortcuts hint */}
      <div className="syntax-shortcuts">
        <span className="shortcut-hint">
          <kbd>⌘B</kbd> Bold • <kbd>⌘I</kbd> Italic • <kbd>⌘`</kbd> Code
        </span>
      </div>
    </div>
  );
};

export default SyntaxEditor;
