import { useState, useRef, useCallback, useMemo } from 'react';

// Configuration constants
const REVEAL_JS_VERSION = '5.2.1';
const CDN_BASE_URL = `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/${REVEAL_JS_VERSION}`;

const THEME_OPTIONS = [
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
  { value: 'moon', label: 'Moon' }
];

const TRANSITION_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade', label: 'Fade' },
  { value: 'convex', label: 'Convex' },
  { value: 'concave', label: 'Concave' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'none', label: 'None' }
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
const createFilenameFriendlyString = (title) => {
  return title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50);
};

const extractTitleFromMarkdown = (markdown) => {
  const firstSlide = markdown.split(/\n---\n/)[0];
  const titleMatch = firstSlide.match(/^#\s+(.+)$/m);
  
  if (titleMatch) {
    return createFilenameFriendlyString(titleMatch[1]);
  }
  return 'presentation-offline';
};

// Markdown processing functions
const extractSlideAttributes = (content) => {
  const headerWithAttrs = content.match(/^(#{1,6})\s+(.*?)\s*\{([^}]+)\}/m);
  if (headerWithAttrs) {
    const [fullMatch, hashes, title, attrs] = headerWithAttrs;
    const newContent = content.replace(fullMatch, `${hashes} ${title}`);
    return {
      content: newContent,
      attributes: ` ${attrs}`
    };
  }
  return { content, attributes: '' };
};

const processLists = (content) => {
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

const processSlideContent = (content) => {
  const codeBlocks = [];
  const speakerNotes = [];
  let codeIndex = 0;
  let notesIndex = 0;
  
  // Extract and placeholder speaker notes first
  content = content.replace(/<aside class="notes">([\s\S]*?)<\/aside>/g, (match, noteContent) => {
    const placeholder = `__SPEAKER_NOTE_${notesIndex}__`;
    speakerNotes[notesIndex] = `<aside class="notes">${noteContent.trim()}</aside>`;
    notesIndex++;
    return placeholder;
  });
  
  // Extract and placeholder code blocks
  content = content.replace(/```(\w+)?\s*\{([^}]+)\}\s*\n([\s\S]*?)```/g, (match, lang, attrs, code) => {
    const placeholder = `__CODE_BLOCK_${codeIndex}__`;
    if (attrs.includes('data-id')) {
      codeBlocks[codeIndex] = `<pre ${attrs}><code class="language-${lang || ''}" data-trim data-line-numbers>${code.trim()}</code></pre>`;
    } else {
      codeBlocks[codeIndex] = `<pre><code class="language-${lang || ''}" ${attrs} data-trim>${code.trim()}</code></pre>`;
    }
    codeIndex++;
    return placeholder;
  });
  
  content = content.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeIndex}__`;
    codeBlocks[codeIndex] = `<pre><code class="language-${lang || ''}" data-trim>${code.trim()}</code></pre>`;
    codeIndex++;
    return placeholder;
  });
  
  // Process markdown elements
  let processed = content
    .replace(/^###### (.*?)\s*\{([^}]+)\}/gm, '<h6 $2>$1</h6>')
    .replace(/^##### (.*?)\s*\{([^}]+)\}/gm, '<h5 $2>$1</h5>')
    .replace(/^#### (.*?)\s*\{([^}]+)\}/gm, '<h4 $2>$1</h4>')
    .replace(/^### (.*?)\s*\{([^}]+)\}/gm, '<h3 $2>$1</h3>')
    .replace(/^## (.*?)\s*\{([^}]+)\}/gm, '<h2 $2>$1</h2>')
    .replace(/^# (.*?)\s*\{([^}]+)\}/gm, '<h1 $2>$1</h1>')
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  // Process lists
  processed = processLists(processed);

  // Handle paragraphs
  const lines = processed.split('\n');
  const processedLines = lines
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      if (line.match(/^<[^>]+>/) || line.match(/^__CODE_BLOCK_\d+__$/) || line.match(/^__SPEAKER_NOTE_\d+__$/) || line.match(/<\/[^>]+>$/)) {
        return line;
      } else if (!line.match(/^<\/?\w+/)) {
        return `<p>${line}</p>`;
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

const convertMarkdownToSlides = (markdown) => {
  const horizontalSlides = markdown.split(/\n---\n/);
  
  const sections = horizontalSlides.map(horizontalSlide => {
    const verticalSlides = horizontalSlide.split(/\n--\n/);
    
    if (verticalSlides.length > 1) {
      const verticalSections = verticalSlides.map(slide => {
        const { content, attributes } = extractSlideAttributes(slide.trim());
        return `            <section${attributes}>
                ${processSlideContent(content)}
            </section>`;
      }).join('\n');
      return `        <section>
${verticalSections}
        </section>`;
    } else {
      const { content, attributes } = extractSlideAttributes(horizontalSlide.trim());
      return `            <section${attributes}>
                ${processSlideContent(content)}
            </section>`;
    }
  });
  
  return sections.join('\n');
};

// Component subcomponents
const ThemeSelector = ({ value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Theme</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Transition</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

const DocumentationSection = () => {
  const copyAIDocumentation = () => {
    const aiDoc = `# MarkSlide Studio - AI Documentation

## Purpose
MarkSlide Studio converts Markdown to Reveal.js presentations with advanced features.

## Core Markdown Syntax

### Slide Navigation
- \`---\` = New horizontal slide (main sections)
- \`--\` = New vertical slide (sub-sections under main slides)

### Text Formatting
- \`**text**\` = Bold text
- \`*text*\` = Italic text
- \`\`code\`\` = Inline code
- \`# ## ### #### ##### ######\` = Headers (h1-h6)

### Lists
- \`- * +\` = Unordered/bullet lists
- \`1. 2. 3.\` = Ordered/numbered lists

### Links & Media
- \`[text](url)\` = Clickable links
- \`![alt](image.jpg)\` = Embedded images

## Advanced Features

### Auto-Animate Slides
Create smooth transitions between slides with matching elements:
\`\`\`markdown
## My Title {data-auto-animate}
# Moving Element {data-id="unique"}
Content here

---

## My Title {data-auto-animate}
# Moving Element {data-id="unique" style="color: red;"}
New content!
\`\`\`
Key: Use same data-id across consecutive slides for smooth animations.

### Speaker Notes
Add private notes visible only in speaker view:
\`\`\`markdown
## My Slide
Visible content here

<aside class="notes">
  Private speaker notes
  • Key talking points
  • Reminders
</aside>
\`\`\`
Access: Press 'S' in downloaded HTML to open speaker view.

### Code Presentations
Basic code blocks:
\`\`\`markdown
\\\`\\\`\\\`javascript
function hello() {
  return "Hello World!";
}
\\\`\\\`\\\`
\`\`\`

Animated code (for code evolution demos):
\`\`\`markdown
\\\`\\\`\\\`javascript {data-id="code"}
function hello() {
  return "Hello!";
}
\\\`\\\`\\\`
\`\`\`

## Usage Instructions
1. Enter Markdown in the left editor panel
2. Select theme and transition in the dropdowns
3. Preview updates in real-time on the right panel
4. Download self-contained HTML file for presentations
5. Use arrow keys to navigate slides in preview
6. Press 'S' in downloaded HTML for speaker view

## Technical Notes
- Full Unicode support (international characters, emojis, math symbols)
- Offline functionality in downloaded HTML
- Built on Reveal.js ${REVEAL_JS_VERSION}
- Responsive design for all screen sizes
- Code syntax highlighting included

## Best Practices
- Use same data-id across consecutive auto-animate slides
- Vertical slides (--) create detailed sub-sections
- Add speaker notes for professional presentations
- Test navigation with arrow keys before presenting
- Download HTML for offline presenting`;

    navigator.clipboard.writeText(aiDoc).then(() => {
      alert('📋 AI-friendly documentation copied to clipboard!\n\nThis format is optimized for AI assistants to understand MarkSlide Studio features.');
    }).catch(() => {
      // Fallback for older browsers
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
  <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            📖 Complete Feature Documentation
          </h3>
          <p className="text-sm text-gray-600 mt-1">Everything you need to create professional presentations</p>
        </div>
        <button
          onClick={copyAIDocumentation}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          title="Copy documentation in AI-friendly format"
        >
          🤖 Copy for AI
        </button>
      </div>
    </div>
    
    <div className="p-6 space-y-8">
      {/* Basic Markdown Section */}
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          ✍️ Markdown Syntax
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Slide Navigation</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-xs">---</code>
                  <span className="text-gray-600">New horizontal slide</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono text-xs">--</code>
                  <span className="text-gray-600">New vertical slide</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Text Formatting</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <code className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-xs">**bold**</code>
                  <span className="text-gray-600">Bold text</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <code className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-xs">*italic*</code>
                  <span className="text-gray-600">Italic text</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <code className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-xs">`code`</code>
                  <span className="text-gray-600">Inline code</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Headers & Lists</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <code className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-mono text-xs"># ## ###</code>
                  <span className="text-gray-600">Headers (h1-h6)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <code className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-mono text-xs">- * +</code>
                  <span className="text-gray-600">Bullet lists</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <code className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-mono text-xs">1. 2. 3.</code>
                  <span className="text-gray-600">Numbered lists</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Links & Images</h5>
              <div className="space-y-2 text-sm">
                <div className="py-1">
                  <code className="bg-orange-100 text-orange-800 px-3 py-1 rounded font-mono text-xs block mb-1">[text](url)</code>
                  <span className="text-gray-600 text-xs">Clickable links</span>
                </div>
                <div className="py-1">
                  <code className="bg-orange-100 text-orange-800 px-3 py-1 rounded font-mono text-xs block mb-1">![alt](image.jpg)</code>
                  <span className="text-gray-600 text-xs">Embedded images</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          🎬 Advanced Features
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-5">
            <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              ✨ Auto-Animate Slides
            </h5>
            <p className="text-sm text-blue-800 mb-3">Create smooth transitions between slides with matching elements.</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">Enable auto-animate:</p>
                <code className="bg-blue-200 text-blue-900 px-3 py-2 rounded block text-xs font-mono">
                  {`## My Title {data-auto-animate}

# Moving Element {data-id="unique"}
Content here`}
                </code>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">Next slide (same data-id):</p>
                <code className="bg-blue-200 text-blue-900 px-3 py-2 rounded block text-xs font-mono">
                  {`## My Title {data-auto-animate}

# Moving Element {data-id="unique" style="color: red;"}
New content!`}
                </code>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-5">
            <h5 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              🎤 Speaker Notes
            </h5>
            <p className="text-sm text-green-800 mb-3">Add private notes visible only in speaker view (press 'S' in downloaded HTML).</p>
            <div className="space-y-2">
              <code className="bg-green-200 text-green-900 px-3 py-2 rounded block text-xs font-mono">
                {`## My Slide

Visible content here

<aside class="notes">
  Private speaker notes
  • Key talking points
  • Reminders
</aside>`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Code Blocks Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          💻 Code Presentations
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-5">
            <h5 className="font-semibold text-gray-800 mb-3">Basic Code Blocks</h5>
            <code className="bg-gray-200 text-gray-800 px-3 py-2 rounded block text-xs font-mono whitespace-pre">
              {`\`\`\`javascript
function hello() {
  return "Hello World!";
}
\`\`\``}
            </code>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5">
            <h5 className="font-semibold text-gray-800 mb-3">Animated Code</h5>
            <code className="bg-gray-200 text-gray-800 px-3 py-2 rounded block text-xs font-mono whitespace-pre">
              {`\`\`\`javascript {data-id="code"}
function hello() {
  return "Hello!";
}
\`\`\``}
            </code>
            <p className="text-xs text-gray-600 mt-2">Use same data-id across slides for smooth code evolution</p>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-r-lg p-5">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            💡 Pro Tips & Best Practices
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Use the same <code className="bg-yellow-100 px-1 rounded text-xs">data-id</code> across consecutive slides for smooth animations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Vertical slides (<code className="bg-yellow-100 px-1 rounded text-xs">--</code>) create detailed sub-sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Press <kbd className="bg-gray-100 px-2 py-1 rounded text-xs border">S</kbd> in downloaded HTML for speaker view</span>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Full Unicode support: 🌍 中文 العربية ñ математика</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Downloaded HTML works offline with all features intact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">▶</span>
                <span>Use arrow keys to navigate: ← → ↑ ↓</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const RevealJSGenerator = () => {
  const [markdownInput, setMarkdownInput] = useState(DEFAULT_MARKDOWN);
  const [selectedTheme, setSelectedTheme] = useState('black');
  const [selectedTransition, setSelectedTransition] = useState('slide');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const previewIframeRef = useRef(null);

  // Memoized presentation HTML to prevent unnecessary recalculation
  const presentationHTML = useMemo(() => {
    const slidesHtml = convertMarkdownToSlides(markdownInput);
    
    return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="${CDN_BASE_URL}/reveal.min.css">
    <link rel="stylesheet" href="${CDN_BASE_URL}/theme/${selectedTheme}.min.css">
    <link rel="stylesheet" href="${CDN_BASE_URL}/plugin/highlight/monokai.min.css">
    <style>
        .reveal pre code {
            max-height: 400px;
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
                alert('Speaker view is disabled in preview mode.\\n\\nDownload the HTML file to use speaker view with full functionality.');
            }
        });
    </script>
</body>
</html>`;
  }, [markdownInput, selectedTheme, selectedTransition]);

  // Memoized CDN URLs to prevent recalculation
  const cdnUrls = useMemo(() => ({
    revealCSS: `${CDN_BASE_URL}/reveal.min.css`,
    themeCSS: `${CDN_BASE_URL}/theme/${selectedTheme}.min.css`,
    highlightCSS: `${CDN_BASE_URL}/plugin/highlight/monokai.min.css`,
    revealJS: `${CDN_BASE_URL}/reveal.min.js`,
    highlightJS: `${CDN_BASE_URL}/plugin/highlight/highlight.min.js`,
    notesJS: `${CDN_BASE_URL}/plugin/notes/notes.min.js`
  }), [selectedTheme]);

  const handleMarkdownChange = useCallback((event) => {
    setMarkdownInput(event.target.value);
  }, []);

  const downloadOfflinePresentation = useCallback(async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const responses = await Promise.all([
        fetch(cdnUrls.revealCSS),
        fetch(cdnUrls.themeCSS),
        fetch(cdnUrls.highlightCSS),
        fetch(cdnUrls.revealJS),
        fetch(cdnUrls.highlightJS),
        fetch(cdnUrls.notesJS)
      ]);

      const [revealCSS, themeCSS, highlightCSS, revealJS, highlightJS, notesJS] = await Promise.all(
        responses.map(r => r.text())
      );

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
            max-height: 400px;
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
  }, [markdownInput, selectedTransition, cdnUrls, isDownloading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            MarkSlide Studio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your markdown into beautiful presentations with Reveal.js.
          </p>
        </header>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Panel */}
          <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    ✍️ Markdown Editor
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Write your presentation content</p>
                </div>
                <div className="flex gap-4">
                  <ThemeSelector 
                    value={selectedTheme} 
                    onChange={setSelectedTheme} 
                  />
                  <TransitionSelector 
                    value={selectedTransition} 
                    onChange={setSelectedTransition} 
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                value={markdownInput}
                onChange={handleMarkdownChange}
                className="w-full h-96 p-4 border-2 border-gray-200 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                placeholder="Enter your markdown here..."
                aria-label="Markdown input for presentation content"
              />
            </div>
            
            <DocumentationSection />
          </section>
          
          {/* Preview Panel */}
          <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    📺 Live Preview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">See your presentation in real-time</p>
                </div>
                <button 
                  onClick={downloadOfflinePresentation}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
                  aria-label="Download presentation as offline HTML file"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      💾 Download HTML
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-900">
                <iframe
                  ref={previewIframeRef}
                  srcDoc={presentationHTML}
                  className="w-full h-96"
                  title="Presentation Preview"
                  aria-label="Live preview of the presentation"
                />
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 mt-0.5">
                    📝
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Navigation Guide</p>
                    <p>Use arrow keys (← → ↑ ↓) to navigate slides in the preview above.</p>
                    <p>Use escape keys to view the slides in overview mode.</p>
                    <p className="mt-1">Download the HTML file for full-screen presenting and speaker view (press <kbd className="bg-blue-100 px-1 rounded">S</kbd>).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RevealJSGenerator;