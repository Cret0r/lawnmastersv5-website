# SOP: Closing a Session

AGENTS.md rule: update HANDOFF.md at the end of every session before pushing.

1. Run **`/close-session`** (the slash command automates the whole procedure — definition in `.claude/commands/close-session.md`). It will:
   - Diff `git status` + commits since the last `[Session N]` HANDOFF entry
   - ALWAYS update HANDOFF.md (bump date/session, add DONE bullets from evidence, carry pending owner actions, fix stale sections)
   - Conditionally update ARCHITECTURE.md / AGENTS.md / SCRIPTS.md / README.md only if genuinely affected
   - Commit + push with a specific message
   - Report updated vs skipped docs with reasons
2. Verify its report mentions any pending owner actions (env vars, unrun migrations) — those must never fall out of HANDOFF.md until done.
3. If substantial /docs knowledge changed this session (decisions made, gotchas discovered, roadmap items shipped), update the relevant `/docs` file too — /close-session's checklist predates /docs; nudge it or do it manually.

Manual fallback (if the command is unavailable): follow the steps embedded in `.claude/commands/close-session.md` by hand.
