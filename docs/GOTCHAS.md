# Known Issues & Gotchas — Canonical List

> Every gotcha from HANDOFF.md, SCRIPTS.md, AGENTS.md, and session history in one place. If you hit something weird, check here FIRST. When adding a gotcha, add it here and reference it from HANDOFF.md rather than duplicating.

---

## Norton (three separate ways it interferes)

1. **HTTPS scanning breaks Claude Code's API connection** — Norton intercepts and re-signs SSL certs → `CERTIFICATE_VERIFY_FAILED`. Fix: Norton → Settings → Firewall → Intrusion and Browser Protection → Safe Web → HTTPS Scanning → **Disable**. First thing to check on any SSL error.
2. **The same HTTPS scanning also killed the claude-mem worker** (separate incident, same root cause) — worker booted, cached startup files, died every ~2 min without processing a hook. Same fix.
3. **"AI Agent Protection" can block ALL direct file writes to the project folder** — every Edit/Write fails with "Blocked by Norton AI Agent Protection" while shell child-process file operations (PowerShell/Bash, git) still work, and scratchpad writes work. Fix: Norton → Security History → find the block events → Allow/Trust Claude Code, or exclude the project folder. Temporary workaround mid-task (with user approval): write to the scratchpad, `cp` into the project via shell.

## Package management

4. **pnpm ONLY.** `npm install` recreates `package-lock.json` and desyncs from `pnpm-lock.yaml` (which is what Vercel builds from) → `ERR_PNPM_OUTDATED_LOCKFILE` deploy failure. This actually happened (Sentry install, session 7). Full story in docs/DECISIONS.md.
5. **pnpm blocks install scripts by default** — new packages with postinstall scripts fail with `ERR_PNPM_IGNORED_BUILDS` and pnpm writes a placeholder line into `pnpm-workspace.yaml` (literally `set this to true or false`). Set the package to `true` under `allowBuilds` and re-run `pnpm install`. Current approvals: cypress, sharp, unrs-resolver, @sentry/cli.

## Vercel

6. **`vercel env pull` returns sensitive env values as EMPTY strings** (`VAR=""`). You cannot recover secrets through the CLI — read them in the Vercel dashboard or have the owner paste them. The pull also drops a `.env.local` containing whatever it DID get — delete it when done; it's gitignored but sits on disk.
7. **Every push to `master` deploys production immediately.** No staging. Run the Cypress suite before pushing; sequence schema-dependent changes as SQL-first-then-push.
8. **TypeScript errors fail the build** (since session 7). A failed deploy is now most often a type error — check the build log before suspecting infra.
9. **First `vercel` CLI use needs device-code login + `vercel link`** (project: cret0rs-projects/lawnmastersv5-website). The CLI added `.vercel` and `.env*` to .gitignore automatically once.

## Database / Supabase

