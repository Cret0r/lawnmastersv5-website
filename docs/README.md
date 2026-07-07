# /docs — Project Knowledge Base

> Written July 2026 (session 9) as the permanent knowledge-preservation pass. Root docs (AGENTS.md, ARCHITECTURE.md, HANDOFF.md, SCRIPTS.md, SUMMER_CAMPAIGN_2026.md) remain authoritative for what they cover; this folder extends them.

## Reading order for a cold start
1. `AGENTS.md` (root) — the rules. Read before touching anything.
2. `ARCHITECTURE.md` (root) — current technical reality (refreshed session 9).
3. `docs/BUSINESS_PLAYBOOK.md` — how the business actually works; pitch-ready.
4. `docs/GOTCHAS.md` — check here FIRST when anything behaves strangely.
5. `HANDOFF.md` (root) — session-by-session history + current to-dos.

## Contents
| File | What it holds |
|---|---|
| `BUSINESS_PLAYBOOK.md` | Services, pricing + reasoning, target customer, route-density model, guarantees, Starter Cut bonus, brand voice, bilingual angle |
| `DECISIONS.md` | Every significant decision + WHY. **Do not reverse these without owner sign-off** |
| `GOTCHAS.md` | Canonical consolidated gotcha list (Norton ×3, lockfile story, RLS leak lesson, claude-mem, z-index fix, …) |
| `GROWTH.md` | The 6-category growth analysis distilled: SEO, local marketing, paid-ads position, reviews/referrals, pricing, retention — with done/pending status |
| `ROADMAP.md` | Everything pending, with enough context to start any item cold |
| `TOOLING.md` | Scripts, slash commands, skills, claude-mem, environment requirements |
| `sops/` | Step-by-step procedures — one file per repeatable task |

## SOPs
deploying-changes · adding-a-dependency · database-migrations · hero-images · adding-a-city-page · updating-business-info · running-cypress · closing-a-session · failed-vercel-deploy · claude-mem-troubleshooting · gallery-migration

## Maintenance rule
When a session makes a decision → add it to DECISIONS.md. Hits a new failure mode → GOTCHAS.md. Ships/creates a pending item → ROADMAP.md. `/close-session` handles HANDOFF.md; these files are the layer above it.
