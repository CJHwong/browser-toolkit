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
    # Add cache-busting meta tags and script using cross-platform approach
    awk '
      /<head>/ { 
        print $0
        print "  <meta name=\"deployment-hash\" content=\"'$HASH'\">"
        print "  <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">"
        print "  <meta http-equiv=\"Pragma\" content=\"no-cache\">"
        print "  <meta http-equiv=\"Expires\" content=\"0\">"
        next
      }
      /<\/head>/ {
        print "  <script>"
        print "    // Cache busting for deployment '$HASH'"
        print "    (function() {"
        print "      const deployHash = \"'$HASH'\";"
        print "      console.log(\"🚀 Main Index - Deployment:\", deployHash);"
        print "      "
        print "      window.DEPLOYMENT_INFO = {"
        print "        hash: deployHash,"
        print "        buildTime: \"'$BUILD_TIME'\","
        print "        tool: \"main\""
        print "      };"
        print "      "
        print "      const lastDeployHash = localStorage.getItem(\"lastDeployHash_main\");"
        print "      if (lastDeployHash && lastDeployHash !== deployHash) {"
        print "        console.log(\"🔄 New deployment detected for main index, clearing cache...\");"
        print "        if (\"caches\" in window) {"
        print "          caches.keys().then(names => {"
        print "            names.forEach(name => caches.delete(name));"
        print "          });"
        print "        }"
        print "      }"
        print "      localStorage.setItem(\"lastDeployHash_main\", deployHash);"
        print "    })();"
        print "  </script>"
        print $0
        next
      }
      { print }
    ' "docs/index.html" > "docs/index.html.tmp" && mv "docs/index.html.tmp" "docs/index.html"
    
    echo "   ✅ Enhanced main index.html with cache-busting"
else
    echo "   ⚠️ Warning: docs/index.html not found for enhancement."
fi

# Add cache-busting enhancements to tools with index.html
echo "🔑 Adding cache-busting enhancements to tools..."
for tool_dir in docs/*/; do

    if [ -d "$tool_dir" ] && [ -f "$tool_dir/index.html" ]; then
        tool_name=$(basename "$tool_dir")
        # Add cache-busting meta tags and script using cross-platform approach
        awk '
          /<head>/ { 
            print $0
            print "  <meta name=\"deployment-hash\" content=\"'$HASH'\">"
            print "  <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">"
            print "  <meta http-equiv=\"Pragma\" content=\"no-cache\">"
            print "  <meta http-equiv=\"Expires\" content=\"0\">"
            next
          }
          /<\/head>/ {
            print "  <script>"
            print "    // Cache busting for deployment '$HASH'"
            print "    (function() {"
            print "      const deployHash = \"'$HASH'\";"
            print "      console.log(\"🚀 '$tool_name' - Deployment:\", deployHash);"
            print "      "
            print "      window.DEPLOYMENT_INFO = {"
            print "        hash: deployHash,"
            print "        buildTime: \"'$BUILD_TIME'\","
            print "        tool: \"'$tool_name'\""
            print "      };"
            print "      "
            print "      const lastDeployHash = localStorage.getItem(\"lastDeployHash_'$tool_name'\");"
            print "      if (lastDeployHash && lastDeployHash !== deployHash) {"
            print "        console.log(\"🔄 New deployment detected for '$tool_name', clearing cache...\");"
            print "        if (\"caches\" in window) {"
            print "          caches.keys().then(names => {"
            print "            names.forEach(name => caches.delete(name));"
            print "          });"
            print "        }"
            print "      }"
            print "      localStorage.setItem(\"lastDeployHash_'$tool_name'\", deployHash);"
            print "    })();"
            print "  </script>"
            print $0
            next
          }
          { print }
        ' "$tool_dir/index.html" > "$tool_dir/index.html.tmp" && mv "$tool_dir/index.html.tmp" "$tool_dir/index.html"
        
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

echo ""
echo "💅 running code format"
npm run format
