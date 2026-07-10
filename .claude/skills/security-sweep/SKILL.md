---
name: security-sweep
description: Audit this project's code for security issues the way the session-6 audit did — RLS policy scoping, secret scanning, server-action auth guards, dependency advisories. Use before merging risky changes, after adding tables/actions/dependencies, or when the owner asks for a security check.
---

# Security Sweep — audit this codebase like the audit that caught the leak

You are auditing a production lead-gen site (Next.js 16 + Supabase, custom cookie auth). The worst incident here was a **customer-PII leak via a roleless RLS policy** — that class of bug is your primary target. Read docs/DECISIONS.md and docs/GOTCHAS.md first; do not re-flag accepted decisions as findings.

## 1. RLS — the pattern that caught the quote_submissions leak
For EVERY table in scripts/*.sql and every policy in Supabase:
- A policy without an explicit `to` clause applies to ALL roles including `anon` (whose key ships in the browser bundle). **That was the leak.** Every policy must say `to service_role`, or deliberately `to anon` for form INSERTs only.
- Red flags: `for all using (true)` without `to`; any `to authenticated` policy (this app doesn't use Supabase Auth — those are dormant backdoors).
- Verify from OUTSIDE, not just in SQL: `curl "https://<project>.supabase.co/rest/v1/<table>?select=*" -H "apikey: <ANON_KEY>"` must return `[]` or a permission error. Rows returned = leak. (Anon key is public by design; using it for this test is fine.)

## 2. Server actions — treat every one as a public endpoint
Next.js exposes every exported `"use server"` function over HTTP regardless of middleware. For each file with `"use server"`:
- Admin-facing actions MUST start with `if (!(await isAdminAuthenticated())) return ...` (pattern: app/admin/actions.ts). Grep: `Grep '"use server"'` then read each file.
- Public form actions MUST have: rate limit (`isRateLimited`) FIRST, Zod validation, tag-strip sanitize, and fail-soft error returns (never throw raw errors to the client).
- An exported action nothing calls is attack surface — flag for deletion.

## 3. Secrets
- `git grep -iE "(sk_live|api[_-]?key|secret|password|Bearer [A-Za-z0-9])" -- ':!pnpm-lock.yaml' ':!*.md'` — lockfile hashes and docs mentioning env var NAMES are false positives; values are findings.
- `.env*` must be gitignored (it is — verify it stayed that way). `vercel env pull` leaves a `.env.local` on disk with real ADMIN credentials — flag if one exists and the task is done with it.
- Never print values of: `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (AGENTS.md hard rule). Env var NAMES are fine.

## 4. Dependencies
- `pnpm audit` (NOT npm audit — pnpm-only project). Known context: next@16.0.10 has HIGH advisories (middleware bypass, server-action CSRF); the upgrade is a standing roadmap item and the reason per-action guards exist. New HIGH/CRITICAL findings on other packages → report with the fix command (`pnpm add <pkg>@latest`).
- New packages with install scripts require `pnpm-workspace.yaml` allowBuilds approval — an unexpected new entry there is worth a look.

## 5. Headers, cookies, misc
- next.config.mjs must keep: X-Frame-Options DENY, nosniff, HSTS, Referrer-Policy, Permissions-Policy. `serverActions.bodySizeLimit: 20mb` is intentional (gallery uploads).
- Admin cookie: httpOnly, secure-in-prod, sameSite lax, 24h — in lib/admin-auth.ts.
- Credentials must stay fail-closed (`?? ""` — never `||` with a fallback value).
- `dangerouslySetInnerHTML` is only acceptable for static JSON.stringify'd schema objects — any user input near it is a finding.

## Reporting
Rank by severity (leak > auth bypass > dependency > hardening). For each finding: file:line, the failure scenario in one sentence, and the concrete fix. Check docs/DECISIONS.md before flagging — e.g., custom cookie auth, images.unoptimized, and the in-memory rate limiter are accepted decisions, not findings.
