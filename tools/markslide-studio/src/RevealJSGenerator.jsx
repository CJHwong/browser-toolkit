import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { markslideThemeCSS } from './theme/markslide.js';
import { zenburnLightCSS } from './theme/zenburn-light.js';
import SyntaxEditor from './SyntaxEditor';

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

const DEFAULT_MARKDOWN = `# 🚀 MarkSlide Studio

Turn Markdown into **beautiful** presentations with Reveal.js!

---

## 📋 Table Demo

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| **Tables** | ✅ Complete | High | Full alignment support |
| **Task Lists** | ✅ Complete | Medium | Interactive checkboxes |
| ~~Strikethrough~~ | ✅ Complete | Low | Cross out text |
| Superscript^TM^ | ✅ Complete | Low | Mathematical notation |
| Subscript~2~ | ✅ Complete | Low | Chemical formulas |

> This is a blockquote demonstrating enhanced styling with beautiful borders and typography. Great for highlighting important information or quotes from others.

---

## ✅ Task Management Demo

### Project Checklist

- [x] Set up development environment
- [x] Design initial mockups  
- [x] Implement core features
- [ ] Add comprehensive testing
- [ ] Deploy to production
- [ ] Create documentation

--

### Shopping List

- [x] Milk and eggs
- [x] Fresh vegetables
- [ ] Artisan bread
- [ ] Premium coffee beans

---

## 📚 Definition Lists & Text Formatting

HTML
: HyperText Markup Language - the standard markup language for web pages

--

CSS  
: Cascading Style Sheets - describes presentation of HTML documents

--

JavaScript
: A programming language that enables interactive web pages

---

### Enhanced Text Formatting Examples

- **Bold text** for emphasis
- *Italic text* for subtle emphasis  
- ~~Strikethrough~~ for corrections
- \`inline code\` for technical terms
- Superscript: E = mc^2^ (Einstein's equation)
- Subscript: H~2~O (Water molecule)
- Mathematical symbols: ∑, ∫, ∞, ≠, ≤, ≥
- HTML entities: &copy; &reg; &trade; &hellip; &mdash;

### 🎬 Inline Animation Examples

How {are|data-id="word1" style="color: blue;"} you doing today?

This is a {powerful|data-id="highlight" style="background: yellow; padding: 2px;"} feature!

---

## 🌐 Links & Images Demo

[Visit our website](https://example.com "Official Website")

![Beautiful landscape](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ic2t5IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4N0NFRkE7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRkZGRjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI3NreSkiLz4KICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSI2MCIgcj0iMzAiIGZpbGw9IiNGRkQ3MDAiLz4KICA8cG9seWdvbiBwb2ludHM9IjAsOTAgMTAwLDUwIDIwMCw3MCAzMDAsNDAgNDAwLDYwIDQwMCwyMDAgMCwyMDAiIGZpbGw9IiM0Rjc5NDIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CZWF1dGlmdWwgTGFuZHNjYXBlPC90ZXh0Pgo8L3N2Zz4= "Sample landscape image")

---

## 🎬 Animation Demo {data-auto-animate}

How {are|data-id="word-demo" style="color: blue; font-size: 1.2em;"} you today?

Simple inline styling with smooth animations!

---

## 🎬 Animation Demo {data-auto-animate}

How {ARE|data-id="word-demo" style="color: red; font-size: 2em; font-weight: bold;"} you today?

The word smoothly animates to a new style!

---

## 💻 Code Examples {data-auto-animate}

\`\`\`javascript {data-id="enhanced-code"}
// Enhanced markdown processing
function processMarkdown(content) {
  return content
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/\^([^\s^]+)/g, '<sup>$1</sup>')
    .replace(/~([^\s~]+)/g, '<sub>$1</sub>');
}
\`\`\`

<aside class="notes">
This demonstrates enhanced code blocks with proper syntax highlighting and the new text formatting features we've implemented.
</aside>

---

## 💻 Advanced Code Features {data-auto-animate}

\`\`\`typescript {data-id="enhanced-code"}
// Full-featured markdown processor with TypeScript
interface MarkdownProcessor {
  processTable(content: string): string;
  processBlockquotes(content: string): string;
  processTaskLists(content: string): string;
}

class EnhancedMarkdownProcessor implements MarkdownProcessor {
  processTable(content: string): string {
    // Advanced table processing with alignment
    return this.parseTableStructure(content);
  }
  
  processBlockquotes(content: string): string {
    return content.replace(/^> /gm, '<blockquote>');
  }
  
  processTaskLists(content: string): string {
    return content.replace(
      /- \[([ x])\] (.+)/g, 
      '<input type="checkbox" $1> $2'
    );
  }
}
\`\`\`

---

## 🎨 All Features Summary

### ✅ Newly Added Features

1. **Tables** with alignment support (left, center, right)
2. **Task Lists** with interactive checkboxes  
3. **Enhanced Text**: ~~strikethrough~~, super^script^, sub~script~
4. **Blockquotes** with beautiful styling
5. **Horizontal Rules** with gradient effects
6. **Definition Lists** for terminology
7. **HTML Entities**: &copy; &reg; &trade; &hellip; &mdash; &ndash;
8. **Enhanced Links** with title attributes
9. **Better Images** with rounded corners & shadows
10. **🎬 Inline Animations**: {text|data-id="id" style="color: red;"}

---

### 🚀 Original Features (Still Amazing!)

- **Auto-animate** transitions between slides
- **Speaker notes** (press 'S' in downloaded HTML)  
- **Code highlighting** with multiple languages
- **Unicode support**: 🌍 中文 العربية ∑∫∞
- **Vertical slides** with \`--\` separator
- **Custom attributes** for advanced styling
- **Export options**: HTML download & PDF generation

---

## 🎉 Thank You!

### Ready to create stunning presentations?

*All markdown features now work beautifully together!*

**Try the new features:** Edit the markdown and see live updates

📧 **Questions?** [hello@example.com](mailto:hello@example.com)

<aside class="notes">
This completes our comprehensive markdown feature demonstration. All the common markdown formats are now fully supported with beautiful styling and smooth rendering.

Remind users to:
- Try editing the markdown to test features
- Download HTML for offline presenting  
- Use speaker notes for better presentations
- Explore vertical slides with arrow keys
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

const processInlineStyles = content => {
  // Process inline styling and animation syntax: {text|attributes}
  return content.replace(/\{([^|]+)\|([^}]+)\}/g, (match, text, attributes) => {
    return `<span ${attributes}>${text}</span>`;
  });
};

const processCellMarkdown = cellContent => {
  // Process basic markdown formatting within table cells
  return (
    cellContent
      // Inline styles and animations (process first to avoid conflicts)
      .replace(/\{([^|]+)\|([^}]+)\}/g, (match, text, attributes) => {
        return `<span ${attributes}>${text}</span>`;
      })
      // Images and links
      .replace(
        /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g,
        (match, alt, src, title) => {
          return title
            ? `<img src="${src}" alt="${alt}" title="${title}">`
            : `<img src="${src}" alt="${alt}">`;
        }
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g,
        (match, text, href, title) => {
          return title
            ? `<a href="${href}" title="${title}">${text}</a>`
            : `<a href="${href}">${text}</a>`;
        }
      )
      // Text formatting
      .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
      .replace(/\^([^^]+)\^/g, '<sup>$1</sup>') // Superscript
      .replace(/~([^~]+)~/g, '<sub>$1</sub>') // Subscript
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`([^`]+)`/g, '<code>$1</code>') // Inline code
      // HTML entities
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™')
      .replace(/&hellip;/g, '…')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
  );
};

