---
name: safe-setup
description: The safe way to start any new work or feature in this project so nothing breaks — pnpm-only, TS enforcement, the test gate, migration sequencing, and the push-equals-production-deploy pipeline. Use at the start of any coding task here.
---

# Safe Setup — how to start work here without breaking production

**The one fact that changes everything: every push to `master` deploys production immediately. There is no staging.** The local 45-test Cypress suite is the only merge gate.

## Before writing code
1. Read AGENTS.md (rules), docs/GOTCHAS.md (failure modes), and check docs/ROADMAP.md + HANDOFF.md latest session so you don't redo or undo recent work. docs/DECISIONS.md lists settled decisions — don't reverse them.
2. Owner-locked values you may NEVER change without explicit instruction: phone number, service-area cities, logo files, "Licensed & Insured" stays absent. Business facts live ONLY in `lib/business-info.ts`.
3. `git status` — start clean. For risky work, branch (`security/...` pattern) and merge after tests; routine work goes on master directly.

## The iron rules
- **pnpm ONLY** for dependencies (`pnpm add`). `npm install` recreates package-lock.json → lockfile desync → broken deploy (happened once). Install scripts need `pnpm-workspace.yaml` allowBuilds approval.
- **TypeScript errors fail the Vercel build** — run `npx tsc --noEmit` before committing; a red deploy is usually a type error.
- **DB changes are manual SQL** in the Supabase Dashboard, run BEFORE pushing code that needs the schema. New tables: RLS `to service_role` explicitly (docs/sops/database-migrations.md). Make code fail soft when its migration hasn't run (pattern: lib/gallery.ts).
- **Test gate:** dev server first (`npm run dev`, wait for 200), then `npm run cypress:run` — all 45 must pass. First run against a cold dev server can flake (pre-warm pages with curl, or re-run the failed spec before believing a failure).
- **Rate limiter constraint:** the suite makes exactly 2 real form submissions per run (3/IP/15min budget, counted before validation). New tests assert client-side `:invalid`, never submit.

## Patterns to copy, not reinvent
- Server action with rate limit + Zod + sanitize + fail-soft: `app/contact/actions.ts` or `app/quote/actions.ts`
- Admin action with auth guard: `app/admin/actions.ts` (EVERY admin action starts with the `isAdminAuthenticated()` check — no exceptions)
- Campaign copy: content modules in lib/ (never hardcode copy in components)
- Hero images: pre-generated variants + `<picture>` (docs/sops/hero-images.md) — never ship a raw multi-MB image
- Fixed top-of-page elements must join the `--announcement-height` offset system (GOTCHAS #17)

## Finishing
Commit with a clear message + the `Co-Authored-By: Claude` trailer. Push only after 45/45. Confirm the Vercel deploy went green. End the session with `/close-session`. New decision made? → docs/DECISIONS.md. New failure mode hit? → docs/GOTCHAS.md.
