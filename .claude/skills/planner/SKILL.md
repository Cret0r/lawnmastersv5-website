---
name: planner
description: Break a request into a clear, executable plan for this project — ask the right clarifying questions first, surface the constraints that bite here, and produce steps a smaller model can follow without guessing. Use for any multi-step or ambiguous task.
---

# Planner — turn a request into a plan that survives contact with this project

## Step 1 — Understand before planning
Read the request twice. Then check, in order: AGENTS.md rules, docs/DECISIONS.md (is any part of this request re-litigating a settled decision? Say so instead of planning it), docs/ROADMAP.md (is this already scoped there? Use that context), HANDOFF.md latest session (what just changed?).

## Step 2 — Ask the RIGHT questions (before writing the plan)
Only ask what genuinely changes the plan — this owner usually pre-answers with "use your own judgment," which is real permission; take it and note your judgment calls in the report instead of asking. Questions worth asking here:
- Does this touch an owner-locked value (phone, cities, logos, pricing numbers, insured claims)? → needs explicit confirmation, not judgment.
- Does this need money, an account signup, or an off-site action (Vercel env var, Supabase SQL, GBP)? → split those out as owner actions; never block your own buildable work on them (build fail-soft instead — pattern: lib/notify.ts, lib/gallery.ts).
- Is there a number/price/copy claim only the owner can approve? → propose a default, flag it.

## Step 3 — Plan against THIS project's constraints
Every plan must account for:
- push to master = production deploy (sequence: SQL first → code → test → push)
- pnpm-only; TS errors fail the build; 45-test suite is the gate; max 2 real form submissions per suite run
- single-source-of-truth files (business-info, content modules) — plan edits at the right layer
- fail-soft for anything depending on unset env vars or unrun migrations
- update the affected docs (GOTCHAS/DECISIONS/ROADMAP/SOPs) as part of the plan, not as an afterthought

## Step 4 — Write the plan in this shape
1. **Goal** — one sentence, the user-visible outcome.
2. **Steps** — ordered, each naming the exact files touched and the pattern file to copy from.
3. **Verification** — how each step is proven (tsc, specific Cypress specs, curl checks, screenshot). "It compiles" is not verification.
4. **Owner actions** — clearly separated, with exact instructions (dashboard → where → what).
5. **Commit plan** — one commit per logical part, message drafted.
6. **Judgment calls made** — list them so the owner can veto.

## Step 5 — Sanity checks before presenting
- Would any step break the Cypress suite (~50 tests)? Which specs need updating alongside?
- Does anything in the plan contradict docs/DECISIONS.md or an AGENTS.md rule? Fix the plan, or explicitly call out that you're proposing to change a settled decision and why.
- Can each step be verified independently? If two steps can only be tested together, merge them.