const processTable = tableContent => {
  const lines = tableContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return tableContent;

  const headerRow = lines[0];
  const separatorRow = lines[1];
  const dataRows = lines.slice(2);

  // Parse header
  const headerCells = headerRow
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);

  // Parse alignment from separator row
  const alignments = separatorRow
    .split('|')
    .map(cell => {
      const trimmed = cell.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      return 'left';
    })
    .filter((_, index) => index < headerCells.length);

  // Build table HTML
  let tableHTML = '<table class="reveal-table">\n<thead>\n<tr>\n';

  headerCells.forEach((cell, index) => {
    const align = alignments[index] || 'left';
    const processedCell = processCellMarkdown(cell);
    tableHTML += `  <th style="text-align: ${align}">${processedCell}</th>\n`;
  });

  tableHTML += '</tr>\n</thead>\n<tbody>\n';

  // Process data rows
  dataRows.forEach(row => {
    const cells = row
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);
    if (cells.length > 0) {
      tableHTML += '<tr>\n';
      cells.forEach((cell, index) => {
        const align = alignments[index] || 'left';
        const processedCell = processCellMarkdown(cell);
        tableHTML += `  <td style="text-align: ${align}">${processedCell}</td>\n`;
      });
      tableHTML += '</tr>\n';
    }
  });

  tableHTML += '</tbody>\n</table>';
  return tableHTML;
};

