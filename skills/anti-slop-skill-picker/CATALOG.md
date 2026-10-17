# Catalog

The resources the picker may recommend, grouped by medium. Three columns matter when picking: **Type** (rulebook stops slop while building, checker finds it after, craft makes the work distinctive), **Form** (what "install" means: skill, CLI, MCP, plugin, prompt, reference, Grok bot) and **Install**, which is copied verbatim. `★` rows are the "start here" picks; "also" rows come in when the evidence fits.

Last verified: **2026-10-17**. Every row was fetched that day (repo, SKILL.md or page, install line). Stars are GitHub stars; "installs" are skills.sh install counts, which is how skills.sh ranks. Re-verify a row before relying on it when its date is older than three months. A resource without a primary source never goes in; see "Dropped" at the bottom for what was tried and why it is out.

## Text and copy

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ no-ai-slop | checker | skill | A sharp human editor pass: 20+ AI patterns removed without flattening the voice; ships its own `eval.md` self-check. Works in Claude Code and Codex. | `npx skills add petergyang/no-ai-slop --skill no-ai-slop` | github.com/petergyang/no-ai-slop · 12.5k stars · 26.9K installs | 2026-10-17 |
| ★ Anti-slop writing (Viewfield) | rulebook | skill | Bans em-dash overuse, "delve / tapestry / seamless", "it's not just X, it's Y" and throat-clearing intros; adds a VOICE.md and a six-step self-review. | `npx @viewfieldai/skills add anti-slop` | docs.viewfield.ai/skills/anti-slop | 2026-10-17 |
| stop-slop (hardikpandya) | rulebook | skill | The catalogue of AI prose tells (phrases, structures, rhythms) the agent must catch while drafting. Short enough to fold into a copy guide. | `npx skills add hardikpandya/stop-slop` | github.com/hardikpandya/stop-slop · 18.1k stars | 2026-10-17 |
| stop-slop plugin (abossard) | checker | Claude Code plugin | The same tells as a plugin with a standalone analyzer that flags sentences to inspect. Two steps, not one. | `claude plugin marketplace add abossard/stop-slop` then `claude plugin install stop-slop@stop-slop` | github.com/abossard/stop-slop | 2026-10-17 |
| anti-slop (rand, cc-polymath) | checker | skill | Detects and removes generic AI patterns across text, code and design, with scoring and cleaning scripts and per-domain references. Cross-medium. | `npx skills add rand/cc-polymath --skill anti-slop` | github.com/rand/cc-polymath/tree/main/skills/anti-slop | 2026-10-17 |
| talk-normal | rulebook | installer | One system prompt that makes the agent answer plainly in chat; `install.sh` writes it into `AGENTS.md` between markers. For agent tone, not shipped copy. | `git clone https://github.com/hexiecs/talk-normal.git && cd talk-normal && bash install.sh` | github.com/hexiecs/talk-normal · 1.9k stars | 2026-10-17 |
| also · ai-slop-audit (social posts) | checker | Claude Code plugin | Grades a social post, campaign or AI visual A to F with a genericness score and blocks fabricated claims. Offer only for social copy. | `/plugin marketplace add https://github.com/peterbamuhigire/social-media-skills` then `/plugin install social@chwezi-social` | github.com/peterbamuhigire/social-media-skills · 2 stars | 2026-10-17 |
| Wikipedia: Signs of AI writing | reference | page | The public list most tell catalogues are drawn from (WikiProject AI Cleanup). | no install: en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing | Wikipedia | 2026-10-17 |
| Anti-Slop AI Writing Guide (louisfb01) | reference | prompt | A copy-paste prompt: audience, structure, banned vocabulary, review-then-rewrite. | no install: github.com/louisfb01/ai-engineering-cheatsheets/blob/main/Anti_Slop_AI_Writing_Guide.md | GitHub | 2026-10-17 |
| Copy Humanizer | reference | Grok bot template | A Grok Bot that rewrites machine-sounding copy in the author's voice. An importable bot, not a readable rule file. | no install: x.ai/bot/marketplace/bots/human-copywriter | x.ai | 2026-10-17 |

