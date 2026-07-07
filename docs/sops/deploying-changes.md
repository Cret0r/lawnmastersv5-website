# SOP: Deploying Changes

Every push to `master` deploys production via Vercel. There is no staging.

1. Make changes; run `npx tsc --noEmit` (type errors now FAIL the build).
2. Start the dev server if not running: `npm run dev` (background/separate terminal).
3. Run the full suite: `npm run cypress:run` — **all 45 must pass** (AGENTS.md rule).
4. If the change depends on a DB migration: **run the SQL in Supabase FIRST** (sops/database-migrations.md), then push. Code that fails soft (gallery pattern) can ship in either order.
5. Commit with a clear message ending in the `Co-Authored-By: Claude` trailer; `git push origin master`.
6. Confirm the deploy went green: Vercel dashboard, or `/vercel:status`. If red → sops/failed-vercel-deploy.md.
7. End of session: run `/close-session` to sync docs.

Notes: reversible content-only changes still deploy to production instantly — there is no "just committing." Sensitive values never go in code; they live in Vercel env vars.
