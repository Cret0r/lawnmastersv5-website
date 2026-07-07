# Tooling Guide

> The full tooling ecosystem: project scripts, slash commands, skills, the memory system, and environment requirements. For step-by-step procedures see docs/sops/.

---

## 1. Project scripts (`/scripts`)

Verified against the actual files; full per-script detail in SCRIPTS.md.

### SQL migrations (manual — Supabase Dashboard → SQL Editor)
| File | Purpose | Status |
|---|---|---|
| `001_create_submissions.sql` | quote_submissions table | ✅ run (its RLS superseded by 005) |
| `002_create_admin_user.sql` | dev-only Supabase Auth seed | ⛔ never run in production |
| `003_fix_admin_rls.sql` | authenticated-role policies | ✅ run (policies dropped by 005) |
| `004_create_contact_messages.sql` | contact_messages table | ✅ run |
| `005_fix_rls_scoping.sql` | SECURITY: service_role scoping | ✅ run + curl-verified (leak closed) |
| `006_create_gallery_items.sql` | gallery table + storage bucket | ⚠️ must run before gallery uploads |

### Node
- `generate-hero-images.mjs` — sharp; regenerates `public/hero/` responsive variants from the hero source images. Run from project root: `node scripts/generate-hero-images.mjs`. Use whenever a hero source image changes (SOP: hero-images.md).

### Shell (bash, from Git Bash)
- `development/quick-start.sh` — install deps + start dev server
- `development/dev-verify.sh` — PASS/FAIL preflight (node, env vars, key files); run after fresh clone
- `testing/verify-build.sh` — timed `next build` (TS errors now fail it)
- `monitoring/quick-health-check.sh` — curls live production pages for 200s (note: its page list still includes /spring-rush, which now 308s)
- `maintenance/code-quality.sh` — lint + `tsc --noEmit` combined
- `automation/documentation-generator.sh` — read-only doc-freshness reminder

## 2. Custom slash commands

- **`/close-session`** (`.claude/commands/close-session.md`) — end-of-session doc sync: diffs/commits since the last HANDOFF entry → updates HANDOFF.md (always) and ARCHITECTURE/AGENTS/SCRIPTS/README (only if actually affected) → commits & pushes → reports what changed and what was skipped. Run at the end of every working session (AGENTS.md rule).

### hormozi-skills (offer/marketing frameworks — use when doing business strategy, not code)
`/audit-offer` (find weak points in an offer) · `/pricing-strategy` (value-anchored pricing + tiers) · `/value-perception` (raise perceived value without cost) · `/objection-destroyer` (objection→belief-shift mapping) · `/bonus-stack` · `/offer-angles` · `/hormozi-offer` · `/hormozi-hooks` · `/hormozi-pitch` · `/landing-page-copy` · `/market-research` · `/business-model` · `/productize` (service→product, offer ladders, retention) · `/effort-reduction` · `/value-accelerator` · `/dfy-dwy-diy` · `/idea-to-product` · plus the `hormozi-orchestrator` agent for full offer builds.
**When:** pricing/packaging questions, campaign copy, review/referral systems. The session-9 growth analysis (docs/GROWTH.md) used pricing-strategy, value-perception, objection-destroyer, and productize — check it before re-running them on the same questions.

### claude-mem commands (memory system)
`/claude-mem:mem-search` (search past-session memory) · `/claude-mem:timeline-report` · `/claude-mem:standup` · `/claude-mem:learn-codebase` · `/claude-mem:smart-explore` · `/claude-mem:what-the` (debug the plugin) · others.
**When:** recovering context from sessions not in HANDOFF.md, or "when did we do X?" questions. Caveat: see § 4 reliability notes.

### Vercel plugin skills
`/vercel:status` (deployments overview) · `/vercel:env` · `/vercel:deploy` · knowledge skills (`/vercel:nextjs`, `/vercel:next-upgrade`, etc.). Useful for deploy debugging alongside docs/sops/failed-vercel-deploy.md.

## 3. Built-in Claude Code commands this workflow leans on

- `/clear` — wipe context between unrelated tasks; `/compact` — summarize a long session in place
- `/resume` — reattach a previous session
- `/model` — owner switches between Fable/Sonnet regularly mid-session
- `/config`, `/permissions` — harness settings
- `! <command>` prefix — owner runs a shell command directly in-session (used for interactive logins like `vercel login` when Claude can't)

## 4. claude-mem memory system (machine-level)

- **What:** thedotmack's claude-mem plugin — background Bun worker captures observations per tool-use into SQLite (+ Chroma vector store), injects context at session start.
- **Requirements:** Bun runtime (`~/.bun/bin/bun.exe`, installed via winget) and Norton HTTPS-scanning exception (see docs/GOTCHAS.md #1–3, #23–26).
- **Health check:** `~/.claude-mem/worker.pid` (PID/port/startedAt), `~/.claude-mem/state/hook-failures.json` (want consecutiveFailures 0), logs at `~/.claude-mem/logs/claude-mem-YYYY-MM-DD.log` (look for `[HOOK] → PostToolUse`, `[DB] STORED`).
- **Recovery:** docs/sops/claude-mem-troubleshooting.md.
- **Known limits:** chroma vector sync permanently errors (upstream packaging bug — non-fatal); the MCP search API can time out even when capture is healthy. HANDOFF.md + git history are the reliable fallback for past-session knowledge.

## 5. Environment & tooling requirements

| Requirement | Detail |
|---|---|
| **pnpm only** | `pnpm add <pkg>` for everything. Never `npm install` (recreates the deleted package-lock.json → deploy desync). Install-script approvals live in `pnpm-workspace.yaml` → `allowBuilds`. |
| Node | Runs Next 16 / React 19; node 24.x observed in use. `npm run <script>` is fine for RUNNING scripts — the pnpm rule is about dependency installation. |
| Bun | Only needed for claude-mem's worker, not the website. |
| Cypress | `npm run dev` FIRST (separate process), then `npm run cypress:run`. 45 tests. Suite budget: max 2 real form submissions/run (rate limiter). |
| Vercel CLI | `npx vercel` (device-code login, `vercel link` to cret0rs-projects/lawnmastersv5-website). Sensitive env values pull as EMPTY strings — dashboard is the source of truth for secrets. |
| Supabase | No CLI wired — migrations are copy-paste into the Dashboard SQL Editor. |
| OS | Windows 11 · PowerShell 5.1 primary (no `&&`; use `;` + `if ($?)`) · Git Bash available · Norton 360 present (three known interference modes — GOTCHAS #1–3). |
| Shell heredoc caveat | Large multi-line file writes through Bash can hit wrapper quoting issues with backticks — prefer Write/Edit tools, or scratchpad + `cp` fallback. |