const processBlockquotes = content => {
  const lines = content.split('\n');
  const result = [];
  let inBlockquote = false;
  let blockquoteContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('> ')) {
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }
      blockquoteContent.push(trimmedLine.substring(2));
    } else if (trimmedLine === '>') {
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }
      blockquoteContent.push('');
    } else {
      if (inBlockquote) {
        result.push(
          `<blockquote>${blockquoteContent.join('<br>')}</blockquote>`
        );
        inBlockquote = false;
        blockquoteContent = [];
      }
      result.push(line);
    }
  }

  // Handle case where content ends with blockquote
  if (inBlockquote) {
    result.push(`<blockquote>${blockquoteContent.join('<br>')}</blockquote>`);
  }

  return result.join('\n');
};

const processLists = content => {
  const lines = content.split('\n');
  const result = [];
  let currentList = null;
  let listType = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for task list items (- [ ] or - [x])
    const taskListMatch = trimmedLine.match(/^[-*+]\s+\[([ x])\]\s+(.+)$/);
    // Check for unordered list items (-, *, +)
    const unorderedMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
    // Check for ordered list items (1., 2., etc.)
    const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);

    if (taskListMatch) {
      const [, checked, taskText] = taskListMatch;
      const isChecked = checked === 'x';

      if (currentList === null || listType !== 'task') {
        if (currentList !== null) {
          result.push(`</${listType === 'task' ? 'ul' : listType}>`);
        }
        currentList = [];
        listType = 'task';
        result.push('<ul class="task-list">');
      }

      result.push(`<li class="task-item">
        <input type="checkbox" ${isChecked ? 'checked' : ''} disabled> ${taskText}
      </li>`);
    } else if (unorderedMatch) {
      if (currentList === null || listType !== 'ul') {
        if (currentList !== null) {
          result.push(`</${listType === 'task' ? 'ul' : listType}>`);
        }
        currentList = [];
        listType = 'ul';
        result.push('<ul>');
      }
      result.push(`<li>${unorderedMatch[1]}</li>`);
    } else if (orderedMatch) {
      if (currentList === null || listType !== 'ol') {
        if (currentList !== null) {
          result.push(`</${listType === 'task' ? 'ul' : listType}>`);
        }
        currentList = [];
        listType = 'ol';
        result.push('<ol>');
      }
      result.push(`<li>${orderedMatch[1]}</li>`);
    } else {
      // Not a list item
      if (currentList !== null) {
        result.push(`</${listType === 'task' ? 'ul' : listType}>`);
        currentList = null;
        listType = null;
      }
      result.push(line);
    }
  }

  // Close any remaining list
  if (currentList !== null) {
    result.push(`</${listType === 'task' ? 'ul' : listType}>`);
  }

  return result.join('\n');
};

