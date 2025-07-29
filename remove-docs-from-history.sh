#!/bin/bash

echo "🧹 Removing docs/ folder from git history"
echo "=========================================="

# Backup current branch
echo "📋 Creating backup of current branch..."
git branch backup-before-docs-cleanup

# Remove the entire docs/ folder from ALL commits
echo "🔥 Removing docs/ folder from git history..."
git filter-branch --force --index-filter \
  'git rm -rf --cached --ignore-unmatch docs/' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up refs
echo "🧹 Cleaning up refs..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin

# Expire all reflog entries
echo "🗑️  Expiring reflog entries..."
git reflog expire --expire=now --all

# Garbage collect to remove unreferenced objects
echo "🗑️  Running garbage collection..."
git gc --prune=now --aggressive

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Verify docs are gone: git log --oneline --name-status | grep docs"
echo "2. Check repository size: du -sh .git"
echo "3. If you're satisfied, force push to overwrite remote history: git push --force-with-lease origin main"
echo "4. If something went wrong, restore from backup: git checkout backup-before-docs-cleanup"
echo ""
echo "🚨 WARNING: This rewrites git history. All collaborators will need to re-clone the repository!"
echo ""
echo "📊 Repository size before and after:"
echo "Before: $(git count-objects -vH | grep size-pack)"