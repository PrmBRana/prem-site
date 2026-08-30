#!/usr/bin/env bash
# ==============================================================================
# Prem Bahadur Rana - One-Click Website & Articles Upload Script
# ==============================================================================

set -e

MSG="$1"
if [ -z "$MSG" ]; then
  MSG="docs: update articles and website content ($(date +'%Y-%m-%d %H:%M'))"
fi

echo -e "\033[1;34m==>\033[0m Staging all changes (articles, photos, videos, code)..."
git add -A

echo -e "\033[1;34m==>\033[0m Current git status:"
git status -s

echo -e "\033[1;34m==>\033[0m Committing: \"$MSG\""
git commit -m "$MSG" || {
  echo -e "\033[1;33m==>\033[0m No new changes to commit."
  exit 0
}

echo -e "\033[1;34m==>\033[0m Pushing live to GitHub (main branch)..."
git push origin main

echo -e "\033[1;32m✓ SUCCESS:\033[0m All updates published live to https://premrana.com.np/"
