#!/usr/bin/env bash
# quick-start.sh — Install dependencies and start the dev server at localhost:3000

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Quick Start"
echo "========================================"
echo ""

# Check for Node.js
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Install it from https://nodejs.org"
  exit 1
fi

echo "Node: $(node --version)"
echo "npm:  $(npm --version)"
echo ""

# Check for .env.local
if [ ! -f ".env.local" ]; then
  echo "WARNING: .env.local not found."
  echo "  The site will load but forms and admin will not work without Supabase credentials."
  echo "  Create .env.local with:"
  echo "    NEXT_PUBLIC_SUPABASE_URL=..."
  echo "    NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
  echo "    SUPABASE_SERVICE_ROLE_KEY=..."
  echo "    ADMIN_EMAIL=..."
  echo "    ADMIN_PASSWORD=..."
  echo ""
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Starting dev server..."
echo "  URL: http://localhost:3000"
echo "  Admin: http://localhost:3000/admin/login"
echo ""
echo "Press Ctrl+C to stop."
echo ""

npm run dev
