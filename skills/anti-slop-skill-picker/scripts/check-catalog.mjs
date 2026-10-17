#!/usr/bin/env node
/**
 * Checks that every resource in CATALOG.md still resolves:
 *   - every github.com/<owner>/<repo> answers `git ls-remote`
 *   - every npm package named in an install line answers `npm view <pkg> version`
 * Web-only rows (docs sites, x.ai, Wikipedia) are listed, not fetched.
 * Exits 1 on any failure.  node scripts/check-catalog.mjs [path/to/CATALOG.md]
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const file = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), "..", "CATALOG.md");
const md = readFileSync(file, "utf8");
const dropped = md.indexOf("\n## Dropped");
const body = dropped > 0 ? md.slice(0, dropped) : md;

const repos = new Set();
for (const m of body.matchAll(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/g)) {
  const repo = m[2].replace(/\.git$/, "");
  repos.add(`${m[1]}/${repo}`);
}

const pkgs = new Set();
for (const m of body.matchAll(/`npx (?:-y )?(@?[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)?)(?:@[a-z0-9.]+)? /g)) {
  const p = m[1];
  if (["skills", "plugins", "add-mcp"].includes(p)) continue; // installers, not catalog resources
  pkgs.add(p);
}

const pages = [...body.matchAll(/no install: ([^\s|]+)/g)].map((m) => m[1]);

let failed = 0;
const row = (ok, kind, name, note = "") => { console.log(`${ok ? "pass" : "FAIL"}  ${kind.padEnd(5)} ${name}${note ? "  " + note : ""}`); if (!ok) failed++; };

for (const r of [...repos].sort()) {
  try {
    execFileSync("git", ["ls-remote", "--exit-code", "-h", `https://github.com/${r}`], { stdio: ["ignore", "ignore", "ignore"], timeout: 60000 });
    row(true, "repo", r);
  } catch (e) { row(false, "repo", r, "ls-remote failed"); }
}
for (const p of [...pkgs].sort()) {
  try {
    const v = execFileSync("npm", ["view", p, "version"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 60000 }).trim();
    row(true, "npm", p, v);
  } catch { row(false, "npm", p, "not on npm"); }
}
for (const u of pages) console.log(`page   ${u} (not fetched here)`);

console.log(`\n${repos.size} repos, ${pkgs.size} npm packages, ${pages.length} pages; ${failed} failure(s)`);
process.exit(failed ? 1 : 0);
