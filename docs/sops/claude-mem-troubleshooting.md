# SOP: claude-mem Troubleshooting (Norton, Bun, worker recovery)

The claude-mem memory plugin runs a background Bun worker on this machine. Three historical failure modes, all solved before — check in this order.

## 0. Quick health check
- `~/.claude-mem/worker.pid` exists? (contains PID, port — historically 37777 — and startedAt)
- `~/.claude-mem/state/hook-failures.json` → want `consecutiveFailures: 0`
- Tail `~/.claude-mem/logs/claude-mem-<today>.log` → healthy = `[HOOK] → PostToolUse`, `[QUEUE] ENQUEUED`, `[DB] STORED | obsIds=[...]`

## 1. Bun missing (worker can never start; every hook "worker unreachable")
- `bun --version` — if not found: `winget install Oven-sh.Bun` (or `irm bun.sh/install.ps1 | iex`), restart terminal. Expected location: `~/.bun/bin/bun.exe`.

## 2. Norton HTTPS scanning (worker boots, caches 3 startup files, dies ~every 2 min)
- The boot-and-die pattern = startup crash on outbound SSL, not hook failure. Fix: Norton → Settings → Firewall → Intrusion and Browser Protection → Safe Web → HTTPS Scanning → Disable. (Same fix as Claude Code's own `CERTIFICATE_VERIFY_FAILED`.)

## 3. Auto-update crash-loop (version mismatch recycle failed)
- Symptom: log shows version-mismatch recycle, new worker spawn returned `{"pid":0}`, old version keeps respawning/dying.
- Fix: manual start against the CURRENT install:
  ```
  cd <marketplace plugin path>   # ~/.claude/plugins/marketplaces/... claude-mem current version
  bun worker-service.cjs start   # expect {"status":"ready"}
  ```
- Verify: worker.pid recreated, survives 2+ minutes, hooks logging again. No rollback/reinstall has ever been needed — the newer version runs fine once started manually.

## Known non-fatal noise (do not chase)
- `SDK chroma sync failed ... Cannot find module '../sqlite/SessionStore.js'` on every observation — upstream packaging bug (thedotmack/claude-mem), vector search only; capture/retrieval unaffected.
- MCP search calls can time out (45 s) while capture is healthy — use HANDOFF.md + git history as fallback for past-session knowledge.

Full incident history: HANDOFF.md gotcha #14, docs/GOTCHAS.md #23–26.