const processDefinitionLists = content => {
  const lines = content.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if current line is a term and next line is a definition
    if (i < lines.length - 1) {
      const nextLine = lines[i + 1];
      const nextTrimmed = nextLine.trim();
      const descMatch = nextTrimmed.match(/^:\s+(.+)$/);

      if (trimmedLine && !trimmedLine.startsWith(':') && descMatch) {
        // Found a definition list pattern
        result.push('<dl>');

        // Process the term
        result.push(`<dt>${trimmedLine}</dt>`);

        // Process the definition
        result.push(`<dd>${descMatch[1]}</dd>`);

        // Skip the next line since we already processed it
        i += 2;

        // Continue processing subsequent definition pairs
        while (i < lines.length - 1) {
          const currentTerm = lines[i].trim();
          const nextDefLine = lines[i + 1].trim();
          const nextDefMatch = nextDefLine.match(/^:\s+(.+)$/);

          if (currentTerm && !currentTerm.startsWith(':') && nextDefMatch) {
            result.push(`<dt>${currentTerm}</dt>`);
            result.push(`<dd>${nextDefMatch[1]}</dd>`);
            i += 2;
          } else {
            break;
          }
        }

        result.push('</dl>');
        continue;
      }
    }

    // Not a definition list, add the line as-is
    result.push(line);
    i++;
  }

  return result.join('\n');
};

