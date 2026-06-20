#!/usr/bin/env bash
# verify-build.sh — Run npm run build and report success or failure

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Build Verification"
echo "========================================"
echo ""

# Warn about missing .env.local
if [ ! -f ".env.local" ]; then
  echo "WARNING: .env.local not found. Build may succeed but runtime features"
  echo "         (forms, admin) will not work without environment variables."
  echo ""
fi

echo "Running: npm run build"
echo "This may take 1-2 minutes..."
echo ""

START_TIME=$(date +%s)

if npm run build 2>&1; then
  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  echo ""
  echo "========================================"
  echo "  BUILD SUCCEEDED in ${ELAPSED}s"
  echo "========================================"
  echo ""
  echo "  The .next/ build output is ready."
  echo "  To preview production build locally: npm run start"
  echo ""
  exit 0
else
  END_TIME=$(date +%s)
  ELAPSED=$((END_TIME - START_TIME))
  echo ""
  echo "========================================"
  echo "  BUILD FAILED after ${ELAPSED}s"
  echo "========================================"
  echo ""
  echo "  Common causes:"
  echo "  - Missing imports or broken require() paths"
  echo "  - Server-only code used in a Client Component"
  echo "  - Missing required packages (run: npm install)"
  echo ""
  echo "  Note: TypeScript errors are suppressed in next.config.mjs"
  echo "  (ignoreBuildErrors: true) — fix TS errors anyway."
  echo ""
  exit 1
fi
