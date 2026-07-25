# Design Lint — Check Catalog

Every check has an id, a severity (`fail` blocks shipping by default; `warn` is reported but doesn't block), a symptom, a root cause, and a generic fix. Quote check ids in findings.

## 1. Layout

### `ghost-column` — fail
- **Symptom:** At 390px, an empty left column; content clipped or squeezed on the right.
- **Root cause:** A desktop split grid (`display: contents`, `grid-column: 2`, or `:nth-child` placement) survives into mobile because the placement rules beat `grid-column: auto`.
- **Fix:** A mobile teardown at your breakpoint (≤720px is typical): reset children to `display: grid` (or block) and force `grid-column: 1`. Specificity matters — the teardown must beat the `:nth-child` placement rules.

### `flex-spread` — fail
- **Symptom:** At 390px, a metric or stat row spreads across the full width with dead space between items, or centers awkwardly.
- **Root cause:** A desktop `flex: 1 1 calc(50% - gap)` or `justify-content: space-between` applies at mobile because no scoped override exists.
- **Fix:** At small widths, stack the items (`flex-direction: column`, `align-items: flex-start`) or switch to a tight gap-based layout. Scope the override to the component, not the page.

### `axis-mismatch` — fail
- **Symptom:** At 390px, a section label sits left-aligned while the content row below it is centered or indented — two different alignment axes in one block.
- **Root cause:** Mixed grid and flex containers without a shared mobile alignment rule.
- **Fix:** `justify-content: flex-start` (or a shared alignment token) on the content rows at mobile so label and body share one axis.

### `width-drift` — warn
- **Symptom:** At desktop, a heading or hero block centers in a narrower column than the content below it — edges don't line up.
- **Root cause:** A leftover `max-width` from another surface (e.g. `max-width: 720px` on hero content) beating a weaker local override.
- **Fix:** Align max-widths across sibling blocks in the same column; remove or override the inherited constraint with sufficient specificity.

### `early-wrap` — warn
- **Symptom:** A subtitle or intro wraps into a narrow ragged column while the block below spans full width.
- **Root cause:** An aggressive `max-width` in `ch` units (e.g. `42ch`) applied where the layout wants the full column.
- **Fix:** Let the text span its column (`max-width: none`) or match the block below; reserve `ch` caps for long-form body text.

### `h-overflow` — fail
- **Symptom:** Horizontal scrollbar at any viewport; content pokes past the right edge.
- **Root cause:** Fixed-width elements, unwrapped flex rows, absolute positioning, or 100vw + padding.
- **Fix:** Find the offender (inspect with `outline` on `*`, or check `scrollWidth > clientWidth` per element); constrain with `max-width: 100%`, `min-width: 0` on flex children, or `overflow-x: clip` only as a last resort.

## 2. Spacing

### `raw-rhythm-px` — warn
- **Symptom:** `gap`, `padding`, `margin` between blocks written as arbitrary px (`13px`, `27px`) instead of a scale.
- **Root cause:** Values eyeballed per-spot instead of drawn from spacing tokens/scale.
- **Fix:** Map to the project's spacing scale (`--s-*`, Tailwind steps, etc.). Element-first optical values (icon nudges, logo tuning) are exempt — see [adjust-logos](../adjust-logos/SKILL.md).

### `gap-inconsistency` — warn
- **Symptom:** Sibling sections separated by visibly different gaps with no hierarchy reason.
- **Root cause:** Sections styled at different times with different values.
- **Fix:** One inter-section rhythm value per surface; deviations only to signal grouping.

### `no-scroll-margin` — warn
- **Symptom:** Anchor links scroll the heading flush under a sticky header.
- **Root cause:** Missing `scroll-margin-top` on anchor targets.
- **Fix:** `scroll-margin-top` ≥ header height on `[id]` targets.

## 3. Typography

### `off-scale-size` — warn
- **Symptom:** Orphan `font-size: 15px` (or similar) that belongs to no step of the type scale.
- **Root cause:** Size picked ad hoc instead of from the scale.
- **Fix:** Snap to the nearest scale step (`--fs-*` or equivalent); if a new step is genuinely needed, add it to the scale, don't inline it.

### `tiny-mobile-text` — fail
- **Symptom:** Body or label text below ~13px at 390px.
- **Root cause:** Desktop-tuned sizes without a mobile floor.
- **Fix:** Set a floor (13–14px) for anything users must read; use `clamp()` for fluid scales.

### `long-lines` — warn
- **Symptom:** Body text lines over ~75 characters at desktop.
- **Root cause:** No measure cap on the text column.
- **Fix:** `max-width` around `65–75ch` on long-form text blocks.

### `heading-skip` — warn
- **Symptom:** Heading levels jump (h1 → h3) in the document outline.
- **Root cause:** Headings chosen for size, not structure.
- **Fix:** Keep the outline sequential; style the size independently of the level.

## 4. Color & tokens

### `hardcoded-ui-color` — warn
- **Symptom:** Hex/rgba literals for text, background, border, or shadow in component CSS.
- **Root cause:** Colors inlined instead of drawn from semantic tokens.
- **Fix:** Use the project's semantic tokens (`--foreground`, `--border`, …) or `color-mix()` on them. Decorative one-offs (masks, image gradients) are exempt — document them once.

### `near-duplicate-grays` — warn
- **Symptom:** Multiple grays within a few percent of each other (`#f4f4f5`, `#f5f5f6`, `#f6f6f7`) across the surface.
- **Root cause:** Each component picked its own gray.
- **Fix:** Collapse to the token set; every gray should answer to a name.

### `hardcoded-dark-values` — fail
- **Symptom:** Dark mode shows light-mode colors (or vice versa) on some elements.
- **Root cause:** Literal colors that don't respond to the theme; missing `prefers-color-scheme` / theme-class coverage.
- **Fix:** Route all UI color through theme-aware tokens; audit any remaining literals against both themes.

## 5. Accessibility

### `low-contrast` — fail
- **Symptom:** Body text under WCAG AA (4.5:1; 3:1 for large text).
- **Fix:** Darken the text or lighten the background until AA passes; check both themes.

### `no-focus-state` — fail
- **Symptom:** Tabbing shows no visible focus indicator on links, buttons, inputs.
- **Root cause:** `outline: none` without a replacement.
- **Fix:** Visible `:focus-visible` style on every interactive element — ring, underline, or background shift.

### `small-touch-target` — warn
- **Symptom:** Tap targets under 44 × 44px at mobile (icon buttons, close ×, nav links).
- **Fix:** Pad the hit area to ≥44px even if the visible mark stays small.

### `missing-alt` — fail
- **Symptom:** `<img>` without `alt` (or meaningful images with `alt=""`).
- **Fix:** Descriptive `alt` for content images; explicit `alt=""` only for decoration.

## 6. Responsive

### `nav-collapse` — fail
- **Symptom:** At 390/820, navigation overlaps the logo, wraps badly, or overflows instead of folding into its mobile pattern.
- **Fix:** A deliberate collapse breakpoint — menu button, priority+ pattern, or wrap with intent.

### `fixed-obscures` — fail
- **Symptom:** A sticky header/footer/banner covers content or traps the viewport at mobile.
- **Fix:** Reserve space (padding on the scroll container), shrink or hide the fixed element at small widths.

### `image-misfit` — warn
- **Symptom:** Images overflow their container, distort, or render pixelated at small sizes.
- **Fix:** `max-width: 100%; height: auto;` as the baseline; `srcset` for resolution; `object-fit` for crops.
