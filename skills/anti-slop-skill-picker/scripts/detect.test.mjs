// node --test skills/anti-slop-skill-picker/scripts/
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DETECT = join(dirname(fileURLToPath(import.meta.url)), "detect.mjs");

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), "picker-fixture-"));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(dir, dirname(path)), { recursive: true });
    writeFileSync(join(dir, path), body);
  }
  return dir;
}

function detect(dir) {
  const out = execFileSync(process.execPath, [DETECT, dir, "--json"], { encoding: "utf8" });
  return JSON.parse(out);
}

function run(files, fn) {
  const dir = fixture(files);
  try { fn(detect(dir), dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

test("Next.js app is UI primary and nothing else is present", () => {
  run({
    "package.json": JSON.stringify({ dependencies: { next: "15", react: "19", tailwindcss: "4" } }),
    "app/page.tsx": "x", "tailwind.config.ts": "x",
    "components/ui/a.tsx": "x", "components/ui/b.tsx": "x", "components/ui/c.tsx": "x",
  }, (r) => {
    assert.equal(r.primary, "ui");
    assert.deepEqual(r.secondary, []);
    assert.ok(r.absent.includes("text") && r.absent.includes("charts"));
  });
});

test("markdown posts are text primary", () => {
  run({ "content/posts/a.md": "#", "content/posts/b.md": "#", "content/posts/c.md": "#", "content/posts/d.md": "#", "README.md": "#" }, (r) => {
    assert.equal(r.primary, "text");
    assert.deepEqual(r.secondary, []);
  });
});

test("reel harness is video primary; one html file stays under the threshold", () => {
  run({
    "package.json": JSON.stringify({ devDependencies: { playwright: "1", gsap: "3" } }),
    "marketing/reel/reel.html": "<html></html>", "render.mjs": 'spawn("ffmpeg")',
  }, (r) => {
    assert.equal(r.primary, "video");
    assert.ok(r.absent.includes("ui"));
  });
});

test("notebook with charts is charts primary", () => {
  run({
    "analysis.ipynb": JSON.stringify({ cells: [{ source: ["import matplotlib.pyplot as plt"] }] }),
    "data/x.csv": "a,b", "requirements.txt": "plotly==5\npandas",
  }, (r) => {
    assert.equal(r.primary, "charts");
    const charts = r.media.find((m) => m.key === "charts");
    assert.ok(charts.deps.includes("plotly"));
    assert.equal(charts.files, 2, "a notebook counts once, not again for its matplotlib import");
  });
});

test("empty folder has no primary and lists every medium absent", () => {
  run({}, (r) => {
    assert.equal(r.primary, null);
    assert.equal(r.absent.length, 6);
  });
});

test("mixed repo ranks UI first, then text and video", () => {
  const files = { "package.json": JSON.stringify({ dependencies: { react: "19", gsap: "3" } }) };
  for (let i = 0; i < 6; i++) files[`src/c${i}.tsx`] = "x";
  for (let i = 0; i < 5; i++) files[`content/p${i}.md`] = "#";
  for (let i = 0; i < 3; i++) files[`videos/v${i}.mp4`] = "";
  run(files, (r) => {
    assert.equal(r.primary, "ui");
    assert.deepEqual([...r.secondary].sort(), ["text", "video"]); // gsap lifts video above five posts
  });
});

test("threshold: two files absent, three present; one dependency present", () => {
  run({ "a.mmd": "", "b.mmd": "" }, (r) => assert.ok(r.absent.includes("diagrams")));
  run({ "a.mmd": "", "b.mmd": "", "c.mmd": "" }, (r) => assert.equal(r.primary, "diagrams"));
  run({ "package.json": JSON.stringify({ dependencies: { recharts: "2" } }) }, (r) => assert.equal(r.primary, "charts"));
});

test("markdown outside content folders counts half, so docs do not outweigh the product", () => {
  const files = { "package.json": JSON.stringify({ dependencies: { react: "19" } }) };
  for (let i = 0; i < 8; i++) files[`src/c${i}.tsx`] = "x";       // ui score 8 + 10 = 18
  for (let i = 0; i < 20; i++) files[`internal/n${i}.md`] = "#";    // text score 10 at half weight (docs/ and content/ count full)
  run(files, (r) => {
    assert.equal(r.primary, "ui");
    assert.equal(r.media.find((m) => m.key === "text").score, 10);
  });
});

test("mermaid blocks in markdown and .d.ts files are handled", () => {
  run({ "docs/a.md": "```mermaid\ngraph TD\n```", "docs/b.md": "```mermaid\n```", "docs/c.md": "```mermaid\n```", "types/env.d.ts": "flux.1 flux-pro" }, (r) => {
    assert.equal(r.media.find((m) => m.key === "diagrams").files, 3);
    assert.equal(r.media.find((m) => m.key === "images").files, 0);
  });
});

test("generic SDKs count for images only with an image-generation call", () => {
  run({ "package.json": JSON.stringify({ dependencies: { openai: "4" } }), "a.ts": "const x = 1" }, (r) => {
    assert.ok(r.absent.includes("images"));
  });
  run({ "package.json": JSON.stringify({ dependencies: { openai: "4" } }), "scripts/og.mjs": "await client.images.generate({})" }, (r) => {
    const img = r.media.find((m) => m.key === "images");
    assert.equal(img.present, true);
    assert.ok(img.deps.includes("openai"));
  });
});

test("skips node_modules, dist and dotfolders", () => {
  const files = {};
  for (let i = 0; i < 9; i++) files[`node_modules/x/c${i}.tsx`] = "x";
  for (let i = 0; i < 9; i++) files[`dist/c${i}.html`] = "x";
  for (let i = 0; i < 9; i++) files[`.next/c${i}.css`] = "x";
  run(files, (r) => assert.equal(r.primary, null));
});
