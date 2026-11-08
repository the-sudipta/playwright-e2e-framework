#!/usr/bin/env bash
# Prepares the repo on Linux/macOS or CI (Node.js 20+ must be installed).
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci
npx playwright install --with-deps chromium firefox webkit
echo "Setup complete. Run: npm test"
