# SCRIPTS.md — Lawn Masters V5 Scripts Reference

---

## Database Migrations (Supabase SQL)

Run these in order in the **Supabase Dashboard → SQL Editor → New Query**. They are idempotent where noted.

| # | File | Purpose |
|---|------|---------|
| 1 | `scripts/001_create_submissions.sql` | Creates `quote_submissions` table |
| 2 | `scripts/002_create_admin_user.sql` | Seeds a test admin user |
| 3 | `scripts/003_fix_admin_rls.sql` | Adds authenticated-user RLS policies |
| 4 | `scripts/004_create_contact_messages.sql` | Creates `contact_messages` table |
| 5 | `scripts/005_fix_rls_scoping.sql` | **SECURITY FIX** — scopes RLS to service_role, closes anon-key data leak |

---

### `scripts/001_create_submissions.sql`

Creates the `quote_submissions` table that stores all quote form submissions from the website.

**How to run:** Paste into Supabase SQL Editor and execute.

**Gotchas:**
- Uses `CREATE TABLE IF NOT EXISTS` — safe to re-run.
- Enables RLS with two policies: anonymous inserts (public form) and service role full access (admin dashboard).

---

### `scripts/002_create_admin_user.sql`

Seeds a test admin user (`admin@test.com` / `test123456`) directly into `auth.users` for local development.

**How to run:** Paste into Supabase SQL Editor and execute.

**Gotchas:**
- **Development only — do not run against production.** Uses a hardcoded test password.
- Checks for existence before inserting — safe to re-run.
- Production admin credentials are set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars, not Supabase Auth.

---

### `scripts/003_fix_admin_rls.sql`

Adds RLS policies to `quote_submissions` so authenticated users can SELECT, UPDATE, and DELETE rows (required for the admin dashboard).

**How to run:** Paste into Supabase SQL Editor and execute.

**Gotchas:**
- Run **after** `001_create_submissions.sql`.
- Will error if the policies already exist — check the Supabase policies panel first if re-running.

---

### `scripts/004_create_contact_messages.sql`

Creates the `contact_messages` table that stores all `/contact` form submissions.

**How to run:** Paste into Supabase SQL Editor and execute.

**Gotchas:**
- Uses `CREATE TABLE IF NOT EXISTS` — safe to re-run.
- Enables RLS with policies for: anon insert, service role full access, and authenticated select/update/delete.

---

### `scripts/005_fix_rls_scoping.sql`

**Security fix (session 6 audit).** The policy from `001` had no `to` clause, so it applied to ALL roles — anyone with the public anon key could read/update/delete every lead. This script scopes `quote_submissions` to `service_role` (keeping anon INSERT so forms work), drops the dead `authenticated` policies from `003`, and defensively locks the `clients` table to `service_role` only.

**How to run:** Paste into Supabase SQL Editor and execute, then run the `pg_policies` verification query at the bottom of the file.

**Gotchas:**
- Uses `drop policy if exists` throughout — safe to re-run.
- The app is unaffected (all reads/writes use the service-role key), but **until this runs, the database leak is open** — verify it has been run in production.
- Supersedes the RLS parts of `001` and `003`.

---

## Assets

### `scripts/generate-hero-images.mjs`

Generates responsive hero background variants (mobile 828×1104, tablet 1536×1152, desktop 1920×1080) into `public/hero/` from the source images in `public/`. Needed because `images.unoptimized` disables Next.js srcset generation — the heroes serve these via `<picture>` art direction.

**How to run:**
```bash
node scripts/generate-hero-images.mjs
```

**Dependencies:** `sharp` (available as a transitive dependency of Next.js).

**Gotchas:**
- Re-run whenever a hero source image (`hero-bg.jpg`, `hero-landscaping-lush-garden.jpg`) is replaced, and commit the regenerated files in `public/hero/`.
- Quality is set to 72 (mozjpeg) with `attention` cropping — tweak in the script if a crop looks off.

---

## Development

### `scripts/development/quick-start.sh`

Installs npm dependencies and starts the Next.js dev server at `http://localhost:3000`.

**How to run:**
```bash
bash scripts/development/quick-start.sh
```

**Required env vars:** `.env.local` with all five vars (site loads without it, but forms and admin won't work):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

**Gotchas:** Warns if `.env.local` is missing but does not abort.

---

### `scripts/development/dev-verify.sh`

Checks that all prerequisites for local development are in place and reports PASS/FAIL for each.

**How to run:**
```bash
bash scripts/development/dev-verify.sh
```

**What it checks:** Node.js, npm, `node_modules`, `package.json`, `.env.local`, all five env vars, `next.config.mjs`, `lib/spring-rush-content.ts`, `lib/reviews-data.ts`, and current git branch.

**Gotchas:** Exits with code 1 if any check fails — run this before `quick-start.sh` when onboarding or after a fresh clone.

---

## Testing

### `scripts/testing/verify-build.sh`

Runs `npm run build` and reports success or failure with elapsed time.

**How to run:**
```bash
bash scripts/testing/verify-build.sh
```

**Gotchas:**
- Takes 1–2 minutes.
- Warns if `.env.local` is missing (build may succeed but runtime features will break).
- TypeScript errors FAIL the build (`ignoreBuildErrors` was removed in session 7).

---

## Monitoring

### `scripts/monitoring/quick-health-check.sh`

Pings `lawnmastersv5.com` and checks that the homepage and all key pages return HTTP 200.

**How to run:**
```bash
bash scripts/monitoring/quick-health-check.sh
```

**Dependencies:** `curl` must be installed.

**Pages checked:** `/`, `/services`, `/contact`, `/quote`, `/gallery`, `/spring-rush`

**Gotchas:** Hits the live production URL — not for use against localhost.

---

## Maintenance

### `scripts/maintenance/code-quality.sh`

Runs ESLint (`npm run lint`) and TypeScript type-check (`npx tsc --noEmit`) and reports combined results.

**How to run:**
```bash
bash scripts/maintenance/code-quality.sh
```

**Gotchas:**
- Exits with code 1 if either check fails.
- Since session 7 the production build also enforces TS errors (`ignoreBuildErrors` removed) — this script catches them earlier, before a failed deploy.

---

## Automation / Documentation

### `scripts/automation/documentation-generator.sh`

Checks that `ARCHITECTURE.md` and `AGENTS.md` exist, shows their last-modified dates, and prints a checklist of conditions that require updating them.

**How to run:**
```bash
bash scripts/automation/documentation-generator.sh
```

**Gotchas:**
- Does not modify any files — read-only.
- Exits with code 1 if either documentation file is missing.
- Run after any structural change (new route, new env var, new component, schema change, etc.) as a reminder prompt.

---

## npm Scripts (package.json)

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `next dev` | Start local dev server at `localhost:3000` |
| `npm run build` | `next build` | Build for production |
| `npm run start` | `next start` | Serve the production build locally |
| `npm run lint` | `eslint .` | Run ESLint across the project |
| `npm run cypress:open` | `cypress open` | Open Cypress Test Runner UI |
| `npm run cypress:run` | `cypress run` | Run all 26 Cypress e2e tests headlessly (required before merging to master) |
