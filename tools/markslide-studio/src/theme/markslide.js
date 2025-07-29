export const markslideThemeCSS = `
/**
 * MarkSlide theme for reveal.js
 * Derived from the MarkSlide Studio app design.
 */
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap');

html, body, .reveal {
  background-color: var(--r-background-color);
  min-height: 100vh;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.reveal > .slides,
.reveal > .slides > section,
body,
.reveal,
.reveal .slides,
.reveal .slides section {
  background-color: var(--r-background-color) !important;
  min-height: 100vh;
}

:root {
  --r-background-color: #f5f4ed;
  --r-main-font: 'Lora', Georgia, 'Times New Roman', Times, serif;
  --r-main-font-size: 40px;
  --r-main-color: #383631;
  --r-heading-font: 'Lora', Georgia, 'Times New Roman', Times, serif;
  --r-heading-color: #383631;
  --r-heading-font-weight: 700;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-link-color: #607d8b;
  --r-link-color-hover: #546e7a;
  --r-selection-background-color: #b2c6d1;
  --r-code-font: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

.reveal {
  background-color: var(--r-background-color);
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: 400;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: #fff;
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > .slide-background {
  background-color: var(--r-background-color);
}

.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: 0 0 40px 0;
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: 2.4em;
}

.reveal h2 {
  font-size: 1.7em;
}

.reveal h3 {
  font-size: 1.3em;
}

.reveal h4 {
  font-size: 1.1em;
}

.reveal p {
  margin: 35px 0;
  line-height: 1.7;
}

.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal strong {
    font-weight: 700;
}

.reveal em {
    font-style: italic;
}

.reveal ul,
.reveal ol {
  display: inline-block;
  text-align: left;
  margin: 35px 0;
  list-style-position: outside;
}

/* Responsive list sizing based on item count */
.reveal ul li:nth-child(7) ~ li,
.reveal ul li:nth-child(7),
.reveal ol li:nth-child(7) ~ li,
.reveal ol li:nth-child(7) {
  font-size: 0.9em;
  margin-bottom: 12px;
}

.reveal ul li:nth-child(10) ~ li,
.reveal ul li:nth-child(10),
.reveal ol li:nth-child(10) ~ li,
.reveal ol li:nth-child(10) {
  font-size: 0.85em;
  margin-bottom: 10px;
}

.reveal ul li:nth-child(12) ~ li,
.reveal ul li:nth-child(12),
.reveal ol li:nth-child(12) ~ li,
.reveal ol li:nth-child(12) {
  font-size: 0.8em;
  margin-bottom: 8px;
}

.reveal ul li:nth-child(15) ~ li,
.reveal ul li:nth-child(15),
.reveal ol li:nth-child(15) ~ li,
.reveal ol li:nth-child(15) {
  font-size: 0.75em;
  margin-bottom: 6px;
}

.reveal ul {
  list-style-type: none;
}

.reveal ul li {
  margin-bottom: 15px;
  line-height: 1.6;
}

.reveal ul li::before {
  content: '•';
  color: var(--r-link-color);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ol li {
  margin-bottom: 15px;
  line-height: 1.6;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal pre {
  display: block;
  position: relative;
  width: 95%;
  margin: 40px auto;
  text-align: left;
  font-size: 0.5em;
  font-family: var(--r-code-font);
  line-height: 1.5;
  word-wrap: break-word;
  background: #fcfbf7;
  border: 1px solid #e4e2da;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
}

.reveal pre code {
  display: block;
  padding: 1.2em;
  overflow: auto;
  max-height: 500px;
  word-wrap: normal;
  color: #383631;
}

.reveal pre code .hljs-punctuation,
.reveal pre code .hljs-operator {
  color: #383631 !important;
}

.reveal blockquote {
  display: block;
  position: relative;
  margin: 30px auto;
  padding: 25px;
  font-style: italic;
  background: #f0eee8;
  border-left: 5px solid #607d8b;
}

.reveal blockquote p {
  margin: 0;
}

.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
  height: 5px;
}

/* Tables */
.reveal .reveal-table {
  margin: 30px auto;
  border-collapse: collapse;
  font-size: 0.85em;
  min-width: 80%;
  background: var(--r-background-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

/* Responsive table sizing based on row count */
.reveal .reveal-table tbody tr:nth-child(6) ~ tr,
.reveal .reveal-table tbody tr:nth-child(6) {
  font-size: 0.9em;
}

.reveal .reveal-table tbody tr:nth-child(8) ~ tr,
.reveal .reveal-table tbody tr:nth-child(8) {
  font-size: 0.8em;
}

.reveal .reveal-table tbody tr:nth-child(10) ~ tr,
.reveal .reveal-table tbody tr:nth-child(10) {
  font-size: 0.75em;
}

.reveal .reveal-table tbody tr:nth-child(12) ~ tr,
.reveal .reveal-table tbody tr:nth-child(12) {
  font-size: 0.7em;
}

.reveal .reveal-table thead tr {
  background-color: var(--r-link-color);
  color: #ffffff;
}

.reveal .reveal-table th,
.reveal .reveal-table td {
  padding: 18px 24px;
  border: 1px solid #e4e2da;
  line-height: 1.5;
}

.reveal .reveal-table tbody tr {
  border-bottom: 1px solid #e4e2da;
}

.reveal .reveal-table tbody tr:nth-child(even) {
  background-color: #fcfbf7;
}

.reveal .reveal-table tbody tr:hover {
  background-color: #f0eee8;
}

.reveal .reveal-table th {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9em;
}

/* Task Lists */
.reveal .task-list {
  list-style: none !important;
  padding-left: 0 !important;
}

.reveal .task-list .task-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 12px;
  line-height: 1.6;
}

/* Responsive task list sizing */
.reveal .task-list .task-item:nth-child(7) ~ .task-item,
.reveal .task-list .task-item:nth-child(7) {
  font-size: 0.9em;
  margin-bottom: 15px;
}

.reveal .task-list .task-item:nth-child(10) ~ .task-item,
.reveal .task-list .task-item:nth-child(10) {
  font-size: 0.85em;
  margin-bottom: 12px;
}

.reveal .task-list .task-item:nth-child(12) ~ .task-item,
.reveal .task-list .task-item:nth-child(12) {
  font-size: 0.8em;
  margin-bottom: 10px;
}

.reveal .task-list .task-item::before {
  display: none !important;
}

.reveal .task-list input[type="checkbox"] {
  margin-right: 8px;
  margin-top: 4px;
  transform: scale(1.2);
  accent-color: var(--r-link-color);
}

.reveal .task-list input[type="checkbox"]:checked + span {
  text-decoration: line-through;
  opacity: 0.7;
}

/* Definition Lists */
.reveal dl {
  margin: 30px 0;
}

.reveal dt {
  font-weight: 700;
  margin-top: 25px;
  margin-bottom: 12px;
  color: var(--r-heading-color);
  font-size: 1.1em;
  line-height: 1.4;
}

.reveal dd {
  margin-left: 30px;
  margin-bottom: 20px;
  line-height: 1.7;
  border-left: 3px solid #e4e2da;
  padding-left: 20px;
}

/* Responsive definition list sizing */
.reveal dt:nth-of-type(4) ~ dt,
.reveal dt:nth-of-type(4) ~ dd,
.reveal dt:nth-of-type(4),
.reveal dt:nth-of-type(4) + dd {
  font-size: 0.9em;
}

.reveal dt:nth-of-type(6) ~ dt,
.reveal dt:nth-of-type(6) ~ dd,
.reveal dt:nth-of-type(6),
.reveal dt:nth-of-type(6) + dd {
  font-size: 0.85em;
}

.reveal dt:nth-of-type(8) ~ dt,
.reveal dt:nth-of-type(8) ~ dd,
.reveal dt:nth-of-type(8),
.reveal dt:nth-of-type(8) + dd {
  font-size: 0.8em;
}

/* Horizontal Rules */
.reveal hr {
  border: none;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--r-link-color), transparent);
  margin: 40px auto;
  width: 60%;
}

/* Enhanced Text Formatting */
.reveal del {
  color: #7a7874;
  text-decoration: line-through;
}

.reveal sup {
  font-size: 0.7em;
  vertical-align: super;
  line-height: 0;
}

.reveal sub {
  font-size: 0.7em;
  vertical-align: sub;
  line-height: 0;
}

/* Enhanced Code Styling */
.reveal :not(pre) > code {
  background: #f0eee8;
  color: #607d8b;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

/* Enhanced Blockquotes */
.reveal blockquote {
  display: block;
  position: relative;
  margin: 40px auto;
  padding: 30px 35px;
  font-style: italic;
  background: #f0eee8;
  border-left: 5px solid var(--r-link-color);
  border-radius: 0 8px 8px 0;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  max-width: 90%;
  line-height: 1.7;
}

.reveal blockquote::before {
  content: '"';
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 3em;
  color: var(--r-link-color);
  opacity: 0.3;
  font-family: Georgia, serif;
  line-height: 1;
}

.reveal blockquote p {
  margin: 0;
  position: relative;
  z-index: 1;
}

/* Image Enhancements */
.reveal img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 20px 0;
}

/* Responsive content scaling for slides with lots of content */
.reveal .slides section {
  --content-scale: 1;
  transform: scale(var(--content-scale));
  transform-origin: center center;
}

/* Auto-scale slides with many elements */
.reveal .slides section:has(ul li:nth-child(20)),
.reveal .slides section:has(ol li:nth-child(20)),
.reveal .slides section:has(.reveal-table tbody tr:nth-child(15)),
.reveal .slides section:has(.task-list .task-item:nth-child(15)) {
  --content-scale: 0.85;
}

.reveal .slides section:has(ul li:nth-child(25)),
.reveal .slides section:has(ol li:nth-child(25)),
.reveal .slides section:has(.reveal-table tbody tr:nth-child(20)),
.reveal .slides section:has(.task-list .task-item:nth-child(20)) {
  --content-scale: 0.75;
}

/* Fallback for browsers without :has() support */
@supports not (selector(:has(*))) {
  .reveal .slides section {
    font-size: clamp(0.7em, 2vw, 1em);
  }
}
`;
