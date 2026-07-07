# SOP: Adding a Dependency (pnpm-only)

1. `pnpm add <pkg>` (or `pnpm add -D <pkg>`). **Never `npm install`** — it recreates the deleted `package-lock.json` and desyncs from the lockfile Vercel builds with (this broke a production deploy once — docs/DECISIONS.md).
2. If pnpm exits with `ERR_PNPM_IGNORED_BUILDS`: the package has an install script. Open `pnpm-workspace.yaml`, find the placeholder line pnpm wrote (`'<pkg>': set this to true or false`), set it to `true` (or `false` if the script is unneeded), re-run `pnpm install`, confirm exit 0.
3. Verify `pnpm-lock.yaml` changed and includes the package: `git diff --stat pnpm-lock.yaml`.
4. Typecheck + Cypress suite as usual.
5. Commit `package.json` + `pnpm-lock.yaml` (+ `pnpm-workspace.yaml` if touched) together.

If a stray `package-lock.json` ever appears: delete it, don't commit it.
