#!/bin/bash
set -e

echo "=== CWD: $(pwd) ==="

# Build core and client
pnpm --filter client build

# Find and move dist to root
echo "=== Looking for dist ==="
if [ -d "packages/client/dist" ]; then
  echo "Found at packages/client/dist"
  cp -r packages/client/dist ./dist
elif [ -d "dist" ]; then
  echo "Already at root dist/"
else
  echo "Searching..."
  find . -maxdepth 4 -name 'index.html' -not -path '*/node_modules/*' 2>&1
  exit 1
fi

echo "=== dist/index.html exists: ==="
ls -la dist/index.html
