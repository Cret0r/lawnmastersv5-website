---
description: End-of-session doc sync — update HANDOFF.md (always) and other docs (only if affected), then commit and push
---

Close out this working session by syncing the project docs to what actually changed, then committing and pushing. Work from evidence (diffs/commits), not memory alone, and never ask the user to describe what happened.

## Step 1 — Discover what changed this session

- Run `git status` and `git diff` to see uncommitted work.
- Find the last session entry in HANDOFF.md (the highest `[Session N]` number and the "Last updated" date), then run `git log --oneline --stat <last-handoff-commit>..HEAD` — or `git log --oneline --stat --since="<last updated date>"` — to list everything committed since the docs were last synced.
- Build a factual list of changes: files added/removed/modified, features built, fixes applied, dependencies changed, config changed, scripts changed.

## Step 2 — ALWAYS update HANDOFF.md

- Bump the `> Last updated:` line to today's date with the next session number.
- Add `**[Session N]**` bullets under the DONE section summarizing each meaningful change, pulled from the diff/commits. Include any pending owner actions (env vars to set, migrations to run) so they don't get lost.
- Update any HANDOFF sections the changes made stale: the routes table, To-Do/IN PROGRESS items now done, the scripts list, gotchas that are now wrong, file-structure entries for files added/deleted.

## Step 3 — CONDITIONALLY update other docs (skip any that aren't affected)

Check each against the change list — update only on a real match, and don't touch a doc just to touch it:

- **ARCHITECTURE.md** — only if system design actually changed: new/removed database table, new major feature or page, new external integration/service, auth or data-flow change, dependency stack change.
- **AGENTS.md** — only if a workflow rule, convention, or required step changed: tooling switch (e.g. package manager), new "always do"/"never do" rule, a canonical-location list that moved, new env var the agent must know about.
- **SCRIPTS.md** — only if anything in `/scripts` was added, removed, or modified.
- **README.md** — only if setup/install/run instructions themselves changed (new env var required to boot, changed install command, new prerequisite).

## Step 4 — Commit and push

```
git add .
git commit -m "session close: update docs"
```

Prefer replacing the generic message with a specific one describing what was updated and why (e.g. `session close: document X, update gotcha Y`). Then `git push`.

## Step 5 — Report

Tell the user:
- Which docs were updated and what was added/changed in each.
- Which docs were left alone and the one-line reason why (e.g. "ARCHITECTURE.md — no schema or design changes this session").
- The commit hash and confirmation the push succeeded (note it triggers a Vercel deploy).
- Any pending owner actions carried into HANDOFF.md.