## UI and web design

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ Kill AI Slop | rulebook | skill + scanner | The illustrated field guide (35 tells on the site, 34 in the skill): what each tell is, why it reads machine-made, the fix. Scanner greps a codebase for code-level signals. | `npx skills add yetone/kill-ai-slop`; scanner `node skill/scripts/scan.mjs <path>` | github.com/yetone/kill-ai-slop · killaislop.com | 2026-10-17 |
| ★ hallmark (Together AI) | checker · craft | skill + CLI | 57 slop-test gates and a punch list from `hallmark audit <target>`, no edits; 21 themes and macrostructures for the build side. | `npx skills add nutlope/hallmark`; then `hallmark audit <url or path>` | github.com/Nutlope/hallmark · 30.3k stars | 2026-10-17 |
| ★ taste-skill, `design-taste-frontend` | craft | skill | Art direction first: references, a visual direction and a browser check before shipping. The largest anti-slop design skill. | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | github.com/Leonxlnx/taste-skill · 98.4k stars · 628.6K installs | 2026-10-17 |
| Impeccable | rulebook · checker | skill + CLI | Design vocabulary for agents, `/impeccable audit` and `/impeccable polish`, `npx impeccable detect <url>`. (No DevTools panel; that claim was wrong.) | `npx impeccable install` | github.com/pbakaus/impeccable · impeccable.style | 2026-10-17 |
| Anthropic frontend-design | rulebook | skill | Names Claude's own default looks and adds a plan, critique, build loop. | `npx skills add anthropics/skills --skill frontend-design` | github.com/anthropics/skills | 2026-10-17 |
| anti-slop (miqdadbadjuber) | rulebook | skill or plugin | A filter, not a style guide: rejects generic UI, filler copy and AI-shaped code while your own DESIGN.md sets the direction. | `npx skills add miqdadbadjuber/anti-slop` | github.com/miqdadbadjuber/anti-slop · 6.3k stars | 2026-10-17 |
| Slop Detector | checker | CLI + GitHub Action | Scans a URL, scores 0 to 100, can fail CI on Heavy. Not the npm `slop-detector`, which is a prose MCP. | `npx slop-detect https://your-site.com` | github.com/ravidsrk/slop-detect | 2026-10-17 |
| Slop Patterns, Slop Score | checker | MCP | 272 patterns; the MCP's `check_design` circles the defaults and writes the fix as a prompt. | `npx add-mcp https://sloppatterns.com/mcp` | github.com/pavithralamahewa/slop-patterns · sloppatterns.com | 2026-10-17 |
| avoid-ai-design | checker | skill + scanner | 67 tells including the "tasteful" ones (cream + terracotta, editorial dashboards); zero-dependency scanner. | `npx skills add funboy322/avoid-ai-design`; scanner `node ~/.claude/skills/avoid-ai-design/scripts/detect.mjs src/` | github.com/funboy322/avoid-ai-design · 110 stars | 2026-10-17 |
| Gesso anti-slop | checker | CLI | 73 HTML/CSS rules with thresholds and `fix --write`. | `npx -y @gessobuild/anti-slop check page.html` | github.com/Gesso-Build/skills · gesso.build | 2026-10-17 |
| design-lint + responsive-preview | checker | skill | Strict design QA with a fixed check catalog, and mobile, tablet, desktop screenshots with a pass, warn, fail report. Same pack as this skill. | `npx skills@latest add iruhdam1/skills` | github.com/iruhdam1/skills | 2026-10-17 |
| also · stitch-skills, `taste-design` | craft | plugin + skill | Writes a DESIGN.md that enforces anti-generic styling: colour and font limits, banned AI patterns, spring motion. | `npx skills add google-labs-code/stitch-skills` | github.com/google-labs-code/stitch-skills · 8.5k stars | 2026-10-17 |
| also · taste-skill, `brandkit` and `high-end-visual-design` | craft | skill | `brandkit` builds the brand board (logos, palette, type). `high-end-visual-design` is the install name of the calm, soft-contrast direction. Offer `brandkit` when the repo has no tokens. | `npx skills add https://github.com/Leonxlnx/taste-skill --skill brandkit` | github.com/Leonxlnx/taste-skill · 384.5K / 452.0K installs | 2026-10-17 |
| also · emil-design-eng | craft | skill | Emil Kowalski's polish: animation timing and easing, component details, a before and after review format. For the last ten percent. | `npx skills@latest add emilkowalski/skills` | github.com/emilkowalski/skills · 47.0k stars · 360.9K installs | 2026-10-17 |
| also · fluid-functionalism | craft | registry + skill | Component craft decisions pulled from real code. React and Base UI only; offer it when React is detected. | `npx skills add mickadesign/fluid-functionalism` | github.com/mickadesign/fluid-functionalism · fluidfunctionalism.com | 2026-10-17 |
| Anthropic "Frontend design" prompt block | reference | prompt | The verbatim "avoid generic AI-generated aesthetics" list (Inter, Roboto, purple gradients) from Anthropic's prompting guide. Paste into a system prompt. | no install: platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic docs | 2026-10-17 |
| Critiquito: Design Critique | reference | Grok bot template | Ranked fixes from a screenshot or Figma link. An importable bot. | no install: x.ai/bot/marketplace/bots/critiquito | x.ai | 2026-10-17 |

