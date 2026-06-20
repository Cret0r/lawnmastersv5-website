#!/usr/bin/env bash
# dev-verify.sh — Verify the dev environment is healthy before starting work

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"
  if [ "$result" = "ok" ]; then
    echo "  [PASS] $label"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] $label — $result"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Dev Environment Check"
echo "========================================"
echo ""

# Node.js
if command -v node &>/dev/null; then
  check "Node.js installed" "ok"
else
  check "Node.js installed" "not found — install from https://nodejs.org"
fi

# npm
if command -v npm &>/dev/null; then
  check "npm installed" "ok"
else
  check "npm installed" "not found"
fi

# node_modules
if [ -d "node_modules" ]; then
  check "node_modules present" "ok"
else
  check "node_modules present" "missing — run: npm install"
fi

# package.json
if [ -f "package.json" ]; then
  check "package.json exists" "ok"
else
  check "package.json exists" "missing — wrong directory?"
fi

# .env.local
if [ -f ".env.local" ]; then
  check ".env.local exists" "ok"
else
  check ".env.local exists" "missing — create it with Supabase + admin credentials"
fi

# Check env vars if .env.local present
if [ -f ".env.local" ]; then
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    check "NEXT_PUBLIC_SUPABASE_URL set" "ok"
  else
    check "NEXT_PUBLIC_SUPABASE_URL set" "not found in .env.local"
  fi

  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    check "NEXT_PUBLIC_SUPABASE_ANON_KEY set" "ok"
  else
    check "NEXT_PUBLIC_SUPABASE_ANON_KEY set" "not found in .env.local"
  fi

  if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    check "SUPABASE_SERVICE_ROLE_KEY set" "ok"
  else
    check "SUPABASE_SERVICE_ROLE_KEY set" "not found in .env.local"
  fi

  if grep -q "ADMIN_EMAIL" .env.local; then
    check "ADMIN_EMAIL set" "ok"
  else
    check "ADMIN_EMAIL set" "not found — admin login will use default test credentials"
  fi

  if grep -q "ADMIN_PASSWORD" .env.local; then
    check "ADMIN_PASSWORD set" "ok"
  else
    check "ADMIN_PASSWORD set" "not found — admin login will use default test credentials"
  fi
fi

# next.config.mjs
if [ -f "next.config.mjs" ]; then
  check "next.config.mjs exists" "ok"
else
  check "next.config.mjs exists" "missing"
fi

# Key content files
if [ -f "lib/spring-rush-content.ts" ]; then
  check "lib/spring-rush-content.ts (master content)" "ok"
else
  check "lib/spring-rush-content.ts (master content)" "missing — critical file"
fi

if [ -f "lib/reviews-data.ts" ]; then
  check "lib/reviews-data.ts" "ok"
else
  check "lib/reviews-data.ts" "missing"
fi

# Git status
if command -v git &>/dev/null && git rev-parse --git-dir &>/dev/null 2>&1; then
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  check "Git repo on branch: $BRANCH" "ok"
else
  check "Git repo" "not a git repo or git not installed"
fi

echo ""
echo "========================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "========================================"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Fix the issues above before starting development."
  exit 1
else
  echo "All checks passed. Run scripts/development/quick-start.sh to launch the dev server."
fi
echo ""
