# SOP: Running / Adding Database Migrations + Verifying RLS

Migrations are MANUAL — nothing applies them automatically.

## Running an existing migration
1. Supabase Dashboard → SQL Editor → New Query.
2. Paste the full contents of `scripts/00X_*.sql`; Run.
3. Run the verification query at the bottom of the file (005/006 include one).
4. For RLS changes, verify from outside:
   ```
   curl "https://<project>.supabase.co/rest/v1/<table>?select=*" -H "apikey: <ANON_KEY>"
   ```
   Expected: `[]` or a permission error. **Rows returned = the table is leaking.**
   (Anon key is visible in Vercel dashboard / the browser bundle — it's public by design.)

## Writing a new migration
1. Next number: `scripts/007_....sql`. Idempotent where possible (`create table if not exists`, `drop policy if exists` before create).
2. **RLS rules (non-negotiable — a roleless policy caused a real PII leak):**
   - `alter table ... enable row level security`
   - Every policy MUST have an explicit `to` clause: `to service_role` for app access; `to anon` ONLY for deliberate public form INSERTs.
   - Never create `to authenticated` policies — the app doesn't use Supabase Auth (docs/DECISIONS.md).
3. Include a commented VERIFY query at the bottom (`select * from pg_policies where tablename = '...'`).
4. Update SCRIPTS.md (table + section) and, if the app reads the new table, make the code fail soft when the migration hasn't run (pattern: `lib/gallery.ts`).
5. Sequence: run SQL in production → then push the code that uses it.

Current status ledger lives in docs/TOOLING.md § 1.
