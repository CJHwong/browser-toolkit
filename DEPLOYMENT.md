# 🚀 Browser Toolkit Deployment Guide

This document explains the **pre-built deployment** system for all Browser Toolkit tools.

## 📁 Project Structure

```
browser-toolkit/
├── index.html                    # Main landing page
├── markslide-studio/            # Individual tool (React app)
│   ├── src/                     # Tool source code
│   ├── build/                   # Tool build output (ignored)
│   └── package.json            # Tool dependencies
├── docs/                        # Pre-built deployment files (committed)
│   ├── index.html              # Main landing page
│   └── markslide-studio/       # Built tool
└── package.json                # Root package.json with build scripts
```

## 🔧 Deployment Process

### Pre-Built Deployment (Current Approach)

1. **Build locally:** Run `npm run build:production` 
2. **Commit built files:** Built files in `docs/` are committed to repository
3. **Push to GitHub:** GitHub Pages serves files directly from `docs/` folder
4. **No build process needed** on GitHub Pages

### Manual Build & Deploy

```bash
# Build all tools for production
npm run build:production

# Commit the built files
git add docs/
git commit -m "Deploy: Update built files"
git push origin main
```

## 📦 Build Scripts Explained

- `build:clean` - Removes the `docs` folder
- `build:all` - Builds all tools and copies files to `docs`
- `build:copy-tools` - Copies built tools to the `docs` folder
- `build:production` - Complete build process (clean + build + copy)
- `build:commit` - Shows instructions for committing built files

## 🛠️ Adding New Tools

When adding a new tool to the Browser Toolkit:

1. **Add to workspaces** in root `package.json`:
   ```json
   "workspaces": [
     "markslide-studio",
     "your-new-tool"
   ]
   ```

2. **Update build script** to copy the new tool:
   ```json
   "build:copy-tools": "cp -r markslide-studio/build docs/markslide-studio && cp -r your-new-tool/build docs/your-new-tool"
   ```

3. **Add to landing page** (`index.html`) with a new tool card

4. **Set homepage in tool's package.json** to `"./"` for relative paths

## ⚙️ Configuration

### Root Package.json
- `homepage`: Set to GitHub Pages URL
- `workspaces`: List all tool directories
- Build scripts handle creating production files

### Tool Package.json
- `homepage`: Set to `"./"` for relative paths
- Keep build scripts simple (`npm run build`)
- No individual deployment configuration needed

## 🎯 Benefits of Pre-Built Deployment

- **Faster GitHub Pages** - No build process required
- **Reliable deployment** - Built files are tested locally
- **Version control** of built assets
- **Simple GitHub Pages setup** - Just serve static files
- **No GitHub Actions complexity** - Direct static file serving
- **Predictable results** - What you build locally is what gets deployed

## 🔍 Troubleshooting

### GitHub Pages Shows README Instead of App
- Ensure GitHub Pages source is set to "Deploy from a branch" → "docs folder"
- Verify the `docs/` folder contains the built files
- Check that files were committed and pushed to the repository

### Tool Not Loading
- Check that the tool's `package.json` has `"homepage": "./"`
- Verify the build script copied the tool correctly to `docs/`
- Run `npm run build:production` to rebuild all tools
- Check browser console for any path-related errors

### Build Process Issues
- Ensure all dependencies are installed: `npm install && npm install --workspaces`
- Check that individual tools build successfully: `npm run build --workspace=tool-name`
- Verify the `docs/` folder structure matches the expected layout

## 🚀 Quick Deployment Workflow

```bash
# 1. Make changes to your tools
# 2. Build for production
npm run build:production

# 3. Test locally (optional)
cd docs && python -m http.server 8000

# 4. Commit and deploy
git add docs/
git commit -m "Deploy: Update MarkSlide Studio"
git push origin main

# 5. GitHub Pages will serve the updated files immediately
```

This approach ensures reliable, fast deployments with full control over the build process!