# SOP: Recovering From a Failed Vercel Deploy

Every push to master deploys; a red deploy means production kept the previous build (Vercel serves last-good), so you have time — diagnose, don't panic-revert.

## Diagnose in this order
1. **Read the build log** (Vercel dashboard → failed deployment, or `/vercel:status`). Match the error:
2. **TypeScript error** — most likely since enforcement was enabled. Reproduce locally: `npx tsc --noEmit`. Fix, test, push.
3. **`ERR_PNPM_OUTDATED_LOCKFILE`** — lockfile desync (someone ran npm install, or edited package.json by hand). Fix: `pnpm install` (regenerates lockfile), verify the dependency is in `pnpm-lock.yaml`, delete any stray `package-lock.json`, run Cypress, commit lockfile, push. (This exact failure happened in session 7 — docs/DECISIONS.md.)
4. **`ERR_PNPM_IGNORED_BUILDS`** — new package's install script unapproved. Add it under `allowBuilds` in `pnpm-workspace.yaml`, `pnpm install`, commit both.
5. **Missing env var at build** — check Vercel → Settings → Environment Variables (Production AND Preview). Remember: `vercel env pull` shows sensitive values as empty; use the dashboard.
6. **Runtime (not build) failure after green deploy** — check Sentry (if DSN live) and Vercel function logs; suspect an unrun DB migration first (GOTCHAS #11).

## If production is actively broken and the fix isn't quick
- Vercel dashboard → Deployments → previous good deployment → "Promote to Production" (instant rollback), or `git revert <bad-commit> && git push` for a tracked rollback.
- Never force-push master.

## Afterward
Add the failure mode to docs/GOTCHAS.md if it's new, and note it in HANDOFF via /close-session.