## Images

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ creative-direction (dylanfeltus) | rulebook | skill | Prompt templates per asset type (hero, feature illustration, OG card, icon), overused tropes to avoid, style consistency across a set. | `npx skills add dylanfeltus/skills --skill creative-direction` | github.com/dylanfeltus/skills | 2026-10-17 |
| ★ flux-image-best-practices (Black Forest Labs) | craft | skill | Vendor-written FLUX prompting: structured prompts, hex colours, typography, multi-reference edits, model choice. | `npx skills add black-forest-labs/skills --skill flux-image-best-practices` | github.com/black-forest-labs/skills · 130 stars | 2026-10-17 |
| visual-skills (smixs) | rulebook | skill | Model-specific prompt templates (nano-banana, gpt-image) and a banned-words list in `universal-rules.md` for "looks AI, too glossy" results. | `npx skills add smixs/visual-skills` | github.com/smixs/visual-skills | 2026-10-17 |
| ai-ad-prompt-guide (Creatify) | rulebook | skill folder | SLCT framework, five hallucination-prevention rules, camera vocabulary, per-model tips (Sora 2, Veo 3.1, Kling). The only concrete "why it looks AI" trigger table found for generation. Covers video too. | `git clone https://github.com/Creatify-AI/ai-ad-prompt-guide.git ~/.claude/skills/ai-ad-prompt-guide` | github.com/creatify-ai/ai-ad-prompt-guide · 42 stars | 2026-10-17 |
| image-humanizer | checker | Node CLI | Flags AI-prone prompt words ("stunning", "8K", "cinematic lighting") and swaps in camera, light and imperfection language. Dormant, not on npm; the only prompt checker found. | `git clone https://github.com/brandonwise/image-humanizer && cd image-humanizer && npm install`, then `image-humanizer transform "prompt"` | github.com/brandonwise/image-humanizer · 0 stars | 2026-10-17 |

## Video and motion

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ Remotion skills | rulebook | skill | Official best practices for compositions, timing, captions and rendering. | `npx skills add remotion-dev/skills` | github.com/remotion-dev/skills | 2026-10-17 |
| ★ motion-design (LottieFiles) | rulebook | skill | Provider-agnostic motion guidance: timing, easing, choreography, the Disney principles applied to UI; CSS, Framer, GSAP and Lottie. Official LottieFiles org. | `npx skills add LottieFiles/motion-design-skill` | github.com/LottieFiles/motion-design-skill · 2.3k stars · 17.7K installs | 2026-10-17 |
| ★ no-slop-motion | rulebook · checker | skill | Ten gates from pain to QA, a banned-pattern linter, a pop and flash detector. Bans the montage, card-grid and glow defaults. | `npx skills add ferndesk/no-slop-motion` | github.com/ferndesk/no-slop-motion · 90 stars | 2026-10-17 |
| motionmaxxing | checker · craft | skill | Rates a rendered film slop, mid or maxxed, runs gates, then fixes typography, easing and grounds. HyperFrames + GSAP; offer when either is detected. | `git clone https://github.com/Tejashmakwana/motionmaxxing ~/.claude/skills/motionmaxxing && bash ~/.claude/skills/motionmaxxing/install.sh` | github.com/Tejashmakwana/motionmaxxing · 825 stars | 2026-10-17 |
| claude-motion-design (howseen-ai) | rulebook | skill | HTML + Playwright + ffmpeg motion pieces with rules; the same stack as a deterministic HTML reel harness. | `npx skills add howseen-ai/claude-motion-design` | github.com/howseen-ai/claude-motion-design | 2026-10-17 |
| claude-remotion-skill (haidrrrry) | craft | skill | Bans linear interpolation, discourages lone opacity fades (three-property entrances), checks rendered frames. | `git clone https://github.com/haidrrrry/claude-remotion-skill` then copy `remotion-motion-graphics/` into `~/.claude/skills/` | github.com/haidrrrry/claude-remotion-skill | 2026-10-17 |
| motion-graphic-director-skill | craft | skill | Makes the agent write a design doc and get approval before code, so it is not an animated slide deck. | `npx skills add MaizeCobra/motion-graphic-director-skill` | github.com/MaizeCobra/motion-graphic-director-skill · 4 stars | 2026-10-17 |
| also · emil-design-eng | craft | skill | UI motion timing and easing (see UI). | `npx skills@latest add emilkowalski/skills` | github.com/emilkowalski/skills | 2026-10-17 |
| also · ai-ad-prompt-guide | rulebook | skill folder | Generated video prompts (see Images). | see Images | | 2026-10-17 |
| Lasseter's principles, scroll vocabulary | reference | prompt | Not tools. Ask the agent to review the piece against Lasseter's twelve principles; name scroll behaviour (pin, scrub, parallax, reveal) instead of "animate on scroll". | no install | | 2026-10-17 |

