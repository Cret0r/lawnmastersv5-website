# SOP: Running & Adding Cypress Tests

## Running
1. Dev server FIRST (separate/background process): `npm run dev` — wait for 200 on localhost:3000.
2. `npm run cypress:run` — 9 specs, **45 tests**, ~1–1.5 min. All must pass before any merge/push (AGENTS.md).
3. Single spec: `npx cypress run --spec "cypress/e2e/<name>.cy.ts"`. Failure screenshots land in `cypress/screenshots/` — read the PNG; it often shows the real problem (e.g., hydration overlay) faster than the log.

## Hard rules for new tests
- **Max 2 real form submissions per suite run — already used** by quote.cy.ts and contact.cy.ts. The rate limiter (3/IP/15min, shared across both forms, counted BEFORE validation) will fail a third. Write validation tests client-side: assert `input:invalid`, never submit successfully.
- Submission-style assertions should accept "Too many requests" as a pass (see existing specs) so back-to-back local runs don't flake.
- Mobile tests: `cy.viewport("iphone-x")`. The announcement bar no longer covers the nav (offset fix), so no localStorage pre-dismissal is needed — don't add it back.
- /admin/login interactions need the hydration-settle wait (see admin-auth.cy.ts) — dev-mode React re-render briefly disables the form.
- `cypress/support/e2e.ts` swallows hydration + Supabase uncaught exceptions deliberately — don't "fix" that.

## When counts change
Update the test count in AGENTS.md ("all N tests must pass") and ARCHITECTURE.md § 8.
