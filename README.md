# 🧰 Browser Toolkit

A curated collection of independent web tools and utilities. All tools work entirely in the browser with hash-based cache-busting for reliable deployments.

## 🚀 Live Demo

Visit: **[https://cjhwong.github.io/browser-toolkit/](https://cjhwong.github.io/browser-toolkit/)**

## 🎯 Current Tools

### 🎬 MarkSlide Studio

Transform markdown into beautiful RevealJS presentations with auto-animations and speaker notes.

**Features:**

- Live markdown preview
- Multiple themes and transitions  
- Auto-animate slide transitions
- Speaker notes with private view
- Offline HTML export with full functionality
- Complete Unicode support (🌍 中文 العربية)

**[Launch MarkSlide Studio →](https://cjhwong.github.io/browser-toolkit/markslide-studio/)**

## 📁 Repository Structure

```
browser-toolkit/
├── index.html              # Landing page
├── tools/
│   └── markslide-studio/   # MarkSlide Studio React app
├── docs/                   # Deployed files (with cache-busting)
├── scripts/
│   ├── build.sh           # Build script with cache-busting
│   └── deploy.sh          # Full deployment with git
└── package.json           # Workspace configuration
```

## 🔧 Development

### **Quick Start**

```bash
# Install dependencies
npm install && npm ci --workspaces

# Start development server
npm run dev

# Build for production with cache-busting  
bash scripts/build.sh

# Deploy to GitHub Pages
bash scripts/deploy.sh
```

### **Key Features**

- **🔑 Hash-based cache busting** - Users always get latest version
- **📦 Workspace architecture** - Monorepo with independent tools
- **⚡ Pre-built deployment** - No build process on GitHub Pages
- **🛠️ Developer friendly** - One command deployment

## ➕ Adding New Tools

### **1. Create Your Tool**

```bash
# Add to workspace
mkdir tools/your-tool-name
cd tools/your-tool-name

# Initialize with package.json
npm init -y
npm install # your dependencies

# Set homepage for relative paths
echo '"homepage": "./"' >> package.json
```

### **2. Update Configuration**

```json
// In root package.json
"workspaces": [
  "tools/markslide-studio",
  "tools/your-tool-name"
]
```

### **3. Update Deployment**

```bash
# In scripts/build.sh, add:
npm run build --workspace=tools/your-tool-name
cp -r tools/your-tool-name/build docs/your-tool-name
```

### **4. Add to Landing Page**

Add a new tool card to `index.html` following the existing pattern.

## 🎯 Tool Requirements

### **✅ Must Have**

- **Client-side only**: Works with static hosting
- **Self-contained**: No shared dependencies between tools  
- **Offline capable**: Functions after initial load
- **Cache-friendly**: Works with our hash-based system

### **🚫 Not Supported**

- Server-side code (PHP, Node.js backends)
- Databases or persistent storage
- Real-time communication requiring servers
- Tools that need npm packages at runtime

### **✨ Recommended**

- Modern frameworks (React, Vue, Svelte) that build to static files
- Progressive Web App features
- Accessibility (WCAG compliance)
- Mobile-responsive design
- TypeScript for better development experience

### **How Cache-Busting Works**

1. Each deployment gets unique hash (e.g., `a1b2c3d4`)
2. Tool URLs become `/markslide-studio/?v=a1b2c3d4`
3. JavaScript detects hash changes and clears cache
4. Meta tags prevent browser caching

## 🚀 Deployment

### **Quick Commands**

```bash
# Build files to docs/ folder
bash scripts/build.sh

# Build + commit + push to GitHub
bash scripts/deploy.sh "Your commit message"
```

### **GitHub Pages Setup**

1. Repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / Folder: `/docs`
