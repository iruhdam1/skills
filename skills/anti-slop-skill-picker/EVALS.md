# anti-slop-skill-picker · Eval checklist (maintainers)

Manual rubric plus fixture shapes. Run before calling a prompt or catalog change ready.

## How to run

```bash
node --test skills/anti-slop-skill-picker/scripts/detect.test.mjs   # detector unit tests (11 cases, fixtures built in a temp dir)
node skills/anti-slop-skill-picker/scripts/check-catalog.mjs       # every GitHub repo and npm package in CATALOG.md still resolves
grep -rn "—" skills/anti-slop-skill-picker                          # no em dashes anywhere in the skill
```

Then the live evals: run the skill on each fixture below with a fresh agent, save the reply, and score it against the rubric row by row.

## Fixtures (run the skill once on each)

| Fixture | Shape | Expected mix |
|---|---|---|
| Next.js landing page | `app/`, `components/ui/*.tsx`, `tailwind.config.ts`, `package.json` with next, react, tailwindcss | UI primary; nothing else present |
| Markdown posts | `content/posts/*.md` (6+ files), a README, no `package.json` | Text primary; nothing else present |
| Reel harness | `marketing/reel/reel.html`, `render.mjs` calling ffmpeg, `package.json` with playwright and gsap | Video primary; UI absent (one HTML file is under the threshold) |
| Notebook with charts | `analysis.ipynb` importing matplotlib, `data/*.csv`, `requirements.txt` with plotly | Charts primary; nothing else present |
| Empty folder | nothing, or a lone README | No medium present; the skill asks which medium |
| Mixed site (the website repo) | the real thing | UI primary; Text and Video secondary |
| Request wins (variant) | the Next.js fixture plus "write the launch post" | Text picks first; UI picks as a footnote |
| Stand out (variant) | the notebook fixture plus "I want them to stand out" | a craft pick among the chart picks |

How to stub: create each folder under a scratch directory with the files named above. Stub contents can be one line; the detector counts files and dependency names, and reads markdown for ```` ```mermaid ```` blocks and scripts for image-generation keywords.

## Pass/fail rubric (every run)

| # | Eval | Pass |
|---|---|---|
| 1 | Detector first | The reply shows the detector's mix (or says it could not run) before any pick |
| 2 | Request wins | On the Next.js fixture with the request "write the launch post", Text picks come first and UI is one line |
| 3 | Report shape | Detected line → picks table → Start with → Install all picks block → the three next-step offers → stop |
| 4 | No installs | Zero commands run, zero files written, until the user picks a next step |
| 5 | Cap respected | At most 3 picks for the primary medium, 2 per secondary, 0 for absent media |
| 6 | Evidence per pick | Every "Why for this repo" names a file, folder or package from the detector output |
| 7 | Form named | Every pick says skill, CLI, MCP, plugin, prompt, reference or Grok bot |
| 8 | Catalog only | Every pick is a row in CATALOG.md, with its install line copied verbatim |
| 9 | Empty repo asks | On the empty fixture the reply asks for the medium and makes no picks |
| 10 | Craft when standing out | If the request says "stand out", "distinctive" or "memorable", the primary medium includes a craft pick |
| 11 | Never itself | anti-slop-skill-picker is never in the picks |
| 12 | Clean copy | No em dashes, no exclamation marks, no "not just X, it's Y" in the reply |

## Out of eval scope (for now)

- Whether the recommended resource improves the user's output. That is the resource's job.
- Install success on every host. The picker copies lines; the catalog's verified date says when they last worked.

## Who runs evals

| Gate | Who | Bar |
|---|---|---|
| Before a catalog change | Agent or Madhuri | Re-verify the changed rows (repo, install line, stars or installs); update the date |
| Before a material prompt change | Agent or Madhuri | All six fixtures once; fix the prompt until 12/12 |

## Dry-run log (fill when run)

| Date | Fixture | Model / host | 12/12? | Notes |
|---|---|---|---|---|
| 2026-10-17 | Next.js app | Claude Fable 5.1, Claude Code subagent | 12/12 | UI primary; Kill AI Slop, hallmark, fluid-functionalism (React detected); nothing installed |
| 2026-10-17 | Markdown posts | same | 12/12 | first run put a "(no craft pick)" placeholder row in the table and mentioned a Dropped-list entry; SKILL.md now says to note a missing row type under the table and never offer a Dropped row; the re-run is clean |
| 2026-10-17 | Reel harness | same | 12/12 | Video primary from `gsap` + ffmpeg; one HTML file stays under the threshold, as expected |
| 2026-10-17 | Notebook with charts | same | 12/12 | Charts primary; tufte-data-viz, Frontiers prompt (marked "no install"), lieflat-charts |
| 2026-10-17 | Empty folder | same | 12/12 | no picks, asks which medium with the six options |
| 2026-10-17 | Mixed site (website repo) | same | 12/12 | UI 3 picks, Text 2, Video 2; diagrams named as a third secondary with no picks; read files to confirm evidence |
| 2026-10-17 | Request wins | same | 12/12 | Text primary from the request on a UI-only repo; UI picks kept to two and marked "for later" |
| 2026-10-17 | Stand out | same | 12/12 | the craft pick (lieflat-charts) is tied to the "stand out" ask |

Detector unit tests: 11/11. Catalog check: 42 repos and 4 npm packages resolve, 6 page-only rows listed. Findings fixed during the run: a notebook was counted twice (extension and import), Python plotting libraries in `requirements.txt` were not counted as dependencies, and the evidence list was silently truncated at six paths, which led two agents to say "five posts" where there were six; the detector now says "and N more".
