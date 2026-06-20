#!/usr/bin/env bash
# code-quality.sh — Run ESLint and TypeScript type checks

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

LINT_EXIT=0
TSC_EXIT=0

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Code Quality Check"
echo "========================================"
echo ""

# ESLint
echo "--- ESLint ---"
if npm run lint 2>&1; then
  echo "  Lint: PASSED"
else
  LINT_EXIT=$?
  echo "  Lint: FAILED (see errors above)"
fi

echo ""

# TypeScript type check (separate from build — build ignores TS errors)
echo "--- TypeScript ---"
echo "  Note: next.config.mjs ignores TS errors at build time."
echo "  This check runs tsc directly to surface real issues."
echo ""

if npx tsc --noEmit 2>&1; then
  echo "  TypeScript: PASSED (no type errors)"
else
  TSC_EXIT=$?
  echo "  TypeScript: FAILED (see type errors above)"
fi

echo ""
echo "========================================"

if [ "$LINT_EXIT" -eq 0 ] && [ "$TSC_EXIT" -eq 0 ]; then
  echo "  All checks PASSED"
  echo "========================================"
  echo ""
  exit 0
else
  echo "  Some checks FAILED"
  [ "$LINT_EXIT" -ne 0 ] && echo "  - ESLint: FAILED"
  [ "$TSC_EXIT" -ne 0 ] && echo "  - TypeScript: FAILED"
  echo "========================================"
  echo ""
  exit 1
fi
