#!/usr/bin/env bash
# documentation-generator.sh — Remind the developer to keep ARCHITECTURE.md and AGENTS.md current

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Documentation Check"
echo "========================================"
echo ""

ARCH_FILE="$PROJECT_ROOT/ARCHITECTURE.md"
AGENTS_FILE="$PROJECT_ROOT/AGENTS.md"
ISSUES=0

# Check files exist
if [ -f "$ARCH_FILE" ]; then
  ARCH_MODIFIED=$(date -r "$ARCH_FILE" "+%Y-%m-%d" 2>/dev/null || stat -c "%y" "$ARCH_FILE" 2>/dev/null | cut -d' ' -f1)
  echo "  ARCHITECTURE.md — last modified: $ARCH_MODIFIED"
else
  echo "  [MISSING] ARCHITECTURE.md — this file must exist"
  ISSUES=$((ISSUES + 1))
fi

if [ -f "$AGENTS_FILE" ]; then
  AGENTS_MODIFIED=$(date -r "$AGENTS_FILE" "+%Y-%m-%d" 2>/dev/null || stat -c "%y" "$AGENTS_FILE" 2>/dev/null | cut -d' ' -f1)
  echo "  AGENTS.md         — last modified: $AGENTS_MODIFIED"
else
  echo "  [MISSING] AGENTS.md — this file must exist"
  ISSUES=$((ISSUES + 1))
fi

echo ""
echo "========================================"
echo "  DOCUMENTATION UPDATE CHECKLIST"
echo "========================================"
echo ""
echo "  Update ARCHITECTURE.md when you:"
echo "  [ ] Add or remove a page/route"
echo "  [ ] Add a new environment variable"
echo "  [ ] Change the phone number"
echo "  [ ] Change the service area cities"
echo "  [ ] Add a new component to the shared components/ folder"
echo "  [ ] Change the campaign name (spring-rush → summer-special, etc.)"
echo "  [ ] Change pricing in lib/spring-rush-content.ts"
echo "  [ ] Add or change a Supabase table"
echo "  [ ] Change any deployment configuration"
echo ""
echo "  Update AGENTS.md when you:"
echo "  [ ] Introduce a new pattern all AI agents should follow"
echo "  [ ] Add new protected content (logo, phone, cities) to the 'never change' list"
echo "  [ ] Change the tech stack or add a major dependency"
echo "  [ ] Update the design system (colors, fonts, button styles)"
echo ""
echo "  Git check — recent changes:"
echo ""

if command -v git &>/dev/null && git rev-parse --git-dir &>/dev/null 2>&1; then
  git log --oneline -5 2>/dev/null || echo "  (no git log available)"
else
  echo "  (not a git repo)"
fi

echo ""

if [ "$ISSUES" -gt 0 ]; then
  echo "  $ISSUES documentation file(s) missing — please restore them."
  exit 1
else
  echo "  Both documentation files are present."
  echo "  Review the checklist above and update them if any items apply."
fi

echo ""
