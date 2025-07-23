import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { markslideThemeCSS } from './theme/markslide.js';
import { zenburnLightCSS } from './theme/zenburn-light.js';

// Configuration constants
const REVEAL_JS_VERSION = '5.2.1';
const CDN_BASE_URL = `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/${REVEAL_JS_VERSION}`;

const THEME_OPTIONS = [
  { value: 'markslide', label: 'MarkSlide' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'league', label: 'League' },
  { value: 'beige', label: 'Beige' },
  { value: 'sky', label: 'Sky' },
  { value: 'night', label: 'Night' },
  { value: 'serif', label: 'Serif' },
  { value: 'simple', label: 'Simple' },
  { value: 'solarized', label: 'Solarized' },
  { value: 'blood', label: 'Blood' },
  { value: 'moon', label: 'Moon' },
];

const TRANSITION_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
  { value: 'convex', label: 'Convex' },
  { value: 'concave', label: 'Concave' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'none', label: 'None' },
];

const DEFAULT_MARKDOWN = `# 🚀 Welcome to My Presentation

---

## Auto-Animate Demo {data-auto-animate}

# Moving Title {data-id="title"}

Simple text animation that works perfectly!

<aside class="notes">
  Welcome everyone! This slide demonstrates auto-animate with a simple title that will change color and text on the next slide.
</aside>

---

## Auto-Animate Demo {data-auto-animate}

# Moving Title (Now Red!) {data-id="title" style="color: red;"}

The text smoothly changes color and content!

<aside class="notes">
  Notice how the title smoothly animated from the previous slide. The color changed to red and the text updated seamlessly.
</aside>

---

## 📊 Vertical Slides Example

This slide has vertical content below

Press ↓ to explore more!

<aside class="notes">
  This slide introduces vertical navigation. Remind the audience to use the down arrow to see more detailed information.
</aside>

--

### 📈 Chart Data

![Chart](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAwIiB4PSI0MCIgeT0iMjUiIGZpbGw9IiNmZjZiNmIiLz4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTIwIiB4PSIxMDAiIHk9IjUiIGZpbGw9IiM0ZWNkYzQiLz4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTEwIiB4PSIxNjAiIHk9IjE1IiBmaWxsPSIjNDViN2QxIi8+CiAgPHRleHQgeD0iNjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RMTwvdGV4dD4KICA8dGV4dCB4PSIxMjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RMjwvdGV4dD4KICA8dGV4dCB4PSIxODAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RMzwvdGV4dD4KPC9zdmc+) 

- **Q1 2024**: 150% growth
- **Q2 2024**: 200% growth  
- **Q3 2024**: 180% growth


<aside class="notes">
  Our growth metrics show strong performance across all quarters. The SVG chart visualizes this data clearly, with Q2 showing our peak performance at 200% growth.
</aside>

--

### 🎯 Goals & Metrics

**Key Performance Indicators:**

- Customer Satisfaction: **95%**
- Response Time: **< 2 seconds**
- Uptime: **99.9%**

### 🏆 Achievement Unlocked
**99.9% Uptime Maintained!**

<aside class="notes">
  These KPIs demonstrate our commitment to excellence. The 99.9% uptime is particularly noteworthy and shows our reliability.
</aside>

--

### 📋 Action Items

1. **Implement new features** by *end of month*
2. **Optimize performance** using [latest tools](https://example.com/tools)
3. **Team training** on new \`frameworks\`

<aside class="notes">
  Here are our key action items. Make sure to emphasize the deadlines and the importance of team training.
</aside>

---

## 💻 Code Evolution {data-auto-animate}

\`\`\`javascript {data-id="code-demo"}
// Simple function
function greet() {
  return "Hello!";
}
\`\`\`

<aside class="notes">
  We start with a simple function. This will evolve through the next few slides to show progressively more complex code.
</aside>

---

## 💻 Code Evolution {data-auto-animate}

\`\`\`javascript {data-id="code-demo"}
// Enhanced function with parameters
function greet(name, time) {
  const timeGreeting = getTimeGreeting(time);
  return \`\${timeGreeting}, \${name}!\`;
}

function getTimeGreeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
\`\`\`

<aside class="notes">
  Now we've enhanced the function to accept parameters and use helper functions. The code smoothly animated from the previous version.
</aside>

---

## 🌍 Unicode Support

This presentation supports **全世界** (worldwide) content:

- 🇯🇵 こんにちは (Hello in Japanese)
- 🇪🇸 ¡Hola! (Hello in Spanish)  
- 🇷🇺 Привет! (Hello in Russian)
- 🇨🇳 你好! (Hello in Chinese)
- 🇦🇪 مرحبا! (Hello in Arabic)
- Mathematical symbols: ∑ ∫ ∞ ≠ ≤ ≥
- Emojis work perfectly: 🎨 🚀 💡 ⚡ 🌟

<aside class="notes">
  This slide demonstrates full Unicode support. All international characters, mathematical symbols, and emojis render correctly in both the preview and downloaded HTML.
</aside>

---

## 🎤 Speaker Notes Demo

This slide demonstrates speaker notes functionality.

**Press 'S' to open speaker view** (works in downloaded HTML)

<aside class="notes">
  These are speaker notes! They appear in speaker view but not on the main presentation.
  
  Key points to remember:
  - Speaker notes support markdown formatting
  - You can see current and next slides
  - Timer shows elapsed time
  - Use this for detailed talking points
  
  **Pro tip:** Practice with speaker notes to improve your presentation flow!
</aside>

---

## 🎉 Thank You!

### Questions or feedback?

*Let's connect and build amazing presentations together!*

**Contact:** [hello@example.com](mailto:hello@example.com)

🚀 **Happy Presenting!** 🚀

<aside class="notes">
  End on a positive note. Thank the audience and open the floor for questions. Remember to provide contact information for follow-up discussions.
</aside>`;

