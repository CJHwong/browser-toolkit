#!/bin/bash

echo "🚀 Hash-Based Deployment with Cache Busting"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "index.html" ]; then
    echo "❌ Error: Run this script from the browser-toolkit root directory"
    exit 1
fi

# Generate unique deployment hash
HASH=$(date +%s | shasum -a 256 | cut -c1-8)
BUILD_TIME=$(date -Iseconds)

echo "🔑 Generated deployment hash: $HASH"

# Clean and create docs directory
echo "🧹 Cleaning previous build..."
rm -rf docs
mkdir -p docs

# Create index.html with cache-busting hash in URLs
echo "📄 Creating landing page with cache-busting URLs..."
sed "s|href=\"\\.\/\\([^\"]*\\)\/\"|href=\"./\\1/?v=$HASH\"|g" index.html > docs/index.html

# Create version info file
echo "📋 Creating version info file..."
cat > docs/version.json << EOF
{
  "deployHash": "$HASH",
  "buildTime": "$BUILD_TIME",
  "tools": ["markslide-studio"]
}
EOF

# Build React applications
echo "🔨 Building MarkSlide Studio..."
npm run build --workspace=tools/markslide-studio

# Copy built app to docs
echo "📁 Copying MarkSlide Studio with cache-busting enhancements..."
cp -r tools/markslide-studio/build docs/markslide-studio

# Add cache-busting meta tags and scripts to the React app
if [ -f "docs/markslide-studio/index.html" ]; then
    # Create backup
    cp docs/markslide-studio/index.html docs/markslide-studio/index.html.backup
    
    # Add cache-busting meta tags after <head>
    sed -i '' 's|<head>|<head>\
  <meta name="deployment-hash" content="'$HASH'">\
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\
  <meta http-equiv="Pragma" content="no-cache">\
  <meta http-equiv="Expires" content="0">|' docs/markslide-studio/index.html
    
    # Add cache-busting script before </head>
    sed -i '' 's|</head>|\
  <script>\
    // Cache busting for deployment '$HASH'\
    (function() {\
      const deployHash = "'$HASH'";\
      console.log("🚀 MarkSlide Studio - Deployment:", deployHash);\
      \
      window.DEPLOYMENT_INFO = {\
        hash: deployHash,\
        buildTime: "'$BUILD_TIME'",\
        tool: "markslide-studio"\
      };\
      \
      const lastDeployHash = localStorage.getItem("lastDeployHash");\
      if (lastDeployHash \&\& lastDeployHash !== deployHash) {\
        console.log("🔄 New deployment detected, clearing cache...");\
        if ("caches" in window) {\
          caches.keys().then(names => {\
            names.forEach(name => caches.delete(name));\
          });\
        }\
      }\
      localStorage.setItem("lastDeployHash", deployHash);\
    })();\
  </script>\
</head>|' docs/markslide-studio/index.html
    
    # Clean up backup
    rm docs/markslide-studio/index.html.backup
    
    echo "🔑 Added cache-busting enhancements to MarkSlide Studio"
fi

echo ""
echo "✅ Hash-based deployment completed successfully!"
echo "📊 Deployment Details:"
echo "   Hash: $HASH"
echo "   Build Time: $BUILD_TIME"
echo "   Files: docs/ directory ready for deployment"
echo ""
echo "🚀 Next steps:"
echo "   1. Test locally: cd docs && python -m http.server 8080"
echo "   2. Commit: git add docs/ && git commit -m 'Deploy: Hash $HASH'"
echo "   3. Push: git push origin main"