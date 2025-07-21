# Browser Toolkit

A curated collection of independent web applications and utilities. This repository serves as a platform for deploying multiple self-contained web tools that work entirely in the browser without requiring any server infrastructure.

## 🚀 Live Demo

Visit the live collection at: `https://CJHwong.github.io/browser-toolkit/`

## 📁 Repository Structure

```
/
├── index.html             # Main directory listing
├── README.md              # This file
├── .gitignore             # Git ignore patterns
├── tool-name/             # Individual tool directories
│   ├── index.html         # Tool entry point
│   ├── assets/            # Tool-specific assets
│   └── README.md          # Tool documentation
└── .github/
    └── workflows/
        └── deploy.yml     # Automated deployment
```

## ➕ Adding New Tools

This repository is designed to be easily extensible. To add a new web tool:

### 1. Tool Requirements

Each tool must meet these criteria:

- **Self-contained**: No shared dependencies between tools
- **Client-side only**: Works with static hosting (like GitHub Pages)
- **Offline capability**: Operates after initial page load

### 2. Development Guidelines

- Create tools using vanilla HTML/CSS/JS or build tools that compile to static files
- Keep each tool in its own directory with an `index.html` entry point
- Include a `README.md` for tool-specific documentation
- Follow web accessibility standards (WCAG guidelines)
- Optimize for performance and fast loading

### 3. Integration Process

1. Create your tool directory and implement the functionality
2. Add your tool to the main directory listing (`index.html`)
3. Update build processes if your tool requires compilation
4. Test locally before submitting
5. Submit via pull request with clear description

### 4. Supported Technologies

- **Static sites**: HTML, CSS, JavaScript
- **Modern frameworks**: React, Vue, Svelte (must build to static files)
- **Build tools**: Webpack, Vite, Parcel (output must be static)
- **Styling**: CSS, Sass, Tailwind, CSS-in-JS
- **No server-side**: PHP, Node.js backends, databases not supported

## 📦 Deployment

This repository is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Manual Setup

1. Go to your repository's Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will automatically deploy on pushes to `main`

### Custom Domain (Optional)

1. Add a `CNAME` file with your domain name
2. Configure DNS with your domain provider
3. Enable "Enforce HTTPS" in repository settings
