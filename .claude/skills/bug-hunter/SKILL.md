---
name: bug-hunter
description: Verify a bug is ACTUALLY fixed in this project by running the app and observing behavior — not by trusting that the code change looks right. Use after any fix, before claiming anything works, and when a test fails mysteriously.
---

# Bug Hunter — "it compiles" is not "it works"

The standard here: a fix is done when you have OBSERVED the corrected behavior in the running app. Type-checking passing, the diff looking right, and the logic seeming sound are all necessary and all insufficient.

## The verification ladder (climb as high as the change allows)
1. `npx tsc --noEmit` — floor, not proof.
2. **Start the app and hit the real surface:** `npm run dev` (background), wait for a 200 on :3000, then `curl` the affected route — check status code AND grep the response for the content that proves the change ("expected string FOUND / MISSING" style). For redirects, check the code + Location (e.g., /spring-rush → 308 → /summer).
3. **Exercise the flow, not just the page:** forms → run the relevant Cypress spec; interactions (drawers, sliders, multi-step flows) → the spec that clicks through them. For visual/layout claims, a Cypress failure screenshot or the claude-in-chrome browser is observation; your mental model is not.
4. **Full suite** (`npm run cypress:run`, all ~50 tests) before any commit that touches product code.

## Project-specific traps that fake you out
- **Cold-compile flake:** the first suite run against a freshly started dev server can fail on timing (contact submit, drawer animation). Before believing a failure, re-run the failing spec in isolation; before a full run, pre-warm pages with curl. A test that fails cold and passes warm is flake — but a test that fails twice warm is REAL.
- **Read the screenshot:** every Cypress failure writes `cypress/screenshots/...png`. Read the image — it shows the actual page state (a hydration overlay, a covering element) faster than the error text.
- **Silent HTML validation failures:** an invalid `pattern` regex (v-flag rules — escape `(` `)` in character classes) is IGNORED by the browser, so validation you think exists doesn't. Test invalid input actually being blocked, not just the attribute existing.
- **Fail-soft features hide breakage:** notify/gallery are designed to silently no-op when unconfigured. "No error" ≠ working — check the log line ("Lead notification skipped...") or the actual side effect.
- **Rate limiter:** manual form testing counts against 3/IP/15min (before validation). Two real submissions belong to the suite — don't burn slots, and don't misread "Too many requests" as your bug.
- **Dev-only hydration noise:** /admin/login briefly disables its form after load in dev; production doesn't. Don't "fix" the app for a dev-only symptom (the test waits instead).
- **`next build` while dev server runs** shares `.next/` — weird dev behavior after a build means restart the dev server, not a real bug.

## Closing a bug honestly
State exactly what was observed and how ("curl shows X", "spec Y passed cold and warm", "screenshot shows the drawer offset"). If you couldn't observe it (needs production env, owner account, unrun migration) — SAY SO explicitly and hand the owner the one-line verification step. Never report "fixed" on inference. If the hunt revealed a new failure mode, add it to docs/GOTCHAS.md.
