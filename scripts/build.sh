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

# Auto-detect all tools and create version info
echo "🔍 Auto-detecting tools in tools/ directory..."
TOOL_LIST=""
for tool_dir in tools/*/; do
    if [ -d "$tool_dir" ]; then
        tool_name=$(basename "$tool_dir")
        if [ -z "$TOOL_LIST" ]; then
            TOOL_LIST="\"$tool_name\""
        else
            TOOL_LIST="$TOOL_LIST, \"$tool_name\""
        fi
        echo "   Found tool: $tool_name"
    fi
done

echo "📋 Creating version info file..."
cat > docs/version.json << EOF
{
  "deployHash": "$HASH",
  "buildTime": "$BUILD_TIME",
  "tools": [$TOOL_LIST]
}
EOF

# Build and copy all tools
echo "🔨 Building and copying all tools..."
for tool_dir in tools/*/; do
    if [ -d "$tool_dir" ]; then
        tool_name=$(basename "$tool_dir")
        echo "📦 Processing $tool_name..."
        
        # Check if it's a React/npm project (has package.json)
        if [ -f "$tool_dir/package.json" ]; then
            echo "   Building React app: $tool_name"
            npm run build --workspace="tools/$tool_name"
            
            if [ -d "$tool_dir/build" ]; then
                cp -r "$tool_dir/build" "docs/$tool_name"
                echo "   ✅ Copied built React app to docs/$tool_name"
            else
                echo "   ⚠️ Warning: No build directory found for $tool_name"
            fi
        else
            # Simple HTML tool - copy directly
            echo "   Copying static HTML tool: $tool_name"
            cp -r "$tool_dir" "docs/$tool_name"
            echo "   ✅ Copied static tool to docs/$tool_name"
        fi
    fi
done

# Add cache-busting to the main docs/index.html
echo "🔑 Adding cache-busting to main index.html..."
if [ -f "docs/index.html" ]; then
    # Create backup
    cp "docs/index.html" "docs/index.html.backup"
    
    # Add cache-busting meta tags after <head>
    sed -i '' 's|<head>|<head>\
  <meta name="deployment-hash" content="'$HASH'">\
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\
  <meta http-equiv="Pragma" content="no-cache">\
  <meta http-equiv="Expires" content="0">|' "docs/index.html"
    
    # Add cache-busting script before </head>
    sed -i '' 's|</head>|\
  <script>\
    // Cache busting for deployment '$HASH'\
    (function() {\
      const deployHash = "'$HASH'";\
      console.log("🚀 Main Index - Deployment:", deployHash);\
      \
      window.DEPLOYMENT_INFO = {\
        hash: deployHash,\
        buildTime: "'$BUILD_TIME'",\
        tool: "main"\
      };\
      \
      const lastDeployHash = localStorage.getItem("lastDeployHash_main");\
      if (lastDeployHash && lastDeployHash !== deployHash) {\
        console.log("🔄 New deployment detected for main index, clearing cache...");\
        if ("caches" in window) {\
          caches.keys().then(names => {\
            names.forEach(name => caches.delete(name));\
          });\
        }\
      }\
      localStorage.setItem("lastDeployHash_main", deployHash);\
    })();\
  </script>\
</head>|' "docs/index.html"
    
    # Clean up backup
    rm "docs/index.html.backup"
    
    echo "   ✅ Enhanced main index.html with cache-busting"
else
    echo "   ⚠️ Warning: docs/index.html not found for enhancement."
fi

# Add cache-busting enhancements to tools with index.html
echo "🔑 Adding cache-busting enhancements to tools..."
for tool_dir in docs/*/; do

    if [ -d "$tool_dir" ] && [ -f "$tool_dir/index.html" ]; then
        tool_name=$(basename "$tool_dir")
        # Create backup
        cp "$tool_dir/index.html" "$tool_dir/index.html.backup"
        
        # Add cache-busting meta tags after <head>
        sed -i '' 's|<head>|<head>\
  <meta name="deployment-hash" content="'$HASH'">\
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\
  <meta http-equiv="Pragma" content="no-cache">\
  <meta http-equiv="Expires" content="0">|' "$tool_dir/index.html"
        
        # Add cache-busting script before </head>
        sed -i '' 's|</head>|\
  <script>\
    // Cache busting for deployment '$HASH'\
    (function() {\
      const deployHash = "'$HASH'";\
      console.log("🚀 '$tool_name' - Deployment:", deployHash);\
      \
      window.DEPLOYMENT_INFO = {\
        hash: deployHash,\
        buildTime: "'$BUILD_TIME'",\
        tool: "'$tool_name'"\
      };\
      \
      const lastDeployHash = localStorage.getItem("lastDeployHash_'$tool_name'");\
      if (lastDeployHash \&\& lastDeployHash !== deployHash) {\
        console.log("🔄 New deployment detected for '$tool_name', clearing cache...");\
        if ("caches" in window) {\
          caches.keys().then(names => {\
            names.forEach(name => caches.delete(name));\
          });\
        }\
      }\
      localStorage.setItem("lastDeployHash_'$tool_name'", deployHash);\
    })();\
  </script>\
</head>|' "$tool_dir/index.html"
        
        # Clean up backup
        rm "$tool_dir/index.html.backup"
        
        echo "   ✅ Enhanced $tool_name with cache-busting"
    fi
done

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