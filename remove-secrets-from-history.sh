#!/bin/bash

echo "🧹 Removing Firebase secrets from git history"
echo "============================================="

# Backup current branch
echo "📋 Creating backup of current branch..."
git branch backup-before-cleanup

# Remove the firebase-config.json file from ALL commits
echo "🔥 Removing tools/scrum-poker/firebase-config.json from git history..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch tools/scrum-poker/firebase-config.json' \
  --prune-empty --tag-name-filter cat -- --all

# Remove the docs version too (if it exists)
echo "🔥 Removing docs/scrum-poker/firebase-config.json from git history..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch docs/scrum-poker/firebase-config.json' \
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
echo "1. Verify the secrets are gone: git log --oneline --follow -- tools/scrum-poker/firebase-config.json"
echo "2. If you're satisfied, force push to overwrite remote history: git push --force-with-lease origin main"
echo "3. If something went wrong, restore from backup: git checkout backup-before-cleanup"
echo ""
echo "🚨 WARNING: This rewrites git history. All collaborators will need to re-clone the repository!"