// Utility functions
const createFilenameFriendlyString = title => {
  return title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50);
};

const extractTitleFromMarkdown = markdown => {
  const firstSlide = markdown.split(/\n---\n/)[0];
  const titleMatch = firstSlide.match(/^#\s+(.+)$/m);

  if (titleMatch) {
    return createFilenameFriendlyString(titleMatch[1]);
  }
  return 'presentation-offline';
};

// Markdown processing functions
const extractSlideAttributes = content => {
  const headerWithAttrs = content.match(/^(#{1,6})\s+(.*?)\s*\{([^}]+)\}/m);
  if (headerWithAttrs) {
    const [fullMatch, hashes, title, attrs] = headerWithAttrs;
    const newContent = content.replace(fullMatch, `${hashes} ${title}`);
    return {
      content: newContent,
      attributes: ` ${attrs}`,
    };
  }
  return { content, attributes: '' };
};

const processLists = content => {
  const lines = content.split('\n');
  const result = [];
  let currentList = null;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for unordered list items (-, *, +)
    const unorderedMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
    // Check for ordered list items (1., 2., etc.)
    const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);

    if (unorderedMatch) {
      if (currentList === null || listType !== 'ul') {
        if (currentList !== null) {
          result.push(`</${listType}>`);
        }
        currentList = [];
        listType = 'ul';
        result.push('<ul>');
      }
      result.push(`<li>${unorderedMatch[1]}</li>`);
    } else if (orderedMatch) {
      if (currentList === null || listType !== 'ol') {
        if (currentList !== null) {
          result.push(`</${listType}>`);
        }
        currentList = [];
        listType = 'ol';
        result.push('<ol>');
      }
      result.push(`<li>${orderedMatch[1]}</li>`);
    } else {
      // Not a list item
      if (currentList !== null) {
        result.push(`</${listType}>`);
        currentList = null;
        listType = null;
      }
      result.push(line);
    }
  }

  // Close any remaining list
  if (currentList !== null) {
    result.push(`</${listType}>`);
  }

  return result.join('\n');
};

const processSlideContent = content => {
  const codeBlocks = [];
  const speakerNotes = [];
  let codeIndex = 0;
  let notesIndex = 0;

  // Extract and placeholder speaker notes first
  content = content.replace(
    /<aside class="notes">([\s\S]*?)<\/aside>/g,
    (match, noteContent) => {
      const placeholder = `__SPEAKER_NOTE_${notesIndex}__`;
      speakerNotes[notesIndex] =
        `<aside class="notes">${noteContent.trim()}</aside>`;
      notesIndex++;
      return placeholder;
    }
  );

  // Extract and placeholder code blocks
  content = content.replace(
    /```(\w+)?\s*\{([^}]+)\}?\s*\n([\s\S]*?)```/g,
    (match, lang, attrs, code) => {
      const placeholder = `__CODE_BLOCK_${codeIndex}__`;
      if (attrs && attrs.includes('data-id')) {
        codeBlocks[codeIndex] =
          `<pre ${attrs}><code class="language-${lang || ''}" data-trim data-line-numbers>${code.trim()}</code></pre>`;
      } else {
        codeBlocks[codeIndex] =
          `<pre><code class="language-${lang || ''}" ${attrs || ''} data-trim>${code.trim()}</code></pre>`;
      }
      codeIndex++;
      return placeholder;
    }
  );

  content = content.replace(
    /```(\w+)?\s*\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeIndex}__`;
      codeBlocks[codeIndex] =
        `<pre><code class="language-${lang || ''}" data-trim>${code.trim()}</code></pre>`;
      codeIndex++;
      return placeholder;
    }
  );

  // Process markdown elements
  let processed = content
    .replace(/^###### (.*?)\s*\{([^}]+)\}/gm, '<h6 $2>$1</h6>')
    .replace(/^##### (.*?)\s*\{([^}]+)\}/gm, '<h5 $2>$1<\/h5>')
    .replace(/^#### (.*?)\s*\{([^}]+)\}/gm, '<h4 $2>$1<\/h4>')
    .replace(/^### (.*?)\s*\{([^}]+)\}/gm, '<h3 $2>$1<\/h3>')
    .replace(/^## (.*?)\s*\{([^}]+)\}/gm, '<h2 $2>$1<\/h2>')
    .replace(/^# (.*?)\s*\{([^}]+)\}/gm, '<h1 $2>$1<\/h1>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1<\/h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1<\/h4>')
    .replace(/^### (.*$)/gm, '<h3>$1<\/h3>')
    .replace(/^## (.*$)/gm, '<h2>$1<\/h2>')
    .replace(/^# (.*$)/gm, '<h1>$1<\/h1>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" \/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1<\/a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>')
    .replace(/\*(.*?)\*/g, '<em>$1<\/em>')
    .replace(/`([^`]+)`/g, '<code>$1<\/code>');

  // Process lists
  processed = processLists(processed);

  // Handle paragraphs
  const lines = processed.split('\n');
  const processedLines = lines
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      if (
        line.match(/^<[^>]+>/) ||
        line.match(/^__CODE_BLOCK_\d+__$/) ||
        line.match(/^__SPEAKER_NOTE_\d+__$/) ||
        line.match(/<\/[^>]+>$/)
      ) {
        return line;
      } else if (!line.match(/^<\/?\w+/)) {
        return `<p>${line}<\/p>`;
      }
      return line;
    });

  processed = processedLines.join('\n');

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    processed = processed.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Restore speaker notes
  speakerNotes.forEach((note, index) => {
    processed = processed.replace(`__SPEAKER_NOTE_${index}__`, note);
  });

  return processed;
};

const convertMarkdownToSlides = markdown => {
  const horizontalSlides = markdown.split(/\n---\n/);

  const sections = horizontalSlides.map(horizontalSlide => {
    const verticalSlides = horizontalSlide.split(/\n--\n/);

    if (verticalSlides.length > 1) {
      const verticalSections = verticalSlides
        .map(slide => {
          const { content, attributes } = extractSlideAttributes(slide.trim());
          return `            <section${attributes}>
                ${processSlideContent(content)}
            <\/section>`;
        })
        .join('\n');
      return `        <section>
${verticalSections}
        <\/section>`;
    } else {
      const { content, attributes } = extractSlideAttributes(
        horizontalSlide.trim()
      );
      return `            <section${attributes}>
                ${processSlideContent(content)}
            <\/section>`;
    }
  });

  return sections.join('\n');
};

// Component subcomponents
const ThemeSelector = ({ value, onChange }) => (
  <div className="min-w-[120px]">
    <label className="text-sm font-medium text-text-secondary">Theme</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-surface"
      aria-label="Select presentation theme"
    >
      {THEME_OPTIONS.map(theme => (
        <option key={theme.value} value={theme.value}>
          {theme.label}
        </option>
      ))}
    </select>
  </div>
);

const TransitionSelector = ({ value, onChange }) => (
  <div className="min-w-[120px]">
    <label className="text-sm font-medium text-text-secondary">
      Transition
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-surface"
      aria-label="Select slide transition"
    >
      {TRANSITION_OPTIONS.map(transition => (
        <option key={transition.value} value={transition.value}>
          {transition.label}
        </option>
      ))}
    </select>
  </div>
);

const ProTipsSection = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Default to expanded when screen is wide enough (lg breakpoint: 1024px)
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      const isWideScreen = window.innerWidth >= 1024;
      setIsExpanded(isWideScreen);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mt-2 p-3 bg-surface border border-border rounded-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-text-primary"
      >
        <span>Pro Tips & Best Practices</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ul className="space-y-2 text-xs text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Arrow keys navigate: ← → ↑ ↓</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Downloaded HTML works offline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Press{' '}
                <kbd className="px-1.5 py-0.5 font-sans rounded bg-border text-text-primary">
                  S
                </kbd>{' '}
                for speaker view (in downloaded HTML)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Press{' '}
                <kbd className="px-1.5 py-0.5 font-sans rounded bg-border text-text-primary">
                  F
                </kbd>{' '}
                for fullscreen mode
              </span>
            </li>
          </ul>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Press{' '}
                <kbd className="px-1.5 py-0.5 font-sans rounded bg-border text-text-primary">
                  ESC
                </kbd>{' '}
                for overview mode
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Vertical slides (
                <code className="px-1.5 py-0.5 font-sans rounded bg-border text-text-primary">
                  --
                </code>
                ) create sub-sections
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                Use same{' '}
                <code className="px-1.5 py-0.5 font-sans rounded bg-border text-text-primary">
                  data-id
                </code>{' '}
                for smooth animations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Full Unicode support: 🌍 中文 العربية</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const DocumentationSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const copyAIDocumentation = () => {
    const aiDoc = `# MarkSlide Studio - AI Documentation\n\n## Purpose\nMarkSlide Studio converts Markdown to Reveal.js presentations with advanced features.\n\n## Core Markdown Syntax\n\n### Slide Navigation\n- \`---\` = New horizontal slide (main sections)\n- \`--\` = New vertical slide (sub-sections under main slides)\n\n### Text Formatting\n- \`**text**\` = Bold text\n- \`*text*\` = Italic text\n- \`\`code\`\` = Inline code\n- \`# ## ### #### ##### ######\` = Headers (h1-h6)\n\n### Lists\n- \`- * +\` = Unordered/bullet lists\n- \`1. 2. 3.\` = Ordered/numbered lists\n\n### Links & Media\n- \`[text](url)\` = Clickable links\n- \`![alt](image.jpg)\` = Embedded images\n\n## Advanced Features\n\n### Auto-Animate Slides\nCreate smooth transitions between slides with matching elements:\n\`\`\`markdown\n## My Title {data-auto-animate}\n# Moving Element {data-id="unique"}\nContent here\n\n---\n\n## My Title {data-auto-animate}\n# Moving Element {data-id="unique" style="color: red;"}\nNew content!\n\`\`\`\nKey: Use same data-id across consecutive slides for smooth animations.\n\n### Speaker Notes\nAdd private notes visible only in speaker view:\n\`\`\`markdown\n## My Slide\nVisible content here\n\n<aside class="notes">\n  Private speaker notes\n  • Key talking points\n  • Reminders\n</aside>\n\`\`\`\nAccess: Press 'S' in downloaded HTML to open speaker view.\n\n### Code Presentations\nBasic code blocks:\n\`\`\`javascript\nfunction hello() {\n  return "Hello World!";\n}\n\`\`\`\n\nAnimated code (for code evolution demos):\n\`\`\`javascript {data-id="code"}\nfunction hello() {\n  return "Hello!";\n}\n\`\`\`\n\n## Usage Instructions\n1. Enter Markdown in the left editor panel\n2. Select theme and transition in the dropdowns\n3. Preview updates in real-time on the right panel\n4. Download self-contained HTML file for presentations\n5. Use arrow keys to navigate slides in preview\n6. Press 'S' in downloaded HTML for speaker view\n\n## Technical Notes\n- Full Unicode support (international characters, emojis, math symbols)\n- Offline functionality in downloaded HTML\n- Built on Reveal.js ${REVEAL_JS_VERSION}\n- Responsive design for all screen sizes\n- Code syntax highlighting included\n\n## Best Practices\n- Use same data-id across consecutive auto-animate slides\n- Vertical slides (--) create detailed sub-sections\n- Add speaker notes for professional presentations\n- Test navigation with arrow keys before presenting\n- Download HTML for offline presenting`;

    navigator.clipboard
      .writeText(aiDoc)
      .then(() => {
        alert('📋 AI-friendly documentation copied to clipboard!');
      })
      .catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = aiDoc;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('📋 AI-friendly documentation copied to clipboard!');
      });
  };

  return (
    <div className="mt-4 p-3 bg-surface border border-border rounded-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm font-semibold text-text-primary"
      >
        <div className="flex items-center gap-3">
          <span>Full Documentation</span>
          <button
            onClick={e => {
              e.stopPropagation();
              copyAIDocumentation();
            }}
            className="px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 text-xs font-semibold transition-colors flex items-center gap-2 flex-shrink-0"
            title="Copy documentation in AI-friendly format"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 4h6m-6 4h6m-6 4h6"
              />
            </svg>
            <span>Copy for AI</span>
          </button>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 text-xs text-text-secondary">
          {/* Basic Markdown Section */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">
              Markdown Syntax
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="bg-sidebar rounded p-2 border border-border">
                  <h5 className="font-semibold text-text-primary mb-1.5 text-sm">
                    Slide Navigation
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        ---
                      </code>
                      <span>New horizontal slide</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        --
                      </code>
                      <span>New vertical slide</span>
                    </div>
                  </div>
                </div>

                <div className="bg-sidebar rounded p-2 border border-border">
                  <h5 className="font-semibold text-text-primary mb-1.5 text-sm">
                    Text Formatting
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        **bold**
                      </code>
                      <span>Bold text</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        *italic*
                      </code>
                      <span>Italic text</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                        `code`
                      </code>
                      <span>Inline code</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-sidebar rounded p-2 border border-border">
                  <h5 className="font-semibold text-text-primary mb-1.5 text-sm">
                    Headers & Lists
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono">
                        # ## ###
                      </code>
                      <span>Headers (h1-h6)</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono">
                        - * +
                      </code>
                      <span>Bullet lists</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono">
                        1. 2. 3.
                      </code>
                      <span>Numbered lists</span>
                    </div>
                  </div>
                </div>

                <div className="bg-sidebar rounded p-2 border border-border">
                  <h5 className="font-semibold text-text-primary mb-1.5 text-sm">
                    Links & Images
                  </h5>
                  <div className="space-y-1">
                    <div className="py-1">
                      <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono block mb-1">
                        [text](url)
                      </code>
                      <span>Clickable links</span>
                    </div>
                    <div className="py-1">
                      <code className="bg-primary/10 text-primary px-3 py-1 rounded font-mono block mb-1">
                        ![alt](image.jpg)
                      </code>
                      <span>Embedded images</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Features Section */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              Advanced Features
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-sidebar rounded-lg p-3 border border-border">
                <h5 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                  ✨ Auto-Animate Slides
                </h5>
                <p className="text-xs text-text-secondary mb-3">
                  Create smooth transitions between slides with matching
                  elements.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-text-primary mb-1">
                      Enable auto-animate:
                    </p>
                    <code className="bg-background text-text-primary px-3 py-2 rounded block font-mono w-full text-left">
                      {`## My Title {data-auto-animate}\n\n# Element {data-id="unique"}`}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary mb-1">
                      Next slide (same data-id):
                    </p>
                    <code className="bg-background text-text-primary px-3 py-2 rounded block font-mono w-full text-left">
                      {`## My Title {data-auto-animate}\n\n# Element {data-id="unique"}`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-sidebar rounded-lg p-3 border border-border">
                <h5 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                  🎤 Speaker Notes
                </h5>
                <p className="text-xs text-text-secondary mb-3">
                  Add private notes visible only in speaker view (press 'S' in
                  downloaded HTML).
                </p>
                <div className="space-y-2">
                  <code className="bg-background text-text-primary px-3 py-2 rounded block font-mono w-full text-left">
                    {`<aside class="notes">\n  Private speaker notes\n</aside>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RevealJSGenerator = () => {
  const [markdownInput, setMarkdownInput] = useState(DEFAULT_MARKDOWN);
  const [selectedTheme, setSelectedTheme] = useState('markslide');
  const [selectedTransition, setSelectedTransition] = useState('slide');
  const [isDownloading, setIsDownloading] = useState(false);

  const previewIframeRef = useRef(null);

  // Memoized presentation HTML to prevent unnecessary recalculation
  const presentationHTML = useMemo(() => {
    const slidesHtml = convertMarkdownToSlides(markdownInput);
    const themeMarkup =
      selectedTheme === 'markslide'
        ? `<style>${markslideThemeCSS}</style>`
        : `<link rel="stylesheet" href="${CDN_BASE_URL}/theme/${selectedTheme}.min.css">`;

    const highlightThemeMarkup =
      selectedTheme === 'markslide'
        ? `<style>${zenburnLightCSS}</style>`
        : `<link rel="stylesheet" href="${CDN_BASE_URL}/plugin/highlight/zenburn.min.css">`;

    return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="${CDN_BASE_URL}/reveal.min.css">
    ${themeMarkup}
    ${highlightThemeMarkup}
    <style>
        .reveal pre code {
            max-height: 600px; /* Increased max-height for better viewing */
            width: 100%;
            display: block;
            overflow-x: auto;
        }
        .reveal pre {
            width: 100%;
            margin: 0 auto;
            font-size: 0.55em;
        }
        .reveal code {
            max-height: none;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            ${slidesHtml}
        </div>
    </div>

    <script src="${CDN_BASE_URL}/reveal.min.js"></script>
    <script src="${CDN_BASE_URL}/plugin/highlight/highlight.min.js"></script>
    <script src="${CDN_BASE_URL}/plugin/notes/notes.min.js"></script>
    
    <script>
        Reveal.initialize({
            transition: '${selectedTransition}',
            plugins: [RevealHighlight, RevealNotes]
        });
        
        // Disable speaker view in preview mode
        document.addEventListener('keydown', function(e) {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                // You can optionally show a custom message here
            }
        });
    </script>
</body>
</html>`;
  }, [markdownInput, selectedTheme, selectedTransition]);

  // Memoized CDN URLs to prevent recalculation
  const cdnUrls = useMemo(
    () => ({
      revealCSS: `${CDN_BASE_URL}/reveal.min.css`,
      themeCSS: `${CDN_BASE_URL}/theme/${selectedTheme}.min.css`,
      highlightCSS: `${CDN_BASE_URL}/plugin/highlight/zenburn.min.css`,
      revealJS: `${CDN_BASE_URL}/reveal.min.js`,
      highlightJS: `${CDN_BASE_URL}/plugin/highlight/highlight.min.js`,
      notesJS: `${CDN_BASE_URL}/plugin/notes/notes.min.js`,
    }),
    [selectedTheme]
  );

  const handleMarkdownChange = useCallback(event => {
    setMarkdownInput(event.target.value);
  }, []);

  const downloadOfflinePresentation = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const [revealCSS, revealJS, highlightJS, notesJS] = await Promise.all([
        fetch(cdnUrls.revealCSS).then(r => r.text()),
        fetch(cdnUrls.revealJS).then(r => r.text()),
        fetch(cdnUrls.highlightJS).then(r => r.text()),
        fetch(cdnUrls.notesJS).then(r => r.text()),
      ]);

      const themeCSS =
        selectedTheme === 'markslide'
          ? markslideThemeCSS
          : await fetch(cdnUrls.themeCSS).then(r => r.text());

      const highlightCSS =
        selectedTheme === 'markslide'
          ? zenburnLightCSS
          : await fetch(cdnUrls.highlightCSS).then(r => r.text());

      const slidesHtml = convertMarkdownToSlides(markdownInput);
      const filename = extractTitleFromMarkdown(markdownInput);

      const embeddedHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation</title>
    
    <style>
${revealCSS}
    </style>
    
    <style>
${themeCSS}
    </style>
    
    <style>
${highlightCSS}
    </style>
    
    <style>
        .reveal pre code {
            max-height: 600px;
            width: 100%;
            display: block;
            overflow-x: auto;
        }
        .reveal pre {
            width: 100%;
            margin: 0 auto;
            font-size: 0.55em;
        }
        .reveal code {
            max-height: none;
            white-space: pre;
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">
            ${slidesHtml}
        </div>
    </div>

    <script>
${revealJS}
    </script>
    
    <script>
${highlightJS}
    </script>
    
    <script>
${notesJS}
    </script>
    
    <script>
        Reveal.initialize({
            transition: '${selectedTransition}',
            plugins: [RevealHighlight, RevealNotes]
        });
    </script>
</body>
</html>`;

      const blob = new Blob([embeddedHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${filename}.html`;
      downloadLink.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading presentation:', error);
      alert('Error creating offline presentation. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [
    markdownInput,
    selectedTheme,
    selectedTransition,
    cdnUrls,
    isDownloading,
  ]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-sidebar p-4 border-r border-border">
        <h1 className="text-xl font-bold text-text-primary mb-4">
          MarkSlide Studio
        </h1>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <ThemeSelector value={selectedTheme} onChange={setSelectedTheme} />
            <TransitionSelector
              value={selectedTransition}
              onChange={setSelectedTransition}
            />
            <div>
              <label className="text-sm font-medium text-transparent select-none">
                Download
              </label>
              <button
                onClick={downloadOfflinePresentation}
                disabled={isDownloading}
                className="mt-1 px-4 py-2 bg-surface border border-border text-text-primary rounded-md hover:bg-background disabled:opacity-50 text-sm font-semibold transition-colors flex items-center gap-2"
                aria-label="Download presentation as offline HTML file"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <textarea
            value={markdownInput}
            onChange={handleMarkdownChange}
            className="w-full flex-grow p-4 border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary"
            placeholder="Enter your markdown here..."
            aria-label="Markdown input for presentation content"
          />
        </div>

        <div className="space-y-2 mt-4 overflow-y-auto">
          <ProTipsSection />
          <DocumentationSection />
        </div>
      </aside>

      {/* Main Content: Preview */}
      <main className="w-full lg:w-1/2 h-1/2 lg:h-full flex-grow flex items-center justify-center bg-background p-4">
        <div className="w-full h-full border border-border rounded-lg shadow-lg overflow-hidden bg-white">
          <iframe
            ref={previewIframeRef}
            srcDoc={presentationHTML}
            className="w-full h-full"
            title="Presentation Preview"
            aria-label="Live preview of the presentation"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </main>
    </div>
  );
};

export default RevealJSGenerator;