const processSlideContent = content => {
  const codeBlocks = [];
  const speakerNotes = [];
  const tables = [];
  let codeIndex = 0;
  let notesIndex = 0;
  let tableIndex = 0;

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

  // Extract and process tables
  content = content.replace(
    /(?:^|\n)(\|.+\|\n\|[-:\s|]+\|\n(?:\|.+\|\n?)*)/gm,
    (match, tableContent) => {
      const placeholder = `__TABLE_${tableIndex}__`;
      tables[tableIndex] = processTable(tableContent.trim());
      tableIndex++;
      return placeholder;
    }
  );

  // Process inline styles first to avoid conflicts with other formatting
  content = processInlineStyles(content);

  // Process markdown elements with enhanced support
  let processed = content
    // Headers with attributes
    .replace(/^###### (.*?)\s*\{([^}]+)\}/gm, '<h6 $2>$1</h6>')
    .replace(/^##### (.*?)\s*\{([^}]+)\}/gm, '<h5 $2>$1<\/h5>')
    .replace(/^#### (.*?)\s*\{([^}]+)\}/gm, '<h4 $2>$1<\/h4>')
    .replace(/^### (.*?)\s*\{([^}]+)\}/gm, '<h3 $2>$1<\/h3>')
    .replace(/^## (.*?)\s*\{([^}]+)\}/gm, '<h2 $2>$1<\/h2>')
    .replace(/^# (.*?)\s*\{([^}]+)\}/gm, '<h1 $2>$1<\/h1>')
    // Regular headers
    .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5>$1<\/h5>')
    .replace(/^#### (.*$)/gm, '<h4>$1<\/h4>')
    .replace(/^### (.*$)/gm, '<h3>$1<\/h3>')
    .replace(/^## (.*$)/gm, '<h2>$1<\/h2>')
    .replace(/^# (.*$)/gm, '<h1>$1<\/h1>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr>')
    .replace(/^\*\*\*+$/gm, '<hr>')
    .replace(/^___+$/gm, '<hr>')
    // Images and links
    .replace(
      /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g,
      (match, alt, src, title) => {
        return title
          ? `<img src="${src}" alt="${alt}" title="${title}">`
          : `<img src="${src}" alt="${alt}">`;
      }
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g,
      (match, text, href, title) => {
        return title
          ? `<a href="${href}" title="${title}">${text}</a>`
          : `<a href="${href}">${text}</a>`;
      }
    )
    // Enhanced text formatting
    .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
    .replace(/\^([^^]+)\^/g, '<sup>$1</sup>') // Superscript
    .replace(/~([^~]+)~/g, '<sub>$1</sub>') // Subscript
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1<\/em>') // Italic
    .replace(/`([^`]+)`/g, '<code>$1<\/code>') // Inline code
    // HTML entities
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Process blockquotes
  processed = processBlockquotes(processed);

  // Process lists (enhanced to include task lists)
  processed = processLists(processed);

  // Process definition lists
  processed = processDefinitionLists(processed);

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
        line.match(/^__TABLE_\d+__$/) ||
        line.match(/<\/[^>]+>$/)
      ) {
        return line;
      } else if (!line.match(/^<\/?\w+/)) {
        return `<p>${line}<\/p>`;
      }
      return line;
    });

  processed = processedLines.join('\n');

  // Restore tables
  tables.forEach((table, index) => {
    processed = processed.replace(`__TABLE_${index}__`, table);
  });

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

const ExportDropdown = ({
  onDownloadHTML,
  onExportPDF,
  isDownloading,
  isOpen,
  onToggle,
  activeSubMenu,
  onSubMenuChange,
}) => {
  const [selectedHTMLNotes] = useState('false');
  const [selectedPDFNotes] = useState('false');
  const [subMenuPosition, setSubMenuPosition] = useState('right');

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeSubMenu) {
        const dropdown = document.querySelector('.export-dropdown');
        if (dropdown) {
          const dropdownRect = dropdown.getBoundingClientRect();
          const windowWidth = window.innerWidth;
          const subMenuWidth = 320; // w-80 = 320px
          const spacingBuffer = 16; // ml-1 + some extra space

          const wouldOverflow =
            dropdownRect.right + subMenuWidth + spacingBuffer > windowWidth;
          setSubMenuPosition(wouldOverflow ? 'left' : 'right');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSubMenu]);

  const speakerNotesOptions = [
    { value: 'false', label: 'No Notes' },
    { value: 'true', label: 'Overlay' },
    { value: 'separate-page', label: 'Separate Pages' },
  ];

  const handleExportClick = (type, notesValue) => {
    if (type === 'html') {
      onDownloadHTML(notesValue);
    } else if (type === 'pdf') {
      onExportPDF(notesValue);
    }
    // Close dropdown after selection
    onToggle();
    onSubMenuChange(null);
  };

  const handleSubMenuClick = type => {
    // Calculate if there's enough space on the right for the sub-menu
    const dropdown = document.querySelector('.export-dropdown');
    if (dropdown) {
      const dropdownRect = dropdown.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const subMenuWidth = 320; // w-80 = 320px
      const spacingBuffer = 16; // ml-1 + some extra space

      // Check if sub-menu would overflow on the right
      const wouldOverflow =
        dropdownRect.right + subMenuWidth + spacingBuffer > windowWidth;
      setSubMenuPosition(wouldOverflow ? 'left' : 'right');
    }

    onSubMenuChange(activeSubMenu === type ? null : type);
  };

  return (
    <div className="relative min-w-[120px] export-dropdown">
      <label className="text-sm font-medium text-transparent select-none">
        Export
      </label>
      <button
        onClick={onToggle}
        disabled={isDownloading}
        className="mt-1 w-full px-4 py-2 bg-surface border border-border text-text-primary rounded-md hover:bg-background disabled:opacity-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        aria-label="Export presentation"
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span>Exporting...</span>
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
            <span>Export</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-md shadow-lg z-50">
          {/* Download HTML */}
          <div className="relative">
            <button
              onClick={() => handleSubMenuClick('html')}
              className="w-full px-4 py-3 text-left hover:bg-background transition-colors flex items-center justify-between text-sm text-text-primary"
            >
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>Download HTML</span>
              </div>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {activeSubMenu === 'html' && (
              <div
                className={`absolute top-0 w-80 bg-surface border border-border rounded-md shadow-lg ${
                  subMenuPosition === 'right'
                    ? 'left-full ml-1'
                    : 'right-full mr-1'
                }`}
              >
                <div className="p-3">
                  <div className="flex gap-2">
                    {speakerNotesOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleExportClick('html', option.value)}
                        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                          selectedHTMLNotes === option.value
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-primary hover:bg-border'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border"></div>

          {/* Export PDF */}
          <div className="relative">
            <button
              onClick={() => handleSubMenuClick('pdf')}
              className="w-full px-4 py-3 text-left hover:bg-background transition-colors flex items-center justify-between text-sm text-text-primary"
            >
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Export PDF</span>
              </div>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {activeSubMenu === 'pdf' && (
              <div
                className={`absolute top-0 w-80 bg-surface border border-border rounded-md shadow-lg ${
                  subMenuPosition === 'right'
                    ? 'left-full ml-1'
                    : 'right-full mr-1'
                }`}
              >
                <div className="p-3">
                  <div className="flex gap-2">
                    {speakerNotesOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleExportClick('pdf', option.value)}
                        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                          selectedPDFNotes === option.value
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-primary hover:bg-border'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
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
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // 'html' | 'pdf' | null

  const previewIframeRef = useRef(null);

  // Shared template function to ensure consistency
  const createPresentationHTML = useCallback(
    (options = {}) => {
      const {
        useEmbeddedAssets = false,
        enablePrintPDF = false,
        showNotes = 'false',
        revealCSS = '',
        revealJS = '',
        highlightJS = '',
        notesJS = '',
        themeCSS = '',
        highlightCSS = '',
        title = 'Presentation',
      } = options;

      const slidesHtml = convertMarkdownToSlides(markdownInput);

      // Theme markup - either embedded CSS or CDN link
      const themeMarkup = useEmbeddedAssets
        ? `<style>\n${themeCSS || (selectedTheme === 'markslide' ? markslideThemeCSS : '')}\n</style>`
        : selectedTheme === 'markslide'
          ? `<style>${markslideThemeCSS}</style>`
          : `<link rel="stylesheet" href="${CDN_BASE_URL}/theme/${selectedTheme}.min.css">`;

      // Highlight markup - either embedded CSS or CDN link
      const highlightThemeMarkup = useEmbeddedAssets
        ? `<style>\n${highlightCSS || (selectedTheme === 'markslide' ? zenburnLightCSS : '')}\n</style>`
        : selectedTheme === 'markslide'
          ? `<style>${zenburnLightCSS}</style>`
          : `<link rel="stylesheet" href="${CDN_BASE_URL}/plugin/highlight/zenburn.min.css">`;

      // CSS markup - either embedded or CDN link
      const cssMarkup = useEmbeddedAssets
        ? `<style>\n${revealCSS}\n</style>`
        : `<link rel="stylesheet" href="${CDN_BASE_URL}/reveal.min.css">`;

      // JavaScript markup - either embedded or CDN links
      const jsMarkup = useEmbeddedAssets
        ? `
    <script>
${revealJS}
    </script>
    
    <script>
${highlightJS}
    </script>
    
    <script>
${notesJS}
    </script>`
        : `
    <script src="${CDN_BASE_URL}/reveal.min.js"></script>
    <script src="${CDN_BASE_URL}/plugin/highlight/highlight.min.js"></script>
    <script src="${CDN_BASE_URL}/plugin/notes/notes.min.js"></script>`;

      return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${cssMarkup}
    ${themeMarkup}
    ${highlightThemeMarkup}
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

    ${jsMarkup}
    
    <script>
        ${
          enablePrintPDF
            ? `
        // Check for print-pdf query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const isPrintPDF = urlParams.has('print-pdf');
        
        Reveal.initialize({
            view: 'print',
            transition: '${selectedTransition}',
            plugins: [RevealHighlight, RevealNotes],
            showNotes: ${showNotes === 'separate-page' ? `'separate-page'` : showNotes},
            pdfMaxPagesPerSlide: 1,
            pdfSeparateFragments: true
        });
        
        // Auto-trigger print dialog if in PDF mode
        if (isPrintPDF) {
            setTimeout(() => {
                window.print();
            }, 1000);
        }`
            : `
        Reveal.initialize({
            transition: '${selectedTransition}',
            plugins: [RevealHighlight, RevealNotes],
            showNotes: ${showNotes === 'separate-page' ? `'separate-page'` : showNotes}
        });
        
        // Disable speaker view in preview mode (unless showNotes is enabled)
        ${
          showNotes === 'false'
            ? `
        document.addEventListener('keydown', function(e) {
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                // You can optionally show a custom message here
            }
        });`
            : ''
        }
        `
        }
    </script>
</body>
</html>`;
    },
    [markdownInput, selectedTheme, selectedTransition]
  );

  // Memoized presentation HTML for preview
  const presentationHTML = useMemo(() => {
    return createPresentationHTML();
  }, [createPresentationHTML]);

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

  const exportToPDF = useCallback(
    async (showNotes = 'false') => {
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

        // Create embedded HTML using the shared template
        const embeddedHTML = createPresentationHTML({
          useEmbeddedAssets: true,
          enablePrintPDF: true,
          showNotes,
          revealCSS,
          revealJS,
          highlightJS,
          notesJS,
          themeCSS,
          highlightCSS,
          title: 'Presentation - PDF Export',
        });
        // Wait a moment, then open the PDF-ready version in a new tab
        setTimeout(() => {
          // Create PDF-optimized HTML with print-pdf mode enabled
          const pdfOptimizedHTML = embeddedHTML.replace(
            "const isPrintPDF = urlParams.has('print-pdf');",
            'const isPrintPDF = true; // Force PDF mode'
          );

          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(pdfOptimizedHTML);
            newWindow.document.close();
          } else {
            alert(
              'Please allow popups and check your downloads folder for the PDF-ready HTML file.'
            );
          }
        }, 1000);
      } catch (error) {
        console.error('Error creating PDF export:', error);
        alert('Error creating PDF export. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    },
    [createPresentationHTML, cdnUrls, isDownloading, selectedTheme]
  );

  const downloadOfflinePresentation = useCallback(
    async (showNotes = 'false') => {
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

        const filename = extractTitleFromMarkdown(markdownInput);

        // Create embedded HTML using the shared template
        const embeddedHTML = createPresentationHTML({
          useEmbeddedAssets: true,
          enablePrintPDF: false,
          showNotes,
          revealCSS,
          revealJS,
          highlightJS,
          notesJS,
          themeCSS,
          highlightCSS,
          title: 'Presentation',
        });

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
    },
    [
      createPresentationHTML,
      markdownInput,
      cdnUrls,
      isDownloading,
      selectedTheme,
    ]
  );

  const handleDownloadHTML = useCallback(
    showNotes => {
      downloadOfflinePresentation(showNotes);
    },
    [downloadOfflinePresentation]
  );

  const handleExportPDF = useCallback(
    showNotes => {
      exportToPDF(showNotes);
    },
    [exportToPDF]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (exportDropdownOpen && !event.target.closest('.export-dropdown')) {
        setExportDropdownOpen(false);
        setActiveSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [exportDropdownOpen]);

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
            <ExportDropdown
              onDownloadHTML={handleDownloadHTML}
              onExportPDF={handleExportPDF}
              isDownloading={isDownloading}
              isOpen={exportDropdownOpen}
              onToggle={() => setExportDropdownOpen(!exportDropdownOpen)}
              activeSubMenu={activeSubMenu}
              onSubMenuChange={setActiveSubMenu}
            />
          </div>
        </div>

        <div className="flex-grow relative">
          <SyntaxEditor
            value={markdownInput}
            onChange={setMarkdownInput}
            placeholder="Enter your markdown here..."
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
