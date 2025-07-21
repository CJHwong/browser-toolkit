# 🚀 Browser Toolkit Deployment Guide

This document explains how the unified deployment system works for all Browser Toolkit tools.

## 📁 Project Structure

```
browser-toolkit/
├── index.html                  # Main landing page
├── markslide-studio/           # Individual tool (React app)
│   ├── src/                    # Tool source code
│   ├── build/                  # Tool build output
│   └── package.json            # Tool dependencies
├── dist/                       # Deployment output (generated)
│   ├── index.html              # Main landing page
│   └── markslide-studio/       # Built tool
├── .github/workflows/          # Automated deployment
│   └── deploy.yml              # GitHub Actions workflow
└── package.json                # Root package.json with deployment scripts
```

## 🔧 Deployment Process

### Automated Deployment (Recommended)

1. **Push to GitHub:** Any push to the `main` branch automatically triggers deployment
2. **GitHub Actions builds all tools** using the workflow in `.github/workflows/deploy.yml`
3. **Deploys to GitHub Pages** at `https://cjhwong.github.io/browser-toolkit`

### Manual Deployment

```bash
# Build all tools and prepare for deployment
npm run build:deploy

# Deploy to GitHub Pages
npm run deploy
```

## 📦 Build Scripts Explained

- `build:clean` - Removes the `dist` folder
- `build:all` - Builds all tools and copies files to `dist`
- `build:copy-tools` - Copies built tools to the deployment folder
- `build:deploy` - Complete build process (clean + build + copy)
- `deploy` - Pushes the `dist` folder to GitHub Pages

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
   "build:copy-tools": "cp -r markslide-studio/build dist/markslide-studio && cp -r your-new-tool/build dist/your-new-tool"
   ```

3. **Add to landing page** (`index.html`) with a new tool card

4. **Set homepage in tool's package.json** to `"./"` for relative paths

## ⚙️ Configuration

### Root Package.json

- `homepage`: Set to GitHub Pages URL
- `workspaces`: List all tool directories
- Deployment scripts handle building all tools

### Tool Package.json

- `homepage`: Set to `"./"` for relative paths
- Keep build scripts simple (`npm run build`)
- No individual deployment configuration needed

## 🎯 Benefits of This Approach

- **Single deployment** handles all tools
- **Consistent URLs**: `domain.com/tool-name/`
- **Shared dependencies** and linting rules
- **Automated deployment** on every push
- **Easy to add new tools** without deployment complexity

## 🔍 Troubleshooting

### GitHub Pages Shows README Instead of App

- Check that GitHub Actions deployment is enabled in repository settings
- Verify the workflow completed successfully in the Actions tab
- Ensure GitHub Pages source is set to "GitHub Actions"

### Tool Not Loading

- Check that the tool's `package.json` has `"homepage": "./"`
- Verify the build script copied the tool correctly to `dist/`
- Check browser console for any path-related errors