## Diagrams

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ diagram-design (cathrynlavery) | craft | skill or plugin | 45 editorial diagram types as one HTML + SVG file in your brand; imports drawio, Mermaid and Excalidraw; "no shadows, no Mermaid slop". Brand onboarding maps to your tokens. | `npx skills add cathrynlavery/diagram-design` | github.com/cathrynlavery/diagram-design · 56.9k stars | 2026-10-17 |
| ★ excalidraw-diagram-skill (coleam00) | craft | skill | Diagrams that argue rather than display (no uniform card grids), with a render-and-fix loop for overlaps. Needs Python, uv and Playwright. | `npx skills add coleam00/excalidraw-diagram-skill --skill excalidraw-diagram` | github.com/coleam00/excalidraw-diagram-skill | 2026-10-17 |
| gstack `/diagram` (garrytan) | rulebook | skill set | Mermaid source plus editable `.excalidraw`, SVG and PNG, offline. Needs Bun; installs the whole gstack set. | `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup` | github.com/garrytan/gstack | 2026-10-17 |
| architecture-diagram-generator (Cocoon-AI) | craft | skill (zip) | Dark-themed architecture diagrams as single HTML files with inline SVG and PNG or PDF export. | download the release zip, then `unzip architecture-diagram.zip -d ~/.claude/skills/` | github.com/Cocoon-AI/architecture-diagram-generator · 7.5k stars | 2026-10-17 |
| visual-verify (edwinhu/workflows) | checker | plugin, auto-invoked | Render to PNG, score with a vision model, fix until it passes; catches labels colliding with arrows. Not callable on its own. | `/plugin marketplace add edwinhu/workflows` | github.com/edwinhu/workflows | 2026-10-17 |

## Charts and data

| Pick | Type | Form | What it does | Install / use | Source | Verified |
|---|---|---|---|---|---|---|
| ★ tufte-data-viz (Caylent) | rulebook | skill | 22 rules in three tiers (data-ink, honesty, screen-first accessibility) across Recharts, ECharts, Chart.js, matplotlib, Plotly and D3. | `npx skills add caylent/tufte-data-viz` | github.com/caylent/tufte-data-viz · 226 stars | 2026-10-17 |
| ★ visualization-strategy-and-critique (OpenAI) | rulebook | skill (Codex plugin) | Chooses chart types from the question and critiques existing charts; bans decorative parallax and scrolljacking. SKILL.md only. | Codex: install the `build-web-data-visualization` plugin; elsewhere copy its SKILL.md into `.claude/skills/` | github.com/openai/plugins/tree/main/plugins/build-web-data-visualization/skills/visualization-strategy-and-critique | 2026-10-17 |
| Frontiers figure-review prompt | checker | prompt | Paste-in review for truncated axes, misleading colour scales and missing uncertainty, without touching the data. | no install: frontiersin.org/ai-playbook/research-stages/visualization-images | Frontiers | 2026-10-17 |
| lieflat-charts | craft | skill | Chart families, decks and report layouts with one consistent type, space, line and motion language and honest units. README is Chinese-first; English in README.en.md. | `npx skills add https://github.com/larashero3-dotcom/lieflat-charts --skill lieflat-charts` | github.com/larashero3-dotcom/lieflat-charts · 6.2k stars | 2026-10-17 |

## Dropped

Tried on 2026-10-17 and left out, so nobody re-adds them without a reason:

- **design.how systems**: a placeholder site, no skills shipped.
- **Lasseter principles via @Shwinnabego, scroll vocabulary via @gabriell_lab**: X posts, not tools. Their ideas live in the Rules as prompts.
- **proseify.xyz anti-prose-slop**: a vendor funnel for a paid MCP, no source, not a checker.
- **squall-chua visual-slop**: rules fetched from an external "slop law" at run time, 4 installs; unverifiable.
- **oldwinter mermaid-visualizer**: an orphaned re-host of someone else's skill.
- **lucassantana-dev repaint**: a whole frontend pipeline with tiny adoption; overlaps taste-skill.
- **blader/humanizer** (57.8k stars): the Wikipedia-signs skill; strong, but a general humanizer rather than a tool for shipped copy. Add it if a user wants a text checker with the widest adoption.
- **agiwhitelist/auteur, Trystan-SA/claude-design-system-prompt, ForgePlan slopocop**: a site pipeline, a dumped system prompt, a wrapper around hallmark.
- **humanizer-zh, huashu-design, inboundfy anti-slop**: Chinese- or Portuguese-first.
- **nextlevelbuilder ui-ux-pro-max**: a general UI kit, not anti-slop.