10. **Roleless RLS policies apply to ALL roles including `anon`.** This caused a real customer-PII leak (001's policy had no `to` clause). Every new policy must say `to service_role` (or the deliberate `to anon` for form INSERTs). Pattern: scripts/005 and 006.
11. **Migrations are manual** — nothing runs them automatically. If a feature "mysteriously" fails soft (gallery empty, uploads erroring), first question: has its migration been run in the Supabase SQL Editor? Status: 005 (RLS fix) ✅ run and curl-verified closed (July 2026); 006 (gallery) ⚠️ still pending confirmation.
12. **`002_create_admin_user.sql` is dev-only** — hardcoded test password, seeds a Supabase Auth user the app doesn't even use. Never run in production.

## Testing

13. **Cypress needs the dev server already running** on localhost:3000 (`npm run dev` first). Otherwise all 45 tests fail with connection refused.
14. **The rate limiter counts requests BEFORE validation** — 3/IP/15min shared across BOTH forms. The suite budget is exactly 2 real submissions per run. New tests must use client-side `:invalid` assertions, never real submissions. The two submission tests accept "Too many requests" as a pass for repeated local runs.
15. **`next build` and `next dev` share `.next/`** — running a build while the dev server is up usually survives but can corrupt dev state; restart the dev server if pages act strange after a build.
16. **Dev-mode hydration recovery on /admin/login briefly disables the form** — React re-renders the server-action form shortly after load; typing during that window fails. The admin-auth spec waits 1.5 s for it. Dev-only noise; harmless in production.

## Frontend

17. **Announcement bar / nav stacking** — both are `fixed` at top (bar z-60, nav z-50). Historically the bar covered the nav's top half and the mobile hamburger. FIXED in session 9: the bar publishes its measured height as `--announcement-height`; the nav and mobile drawer offset from that variable. If you add another fixed top element, join that system — don't hardcode `top-0`.
18. **`images.unoptimized` is ON** — next/image emits no srcset. Hero images use pre-generated variants (scripts/generate-hero-images.mjs) + `<picture>`. Any new large hero must follow that pattern or it ships full-size to phones.
19. **Two globals.css files** — `app/globals.css` is live; `styles/globals.css` is a dead duplicate (deletion candidate).
20. **Logo files are owner-locked** (`public/logo-color.png`, `logo-contrast.png`, 1638×497). Never modify/resize/replace.
21. **The `/spring-rush` 308 redirect must stay** while old printed QR/ad links may circulate.
22. **`serverActions.bodySizeLimit` is 20mb** (next.config.mjs) — required for gallery photo uploads (two ~8 MB files per request). Default is 1 MB; removing this breaks uploads with an opaque error.

## claude-mem (memory plugin — machine-level, not project code)

23. **Requires the Bun runtime** (`bun:sqlite`). If missing: `winget install Oven-sh.Bun`. Without it every hook fails "worker unreachable."
24. **Auto-update can crash-loop the worker** — a version-mismatch recycle once failed leaving no worker (old kept respawning, detecting mismatch, dying). Fix: manual start against the current install: `bun <marketplace path>/worker-service.cjs start`, then verify `~/.claude-mem/worker.pid` and 2+ min of uptime.
25. **Known packaging bug:** every observation logs `SDK chroma sync failed ... Cannot find module '../sqlite/SessionStore.js'` — vector search sync is broken upstream (thedotmack/claude-mem); core capture/retrieval unaffected. Not fixable locally.
26. **The MCP search API can time out** (45 s) even when hooks are healthy — seen in session 9. Fall back to HANDOFF.md + git history for past-session knowledge.

## Auth / env

27. **All admin credentials fail closed** (`?? ""`). If login is suddenly impossible, check that `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`SESSION_TOKEN` are set in the environment you're running in — an unset var is indistinguishable from a wrong password by design.
28. **`SESSION_TOKEN` rotation** = update in Vercel (both environments) + redeploy. No code change; it's read in middleware.ts AND lib/admin-auth.ts but both read the env var.
29. **ESLint 9 flat config** — config is `eslint.config.mjs`. Creating any `.eslintrc.*` file breaks ESLint entirely.

## Marketing / off-site

30. **Two Google Business Profiles live under ONE Google account** (successblueprint90@gmail.com): the old **Orlando/Florida** profile and the current **Georgia/Covington** profile. Any link, post, or edit must be double-checked against the GEORGIA listing. This bit once: the site shipped with the Florida profile's `g.page` review link until July 2026 (old place ID `ChIJpypOOl24CU0RVvi0zWCb8C4`; corrected to `https://share.google/AM7DCDpim0yALiqCR` in `lib/reviews-data.ts` — do not revert). The fate of the Florida profile (mark closed vs keep) is an open owner decision — docs/ROADMAP.md.

## Forms / validation

31. **HTML `pattern` attributes compile with the regex `v` flag** — `(`, `)` and some punctuation inside character classes must be backslash-escaped or the browser SILENTLY IGNORES the entire pattern (no error shown; the validation just doesn't happen). Bit the quick-lead phone field once: `[\d\s()+.-]` dead, `[\d\s\(\)\+\.\-]` works. Always test that invalid input is actually BLOCKED, not just that the attribute exists.
