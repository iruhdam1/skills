#!/usr/bin/env node
/**
 * anti-slop-skill-picker · detector
 *
 * Counts, per medium, the files and dependencies that show what a repo is making,
 * so the picks rest on evidence. Plain Node, no dependencies, never edits anything.
 *
 *   node scripts/detect.mjs <path>          table
 *   node scripts/detect.mjs <path> --json   machine-readable
 *
 * A medium is "present" at 3 files or 1 dependency. The medium with the highest
 * score is primary; the next two are secondary. Score = files + 10 per dependency,
 * and a markdown file outside a content folder (content/, posts/, blog/, docs/ ...)
 * counts half, so engineering docs do not outweigh the product.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename, relative, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const asJson = process.argv.includes("--json");

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".astro", ".svelte-kit", "vendor", "coverage", ".cache", ".turbo", "out", "__pycache__", ".venv", "venv"]);
const MAX_FILES = 20000;
const MAX_READ = 512 * 1024;

const MEDIA = {
  text: { label: "Text and copy", exts: [".md", ".mdx", ".txt", ".rst"], dirs: ["content", "docs", "posts", "blog", "newsletter", "copy", "articles"], deps: [] },
  ui: { label: "UI and web design", exts: [".tsx", ".jsx", ".vue", ".svelte", ".astro", ".html", ".css", ".scss"], dirs: ["app", "pages", "components", "src/components", "ui"], deps: ["react", "react-dom", "vue", "svelte", "astro", "next", "nuxt", "tailwindcss", "@radix-ui", "shadcn", "@base-ui", "@headlessui", "@mui", "@chakra-ui"] },
  images: { label: "Images", exts: [], dirs: ["prompts", "image-prompts"], deps: ["replicate", "@fal-ai", "fal-ai", "@google/genai", "openai"], keywords: ["images.generate", "flux.1", "flux-pro", "flux-dev", "flux-schnell", "dall-e", "dalle", "midjourney", "nano-banana", "nanobanana", "imagen-", "stable-diffusion", "gpt-image", "fal.ai", "replicate.run"], names: ["prompt", "og", "cover", "thumbnail"] },
  video: { label: "Video and motion", exts: [".mp4", ".webm", ".mov", ".lottie"], dirs: ["compositions", "reels", "marketing", "video", "videos", "motion", "animations"], deps: ["remotion", "@remotion", "gsap", "lottie-web", "@lottiefiles", "framer-motion", "motion", "hyperframes", "@hyperframes", "three", "animejs"], keywords: ["ffmpeg"] },
  diagrams: { label: "Diagrams", exts: [".mmd", ".mermaid", ".excalidraw", ".drawio", ".puml", ".plantuml"], dirs: ["diagrams", "architecture"], deps: ["mermaid", "@excalidraw", "@mermaid-js"], keywords: ["```mermaid"] },
  charts: { label: "Charts and data", exts: [".ipynb", ".csv", ".parquet"], dirs: ["dashboard", "dashboards", "charts", "data"], deps: ["d3", "recharts", "chart.js", "react-chartjs-2", "vega", "vega-lite", "plotly.js", "react-plotly.js", "echarts", "@observablehq/plot", "@nivo", "visx", "@visx"], keywords: ["import matplotlib", "import seaborn", "import altair", "import plotly", "from matplotlib", "from plotnine"] },
};

const hits = Object.fromEntries(Object.keys(MEDIA).map((k) => [k, { files: 0, weight: 0, deps: [], evidence: new Set() }]));
let count = 0;
let truncated = false;
const packageJsons = [];

function add(medium, file, weight = 1) {
  const h = hits[medium];
  h.files += 1;
  h.weight += weight;
  if (h.evidence.size < 6) h.evidence.add(file);
}

function walk(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (count >= MAX_FILES) { truncated = true; return; }
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name) || e.name.startsWith(".")) continue;
      walk(full);
      continue;
    }
    if (!e.isFile()) continue;
    count += 1;
    const rel = relative(root, full);
    const ext = extname(e.name).toLowerCase();
    const lower = rel.toLowerCase();
    const dirs = lower.split("/").slice(0, -1);
    if (ext === ".ts" && e.name.endsWith(".d.ts")) continue;
    if (e.name === "package.json") packageJsons.push(full);
    if (e.name === "requirements.txt" || e.name === "pyproject.toml") packageJsons.push(full);

    for (const [medium, m] of Object.entries(MEDIA)) {
      if (m.exts.includes(ext)) {
        const inContentDir = medium !== "text" || dirs.some((d) => m.dirs.includes(d));
        add(medium, rel, inContentDir ? 1 : 0.5);
        continue;
      }
      if (medium === "images" && m.names.some((n) => basename(lower, ext).includes(n)) && [".md", ".json", ".txt", ".mjs", ".js", ".ts", ".py"].includes(ext) && dirs.some((d) => m.dirs.includes(d) || d.includes("prompt") || d.includes("social") || d.includes("og"))) { add(medium, rel); continue; }
      if (medium === "text" && m.dirs.some((d) => dirs.includes(d)) && ext === ".json") { add(medium, rel); continue; }
    }

    // Content keywords, only in text-like files of a sane size.
    if ([".md", ".mdx", ".js", ".mjs", ".ts", ".tsx", ".py", ".sh", ".ipynb"].includes(ext)) {
      let size = 0;
      try { size = statSync(full).size; } catch { continue; }
      if (size > MAX_READ) continue;
      let body = "";
      try { body = readFileSync(full, "utf8"); } catch { continue; }
      for (const [medium, m] of Object.entries(MEDIA)) {
        if (!m.keywords) continue;
        if (medium === "diagrams" && ext !== ".md" && ext !== ".mdx") continue;
        if (medium === "charts" && ![".py", ".ipynb"].includes(ext)) continue;
        if (medium === "images" && [".md", ".mdx"].includes(ext) && !dirs.some((d) => d.includes("prompt"))) continue;
        const low = body.toLowerCase();
        const kw = m.keywords.find((k) => low.includes(k));
        if (kw) {
          add(medium, `${rel} (${kw})`);
        }
      }
    }
  }
}

walk(root);

for (const pj of packageJsons) {
  let names = [];
  try {
    if (pj.endsWith("package.json")) {
      const j = JSON.parse(readFileSync(pj, "utf8"));
      names = Object.keys({ ...(j.dependencies || {}), ...(j.devDependencies || {}) });
    } else {
      names = readFileSync(pj, "utf8").split("\n").map((l) => l.trim().split(/[=<>~ \[]/)[0]).filter(Boolean);
    }
  } catch { continue; }
  for (const [medium, m] of Object.entries(MEDIA)) {
    for (const d of m.deps) {
      const match = names.find((n) => n === d || n.startsWith(`${d}/`) || n.startsWith(`${d}-`));
      if (match && !hits[medium].deps.includes(match)) {
        if (medium === "images" && (match === "openai" || match === "@google/genai") && hits.images.files === 0) continue; // generic SDKs count only with image calls
        hits[medium].deps.push(match);
        if (hits[medium].evidence.size < 6) hits[medium].evidence.add(`${relative(root, pj)} → ${match}`);
      }
    }
  }
}

const rows = Object.entries(MEDIA).map(([key, m]) => {
  const h = hits[key];
  const score = Math.round(h.weight + 10 * h.deps.length);
  const present = h.files >= 3 || h.deps.length >= 1;
  return { key, label: m.label, files: h.files, deps: h.deps, evidence: [...h.evidence], score, present };
}).sort((a, b) => b.score - a.score);

const present = rows.filter((r) => r.present);
const result = {
  root,
  scanned: count,
  truncated,
  primary: present[0]?.key || null,
  secondary: present.slice(1, 3).map((r) => r.key),
  absent: rows.filter((r) => !r.present).map((r) => r.key),
  media: rows,
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`anti-slop-skill-picker · ${root}`);
  console.log(`scanned ${count} files${truncated ? " (stopped at the cap; results are a sample)" : ""}\n`);
  for (const r of rows) {
    const role = r.key === result.primary ? "primary" : result.secondary.includes(r.key) ? "secondary" : r.present ? "present" : "absent";
    console.log(`${r.label.padEnd(20)} ${String(r.files).padStart(5)} files  ${String(r.deps.length).padStart(2)} deps  ${role}`);
    for (const e of r.evidence) console.log(`    ${e}`);
  }
  if (!present.length) console.log("\nNo medium above the threshold. Ask which medium the task is in before picking.");
}
