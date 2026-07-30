---
name: diy-harness
description: >
  Audit a site, app, or project, score harness readiness (0–1), list numbered
  tasks, then set up only what the human picks so coding agents stop reinventing
  layout, tokens, and ship rituals. Turn A = audit + score + task list (no
  setup). Turn B = chosen tasks only. Standalone by default; optional siblings
  may be suggested. Use when the user says "setup my harness", "DIY harness",
  "setup your own harness", "audit harness readiness", "make agent changes
  safer", or "stop reinventing tokens every session".
---

# DIY Harness

![DIY Harness loop](visual.png)

Help the human **set up a harness on their own project** — not a copy of [madhurimaram.com](https://madhurimaram.com).

**Pain:** Agents reinvent layout, tokens, and ship steps every session — or invent structure without looking at what already exists.

**Install once** in agent tooling; **run per project** when starting or re-auditing.

**Experiment:** Readiness score and bands are a starting point. Not a grade of the human or the brand.

**Opening line (Turn A):** “I’ll give you a readiness score and a short task list to pick from. Nothing installs until you choose.”

## Usage

```
/diy-harness
```

Or: “setup my harness”, “audit harness readiness”, “DIY harness”.

## When to use

- Starting agentic work on a personal site, portfolio, marketing site, or app
- Layout, tokens, or ship steps keep drifting across sessions
- The project is messy *or* already organized (do not rebuild Organized projects)

## When not to use

- They only want a one-off page tweak with no harness interest
- They ask you to copy madhurimaram.com folder names onto their project
- A full redesign / greenfield product build (wrong skill)

## Pace (how long this takes)

| Turn | Scope | Stop when |
| --- | --- | --- |
| **A** | Explore → write audit file → **short chat report** (score → numbered tasks → stop) | Human has not picked tasks yet. **No Setup.** |
| **B** | Only chosen tasks → verify → stop | Chosen gaps done + verified |
| **Weekly** | Separate invoke later | Drift report awaiting approval |

First reply is usually one working session for audit + plan. Setup is a second pass. Large repos take longer; CMS / Carrd is shorter. No fake wall-clock SLA.

## Chat report (Turn A — required shape)

```
1) Readiness: 0.XX — Scattered | Forming | Organized
   One sentence why.

2) Tasks (pick what to do next):
   [1] …
   [2] …
   [3] …
   [N] All of the above

3) Stop. Wait for numbers or All.
```

Hard rules for chat:

- Score first → numbered tasks → last option **All of the above** → **STOP**
- Detail lives in the **audit file**, not the chat
- Never dump a full tree or long essay into the reply

## Phase checklist (required every reply)

End every reply with:

```
Phase: Audit | Score | Plan | Setup | Weekly
Done: …
Blocked: …
```

Mark boxes honestly. Skipping a phase = stop and go back.

## Hard stops

- **No Setup** before the human picks task numbers (or **All of the above**)
- **No** inventing folders/contracts before the audit file exists
- **No** deleting existing work
- **No** inventing `.env`, API keys, or deploy tokens
- If you started Setup in Turn A: stop, re-emit score + task list, wait

## Tokens and models

**This skill does not route models.** The host (Cursor / Claude Code / ChatGPT) picks the model.

| Turn | Option | Why |
| --- | --- | --- |
| A | Capable agentic model with repo/tools | Needs exploration judgment |
| B | Same model, or one tier lighter if the host allows | Scope is locked |
| Weekly | Capable enough to re-read audit + light Proof | Shorter than Turn A |
| Avoid for Turn A | Tiny / chat-only / no-tools models | High skip + hallucination risk |

Optional tip (never block): “If your tool has a model picker: use a capable agentic model for Turn A; Turn B can stay or drop one tier once tasks are chosen.”

What burns tokens: wide crawls, dumping trees into chat, Setup in the same turn as Audit, long essays.

How we keep cost down: short report; audit file; pick tasks; Turn B scoped; light Proof bar. “All of the above” costs more on purpose.

## Operating posture

- **Standalone by default** — full Audit → Weekly with zero sibling skills
- **Look first** — never invent before the audit doc exists
- **Gaps only** — skip what is solid; never delete
- **Combine / align** existing harness-like pieces — do not rebuild a parallel system
- **Siblings optional** — use if installed; may suggest adding one in the task list; never require; never refuse; never auto-install
- **Approve before write** — nothing installs until they pick tasks

## Light Proof bar (standalone)

When `design-lint` is not installed, verify with a short bar only:

1. Chosen files exist and paths match the plan
2. No obvious token/spacing invent outside what the project already uses
3. No secrets created
4. Say what still needs a human eye

Do **not** clone a full CHECKS.md suite here.

## Huge-repo dial (bounded explore)

If many packages, `apps/`+`packages/`, 10k+ files, or explore is already slow:

1. Say one plain line: “Large repo — I’ll sample for harness signals, not crawl everything.”
2. Prefer roots that map to harness parts: `content/`, `docs/`, tokens/styles/design-system, `scripts`/`package.json`, `.github/workflows`, lint/config, deploy configs
3. Per harness part: 1–3 strong signals → Present / Partial / Missing. Unclear → Partial + “needs a closer look”
4. Monorepos: ask once (or infer) which app/package is in scope; don’t audit every package in Turn A
5. Chat stays tiny; evidence goes in the audit file
6. Readiness note when sampled: “Based on a sample of … — not a full-repo scan.”
7. “All of the above” on a huge repo: warn once before starting Turn B

**When it goes wrong:** Spent the turn listing thousands of files → stop, write audit from what you have, emit short score + tasks.

## Instructions for the agent

### 1. Audit first — write a doc

Explore the **project** (repo, CMS, Carrd, or mixed). Real sources of truth only.

Write or update:

- `docs/harness-audit.md`, or
- `notes/harness-audit-YYYY-MM-DD.md` if `docs/` is not appropriate

Must include:

1. **Inventory** — surfaces, tokens/CSS, content/CMS, deploy path, checks/docs
2. **Existing harness-like pieces** — what already maps to Source / Bake / Proof / Shared system / Ship (even if names differ)
3. Per harness part: **Present / Partial / Missing** (credit semblances; don’t mark Missing when a piece exists)
4. **Harness readiness** `0.0–1.0` + short evidence
5. Sample confidence note when the repo was treated as large
6. Gaps only (feeds the numbered task list)

**Sample audit shape** (adapt; do not invent paths):

```md
# Harness audit — [project] — [YYYY-MM-DD]

## Inventory
- Surfaces: …
- Editable source: …
- Deploy / publish: …
- Existing checks or docs: …

## Existing harness-like pieces
- … → maps to Source / Bake / Proof / Shared / Ship

## Harness parts
| Part | Status | Evidence |
| --- | --- | --- |
| Prior map / audit | Present / Partial / Missing | … |
| Source | … | … |
| Bake | … | … |
| Proof | … | … |
| Shared system | … | … |
| Ship | … | … |

## Readiness
Score: 0.XX — Scattered | Forming | Organized
Evidence: …
Confidence: full look | sample of …

## Gaps only (next)
- …
```

### 2. Score harness readiness (0–1)

**Label:** Harness readiness (short: Readiness).

Six equal weights (~0.167 each). Partial = half credit:

| Harness part | Present means roughly… |
| --- | --- |
| Prior map / audit | An inventory or system map already exists (this run creates/updates it) |
| Source | Clear editable truth (content/, CMS, tokens — not only live HTML) |
| Bake | Sync/build that compiles source → live |
| Proof | Lint/audits/gates that can fail ship |
| Shared system | Written contracts agents + humans share |
| Ship | One clear checked publish path |

**First-run rule:** Prior map created *this turn* is at most **Partial**, never Present.

| Score | Label | What you do |
| --- | --- | --- |
| 0.00–0.33 | Scattered | Foundations first (Source + light Shared system); short task list |
| 0.34–0.66 | Forming | Fill Proof + Bake + Ship gaps; tighten contracts |
| 0.67–1.00 | Organized | **Do not rebuild.** Weekly drift + thin gaps only |

### 3. Build the numbered task list (Plan)

Only **Missing** / **Partial** become tasks. Skip solid parts.

**Plan default = Combine / align:** reuse existing paths and names; fill true gaps; short merge map (existing X → harness part Y). Rebuild only if the human explicitly asks.

If two overlapping systems exist, list both and recommend one survivor — human chooses before Setup.

Optional sibling line (at most one per relevant gap, in the task list only):

> If you want deeper Proof later, you could add `design-lint` from iruhdam1/skills.

Same pattern for `bake-the-brief` / `responsive-preview` when relevant. Never block if they decline.

Last task is always **All of the above**.

Optional once after they pick (not a second score): how hands-on — Human-led / Shared / Agent-led. Changes approval frequency only, not which folders install.

### 4. Turn B — Setup chosen tasks only

After they reply with numbers or **All**:

- Do **only** those tasks
- CMS / Carrd / no git → lightweight docs + checklists, not fake `scripts/` folders
- Never delete; never copy madhurimaram.com names blindly
- If a sibling is installed and a chosen task needs it, prefer the sibling
- Warn once before **All** on a huge repo

### 5. Verify (after Setup)

Run the light Proof bar (or point to `design-lint` if installed). Summarize what landed and what still needs human review. Stop.

### 6. Weekly check-in (later invoke)

Observation ≠ silent edits. Drift report + **ask approval** before fixes.

Propose (do not require hosted infra):

1. Scheduled check-in template (Action YAML or calendar) → `docs/harness-drift.md` with **Awaiting approval**
2. Ship-time same contracts when they have CI
3. Session start: read latest audit + open drift

Never silent-merge.

## When it goes wrong

| Failure | Recovery |
| --- | --- |
| Skipped Audit / Plan / started Setup early | Stop. Re-emit score + task list. Wait. |
| Essay or full tree in chat | Move detail to audit file; re-emit short report |
| Built a parallel harness next to working sync/lint | Stop. Re-audit. Propose combine/align |
| Refused because siblings missing | Wrong. Continue standalone; optional suggest only |
| Invented secrets or fake script folders for Carrd | Delete the invented bits; propose lightweight docs |

## Feedback

If something is wrong or unclear: https://github.com/iruhdam1/skills/issues

Mention once at the end of a successful plan or setup — not every turn.

---

Companion: [madhurimaram.com/harness](https://madhurimaram.com/harness#harness-setup). Siblings (optional): [design-lint](https://github.com/iruhdam1/skills/tree/main/skills/design-lint), [bake-the-brief](https://github.com/iruhdam1/skills/tree/main/skills/bake-the-brief), [responsive-preview](https://github.com/iruhdam1/skills/tree/main/skills/responsive-preview).
