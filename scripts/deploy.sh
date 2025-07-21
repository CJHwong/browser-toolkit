#!/bin/bash

# Browser Toolkit Deployment Script
# This script builds all tools and commits them for GitHub Pages deployment

set -e

echo "🚀 Browser Toolkit Deployment"
echo "=============================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: This is not a git repository"
    exit 1
fi

# Check for uncommitted changes (excluding docs folder)
if ! git diff --quiet -- . ':(exclude)docs/'; then
    echo "⚠️  Warning: You have uncommitted changes (excluding docs/)"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔨 Building with hash-based cache busting..."
bash scripts/build.sh

echo "📋 Checking build output..."
if [ ! -d "docs" ]; then
    echo "❌ Error: docs folder was not created"
    exit 1
fi

if [ ! -f "docs/index.html" ]; then
    echo "❌ Error: Main index.html not found in docs/"
    exit 1
fi

if [ ! -f "docs/markslide-studio/index.html" ]; then
    echo "❌ Error: MarkSlide Studio not built properly"
    exit 1
fi

# Show deployment hash
if [ -f "DEPLOY_HASH" ]; then
    HASH=$(cat DEPLOY_HASH)
    echo "✅ Build completed successfully with hash: $HASH"
else
    echo "✅ Build completed successfully!"
fi

# Add built files to git
echo "📝 Staging built files..."
git add docs/

# Check if there are any changes to commit
if git diff --quiet --cached; then
    echo "ℹ️  No changes to deploy"
    exit 0
fi

# Get commit message
if [ -n "$1" ]; then
    COMMIT_MSG="Deploy: $1"
else
    echo
    read -p "📝 Enter commit message (or press Enter for default): " COMMIT_MSG
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Deploy: Update built files"
    else
        COMMIT_MSG="Deploy: $COMMIT_MSG"
    fi
fi

# Commit the changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://cjhwong.github.io/browser-toolkit/"
echo "   MarkSlide Studio: https://cjhwong.github.io/browser-toolkit/markslide-studio/"
echo
echo "📝 Make sure to set GitHub Pages source to 'docs folder' in repository settings"