# diy-harness — Eval checklist (maintainers)

Manual rubric + fixture shapes. Run before calling the skill “ready.”

**Not** pasted by Copy skill on `/harness`. Lives next to `public-skill.md` for maintainers; ships to `skills/diy-harness/EVALS.md` when publishing the pack.

**Publish gate:** do not publish to [iruhdam1/skills](https://github.com/iruhdam1/skills) until all 4 fixtures pass once on a capable agentic model (12/12 on each Turn A, plus choice-respect spot-check).

## Fixture shapes (run Turn A on each)

| Fixture | Intent |
| --- | --- |
| Tiny static site | Happy path; short score + tasks |
| No-git / CMS-like notes only | No fake `scripts/` folders |
| Already has lint + sync + tokens | Combine/align; no parallel harness |
| Fake “huge” monorepo (many empty packages) | Bounded explore; no tree dump in chat; optional package scope |

How to stub fixtures:

1. **Tiny static** — one `index.html`, a CSS file, maybe a README. No sync scripts.
2. **No-git / CMS** — a folder of notes or Carrd export notes; no `.git`, no `package.json` scripts.
3. **Has pieces** — token CSS, a sync script, a lint script or CI workflow, a short docs contract. Should score Partial/Present on several parts.
4. **Huge monorepo** — `apps/a`, `apps/b`, `packages/x`… with empty or tiny stubs. Enough folders that a naive tree dump would be long.

## Pass/fail rubric (every Turn A)

| # | Eval | Pass |
| --- | --- | --- |
| 1 | Report shape | Score first → numbered tasks → last option All of the above → STOP |
| 2 | No Setup early | Zero new harness folders/files beyond audit doc before human picks tasks |
| 3 | Chat budget | Reply is skim-short; no full tree / essay; detail in audit file |
| 4 | Standalone | Completes without design-lint / bake-the-brief / responsive-preview installed |
| 5 | Combine default | On “already has pieces” fixture: plan says combine/align, not rebuild |
| 6 | Prior-map score | First-run audit ≠ Present for prior map (Partial ok) |
| 7 | Secrets | No invented `.env` / API keys / deploy tokens |
| 8 | Choice respect | After human picks `1`, Turn B only does task 1 (spot-check once) |
| 9 | Sibling suggest | Missing sibling: at most one optional suggest in tasks; never blocks |
| 10 | Skip recovery | If agent starts Setup in Turn A → fail; correct behavior is re-emit score + tasks |
| 11 | Huge-repo dial | On monorepo fixture: states sampling / asks package scope; chat has no massive listing |
| 12 | Phase checklist | End of reply includes phase/done/blocked lines |

## Out of eval scope (for now)

- Exact token counts / dollar cost
- Cross-host model router tests
- Full design-lint CHECKS parity
- Publishing to iruhdam1/skills (separate gate after evals pass)

## Who runs evals

| Gate | Who | Bar |
| --- | --- | --- |
| Before **push to live** (Copy skill update on the website) | Agent or Madhuri | Rubric against prompt text + one real dry-run if time |
| Before **publish to skills** | Agent or Madhuri | All 4 fixtures once; fix prompt until 12/12 |

## Dry-run log (fill when run)

| Date | Fixture | Model / host | Score | 12/12? | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-07-30 | Prompt-text review | — | — | 12/12 | Static check of `public-skill.md` against rubric. Fixture dry-runs still required before skills publish. |
| | Tiny static | | | | |
| | No-git / CMS | | | | |
| | Already has pieces | | | | |
| | Huge monorepo | | | | |
| | Choice respect (Turn B) | | | | |
