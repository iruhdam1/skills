# Self-contained deck format


The portable pack uses the convention below; the presenter can also attempt to control other HTML decks. Arbitrary custom navigation is not guaranteed compatible.

## File

One complete UTF-8 HTML document, maximum 2,097,152 bytes (the presenter's default 2 MB cap). Keep CSS and JavaScript inline. Use system fonts and inline SVG/data assets, avoiding linked stylesheets, remote scripts, CSS imports, fetches, and external images/media. Ordinary reference hyperlinks are allowed but should not be required during the talk. Do not add upload logic, tracking, forms, or credentials.

## Slides and navigation

Use `.slide` elements in DOM order, including slides currently hidden. Give each a stable `data-slide-index` starting at zero. Show one slide using `.active` and `hidden = false`; hide all others. Do not remove inactive slides from the DOM.

Provide `window.goToSlide(index)` and update `window.currentSlide` and `document.documentElement.dataset.activeSlide`. Dispatch `new CustomEvent('slidechange', { detail: { index } })` after navigation. The bundled starter demonstrates clamping, button disabled states, progress, and keyboard navigation. Keyboard handlers must ignore text inputs, editable regions, and modified shortcuts. `.slide[hidden]` must stay hidden regardless of display styles.

The presenter bridge observes the deck's confirmed active slide. The phone must not infer the slide by counting previous/next clicks. A deck without an identifiable active slide can still display, but notes synchronization may be unavailable.

## Notes

Place notes directly inside their slide. Prefer valid JSON:

```html
<script type="application/json" class="slide-notes">
{"title":"A small first step","script":"Introduce the practical problem.","notes":["Pause for a response","Move to the example"]}
</script>
```

`title` and `script` are strings; `notes` is an array of strings. Use plain text in each field. Escape literal `</script` as `<\/script` when serializing text so it cannot close the JSON element. Do not put HTML, event handlers, URLs with secrets, or executable instructions in notes. The phone renders imported text, not HTML.

Plain-text fallback:

```html
<aside class="notes" hidden>Introduce the practical problem. Pause before the example.</aside>
```

Always include `aside.notes { display: none !important; }`. When both forms exist, valid JSON takes precedence. Invalid JSON can fall back to a plain-text aside; otherwise the phone shows an unreadable-notes state. A slide with no note block shows a separate missing-notes state. Avoid duplicate note blocks per slide.

Keep titles below 200 characters, speaking text below 6,000 characters, and up to 20 supporting notes of 500 characters each so the phone remains readable. The receiving service applies its own limits; these authoring budgets are deliberately modest and are not an API schema.

## Delivery and verification

Run the bundled validator against the final output. It is a dependency-free static inspection, not a full HTML parser, security audit, or browser test. Check dynamically built asset paths and notes manually; a regex-based scan cannot prove their absence. Then open the file with networking disabled and navigate every slide, checking overflow and readability. Upload and pair the phone only when authorized; do not call local verification a hosted presentation test.

The local HTML backup works without the hosted service when all dependencies are embedded. Hosted remote synchronization and phone notes need internet. An uploaded file and its embedded notes are temporarily stored until expiry; hidden notes are not encryption or confidential storage.

## Provenance

This starter, example, and validator are original Tiny Design Shop resources. The notes convention is interoperable with JSON `slide-notes` decks such as the publicly documented [bluedusk/html-slides](https://github.com/bluedusk/html-slides) format; no upstream code is bundled. Any future copied code must retain its applicable license and attribution.
