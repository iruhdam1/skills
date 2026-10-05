#!/usr/bin/env node
/**
 * Generate skill visuals: one visual.png per skill plus assets/hero.png.
 *
 * Brand: m2 field + accent per skill, NaN Jaune Midi (display) + Onest (UI),
 * ghost-wireframe product shots with numbered pins that match the points on the left.
 *
 * Usage:
 *   npm i --no-save playwright
 *   FONT_DIR=/path/to/fonts node scripts/generate-visuals.mjs            # all
 *   FONT_DIR=/path/to/fonts node scripts/generate-visuals.mjs design-lint
 *
 * FONT_DIR (default: assets/fonts, gitignored) must hold:
 *   Onest-300.ttf, Onest-400.ttf, Onest-500.ttf   (OFL, Google Fonts)
 *   NaNJaune-Midi-Var.ttf                          (licensed, never commit)
 * CHROMIUM_PATH optionally points Playwright at a local Chromium.
 * Output is 3200x1800 (2x) PNG.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { pathToFileURL, fileURLToPath } from "url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const VIS = join(ROOT, "scripts/visuals");
const FONT_DIR = resolve(process.env.FONT_DIR || join(ROOT, "assets/fonts"));
const FONTS = { 300: "Onest-300.ttf", 400: "Onest-400.ttf", 500: "Onest-500.ttf", nan: "NaNJaune-Midi-Var.ttf" };
for (const f of Object.values(FONTS)) {
  if (!existsSync(join(FONT_DIR, f))) { console.error(`Missing font ${f} in ${FONT_DIR} (set FONT_DIR)`); process.exit(1); }
}
const fontUrl = (f) => pathToFileURL(join(FONT_DIR, f)).href;
const BAR = readFileSync(join(VIS, "m2-bar.svg"), "utf8");
const FF = ["300","400","500"].map(w=>`@font-face{font-family:"Onest";src:url("${fontUrl(FONTS[w])}");font-weight:${w}}`).join("")
 + `@font-face{font-family:"NaN Jaune Midi";src:url("${fontUrl(FONTS.nan)}");font-weight:100 900}`;

const SKILLS = {
  "bake-the-brief":       { bg:"#0a3c14", fg:"#cfea55" },
  "responsive-preview":   { bg:"#0b2545", fg:"#8fd3ff" },
  "design-lint":          { bg:"#3d0f16", fg:"#ff8f73" },
  "adjust-logos":         { bg:"#2b1442", fg:"#d6bcff" },
  "diy-harness":          { bg:"#05332e", fg:"#7ff0c4" },
  "ghost-wireframe":      { bg:"#1d1f22", fg:"#e4e7ea" },
  "website-launch-checklist-prompt": { bg:"#3a1f08", fg:"#ffc04d" },
  "html-slide-presenter": { bg:"#3b0c34", fg:"#ff9fd8" },
};

const css = (t) => `${FF}
:root{--bg:${t.bg};--fg:${t.fg};--text:color-mix(in srgb,var(--fg) 22%,#fff);--muted:color-mix(in srgb,var(--text) 68%,transparent);
/* ghost roles — light product window on the dark brand field */
--ghost-bg:color-mix(in srgb,var(--fg) 9%,#fbfbf8);
--ghost-surface:color-mix(in srgb,var(--fg) 3%,#ffffff);
--ghost-fill:color-mix(in srgb,var(--bg) 13%,var(--ghost-bg));
--ghost-muted:color-mix(in srgb,var(--bg) 7%,var(--ghost-bg));
--ghost-ink:var(--bg);
--ghost-accent:var(--bg);
--ghost-accent-text:var(--fg);
--ghost-highlight:var(--fg);
--ghost-line:color-mix(in srgb,var(--bg) 14%,transparent);
--pass:#2a7e3b;--warn:#9e6c00;--fail:#b63e47}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;background:var(--bg);color:var(--text);font-family:Onest,sans-serif;position:relative;overflow:hidden}
.d{font-family:"NaN Jaune Midi";font-weight:500}
.left{position:absolute;left:96px;top:92px;width:540px;display:flex;flex-direction:column;gap:24px}
.title{font-size:66px;line-height:1.04;color:var(--fg)}
.sub{font-weight:300;font-size:29px;line-height:1.4;color:var(--muted)}
.pts{display:flex;flex-direction:column;gap:16px;margin-top:10px}
.pts div{display:flex;gap:14px;align-items:center;font-size:22px;line-height:1.3;color:var(--text)}
.n{flex:none;width:30px;height:30px;border-radius:50%;background:var(--fg);color:var(--bg);font-size:16px;font-weight:500;display:inline-flex;align-items:center;justify-content:center}
.pin{position:absolute;z-index:20;width:34px;height:34px;border-radius:50%;background:var(--fg);color:var(--bg);font-size:17px;font-weight:500;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px var(--bg)}
.bar{position:absolute;left:96px;top:722px;width:84px}.bar svg{width:84px;height:auto;display:block}
.cta{position:absolute;left:206px;top:748px;display:flex;flex-direction:column;gap:12px}
.k{font-size:16px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
code.cmd{font-family:ui-monospace,"DejaVu Sans Mono",monospace;font-size:19px;background:color-mix(in srgb,var(--fg) 10%,transparent);border:2px solid color-mix(in srgb,var(--fg) 28%,transparent);color:var(--fg);padding:11px 16px;border-radius:12px;align-self:flex-start;white-space:nowrap}
.then{font-size:21px;color:var(--text)}.then b{color:var(--fg);font-weight:500}
.stage{position:absolute;left:720px;top:0;width:880px;height:900px}
/* window, Aampe-reel style */
.win{position:absolute;border-radius:14px;overflow:hidden;background:var(--ghost-bg);box-shadow:0 1px 2px rgba(0,0,0,.3),0 22px 44px -18px rgba(0,0,0,.6);color:var(--ghost-ink)}
.wbar{height:34px;display:flex;align-items:center;gap:7px;padding:0 14px;background:color-mix(in srgb,var(--bg) 10%,var(--ghost-bg));font-size:14px;font-weight:500;color:color-mix(in srgb,var(--ghost-ink) 60%,transparent)}
.wbar i{width:10px;height:10px;border-radius:50%;background:color-mix(in srgb,var(--bg) 24%,var(--ghost-bg))}
.wbar span{margin-left:8px}
.wb{position:relative;padding:22px}
.phone{position:absolute;border-radius:28px;background:var(--ghost-bg);box-shadow:0 30px 80px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.2);padding:22px 16px;overflow:hidden;color:var(--ghost-ink)}
.l{height:10px;border-radius:5px;background:var(--ghost-fill)}
.l.m{background:var(--ghost-muted)}
.f{border-radius:10px;background:var(--ghost-fill)}
.f.m{background:var(--ghost-muted)}
.f.s{background:var(--ghost-surface);border:1.5px solid var(--ghost-line)}
.ink{background:var(--ghost-ink)}
.hl{background:var(--ghost-highlight)}
.col{display:flex;flex-direction:column}.row{display:flex}
.lab{font-size:14px;font-weight:500;color:color-mix(in srgb,var(--ghost-ink) 55%,transparent)}
.txt{font-size:17px;font-weight:500;color:var(--ghost-ink)}
.chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:15px;font-size:14px;font-weight:500;white-space:nowrap}
.chip.hl{color:var(--ghost-ink)}
.chip.ink{color:var(--ghost-accent-text)}
.chip.out{border:1.5px dashed color-mix(in srgb,var(--ghost-ink) 30%,transparent);color:color-mix(in srgb,var(--ghost-ink) 60%,transparent)}
.st{display:inline-flex;align-items:center;gap:7px;height:26px;font-size:14px;font-weight:500;white-space:nowrap;text-transform:capitalize}
.st::before{content:"";width:8px;height:8px;border-radius:2px}
.st.pass{color:color-mix(in srgb,var(--ghost-ink) 50%,transparent)}
.st.pass::before{background:color-mix(in srgb,var(--ghost-ink) 22%,transparent)}
.st.warn{color:var(--ghost-ink)}.st.warn::before{border:2px solid var(--ghost-ink);width:4px;height:4px}
.st.fail{color:var(--fail);font-weight:600}.st.fail::before{background:var(--fail)}
.mono{font-family:ui-monospace,"DejaVu Sans Mono",monospace}
/* lime label tags */
.tag{position:absolute;z-index:9;padding:9px 16px;border-radius:999px;background:var(--fg);color:var(--bg);font-size:18px;font-weight:500;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.3)}
.tag.o{background:var(--bg);color:var(--fg);border:1.5px solid color-mix(in srgb,var(--fg) 60%,transparent)}
`;
const win = (x,y,w,h,label,body,extra="") => `<div class="win" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${extra}"><div class="wbar"><i></i><i></i><i></i><span>${label}</span></div><div class="wb" style="height:${h-34}px">${body}</div></div>`;
const tag = (x,y,t,o="") => `<div class="tag ${o}" style="left:${x}px;top:${y}px">${t}</div>`;
const L = (ws, gap=12, m="") => `<div class="col" style="gap:${gap}px">${ws.map(w=>`<div class="l ${m}" style="width:${w}%"></div>`).join("")}</div>`;
const lock = `<svg width="12" height="14" viewBox="0 0 20 22"><rect x="1" y="9" width="18" height="12" rx="3" fill="currentColor"/><path d="M5 9V6a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="2.6" fill="none"/></svg>`;
const check = (c="var(--ghost-accent-text)") => `<svg width="12" height="10" viewBox="0 0 14 12"><path d="M1.5 6.5l3.5 3.5 7.5-8.5" stroke="${c}" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const box = (on) => `<span style="flex:none;width:20px;height:20px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;${on?'background:var(--ghost-ink)':'border:2px solid color-mix(in srgb,var(--ghost-ink) 25%,transparent)'}">${on?check():''}</span>`;
const nav = (n=3) => `<div class="row" style="justify-content:space-between;align-items:center"><div class="l" style="width:70px;height:14px;background:var(--ghost-ink);opacity:.8"></div><div class="row" style="gap:10px">${Array(n).fill('<div class="l" style="width:40px"></div>').join("")}</div></div>`;

const page = (t, { title, sub, pts, say, stage }) => `<!doctype html><html><head><meta charset="utf-8"><style>${css(t)}</style></head><body>
<div class="left"><div class="title d">${title}</div><div class="sub">${sub}</div>${pts.length?`<div class="pts">${pts.map((p,i)=>`<div><span class="n">${i+1}</span>${p}</div>`).join("")}</div>`:""}</div>
<div class="bar">${BAR.replace(/fill="#CFEA55"/i,'fill="'+t.fg+'"')}</div>
<div class="cta"><code class="cmd">npx skills@latest add iruhdam1/skills</code><div class="then">then ${say}</div></div>
<div class="stage">${stage}</div><script>
 const st=document.querySelector(".stage").getBoundingClientRect();
 document.querySelectorAll("[data-pin]").forEach(el=>{const r=el.getBoundingClientRect();const p=document.createElement("div");p.className="pin";p.textContent=el.dataset.pin;
  if(el.dataset.side==="left"){p.style.left=(r.left-st.left-46)+"px";p.style.top=(r.top-st.top+r.height/2-17)+"px";}else{p.style.left=(r.left-st.left-14)+"px";p.style.top=(r.top-st.top-14)+"px";}document.querySelector(".stage").appendChild(p);});
 </script></body></html>`;

const P = {
"bake-the-brief": { title:"Bake the brief in once", sub:"Set your context once. Every session builds on it and hands its decisions forward.",
 pts:["The brief stays pinned all session","Each idea tagged Exploring or Decided","The close-out becomes the next brief"], say:`tell your agent <b>"bake the brief"</b>`,
 stage: win(40,110,800,560,"Session 3 · agent",`<div class="row" style="gap:20px;height:100%">
   <div class="col" style="width:170px;gap:12px"><div class="lab">Sessions</div>
    ${["Session 1","Session 2"].map(s=>`<div class="f m" style="height:40px;display:flex;align-items:center;padding:0 12px"><div class="l" style="width:70%"></div></div>`).join("")}
    <div class="f hl" style="height:40px;display:flex;align-items:center;padding:0 12px"><span class="txt" style="font-size:15px">Session 3</span></div>
    <div style="margin-top:auto">${L([80,60],10,"m")}</div></div>
   <div class="col" style="flex:1;gap:16px">
    <div data-pin="1" class="f s" style="padding:16px 18px;border:2px solid var(--ghost-ink)"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px"><span class="txt">Brief</span><span class="chip ink">${lock} 3 locked</span></div>
     ${["Problem","User","Constraints"].map((k,i)=>`<div class="row" style="gap:14px;align-items:center;margin-top:8px"><span class="lab" style="width:110px">${k}</span><div class="l" style="width:${[60,48,54][i]}%"></div></div>`).join("")}</div>
    <div class="row" style="gap:12px"><div class="f m" style="width:62%;height:62px;padding:14px">${L([90,60],10)}</div></div>
    <div class="row" style="gap:12px;justify-content:flex-end"><div class="f" style="width:58%;padding:14px">${L([85,70],10,"m")}<div data-side="left" data-pin="2" class="row" style="gap:8px;margin-top:12px"><span class="chip out">Exploring</span><span class="chip hl">Decided</span></div></div></div>
    <div class="f s" style="margin-top:auto;height:46px;display:flex;align-items:center;padding:0 16px"><div class="l m" style="width:40%"></div></div>
   </div></div>`)
  + `<div data-pin="3" class="win" style="left:500px;top:530px;width:340px;height:300px"><div class="wbar"><i></i><i></i><i></i><span>close-out.md</span></div><div class="wb col" style="gap:12px"><span class="txt">Close-out · Oct 5</span>${["Locked","Explored","Open"].map((k,i)=>`<div class="row" style="gap:10px;align-items:center">${box(i===0)}<span class="lab" style="width:80px">${k}</span><div class="l" style="flex:1;max-width:${[70,55,45][i]}%"></div></div>`).join("")}<div class="f hl" style="margin-top:6px;height:40px;display:flex;align-items:center;justify-content:center"><span class="txt" style="font-size:15px">Paste into next session</span></div></div></div>` },

"responsive-preview": { title:"See it at every width", sub:"Labeled screenshots at mobile, tablet and desktop, plus a pass / warn / fail report.",
 pts:["Screenshots at 390, 820 and 1280","Flags what breaks, like an overlapping nav","Pass, warn or fail for each width"], say:`run <b>/responsive-preview</b>`,
 stage: win(60,90,780,520,"localhost:3000 · Desktop 1280 · pass",`${nav(4)}<div class="f" style="height:120px;margin-top:20px;padding:24px">${L([50,35],14,"m")}</div><div class="row" style="gap:14px;margin-top:16px">${Array(3).fill('<div class="f m" style="flex:1;height:150px"></div>').join("")}</div>`)
  + `<div data-pin="3" class="win" style="left:250px;top:390px;width:340px;height:400px"><div class="wbar"><i></i><i></i><i></i><span>Tablet 820 · pass</span></div><div class="wb col" style="gap:12px">${nav(2)}<div class="f" style="height:80px"></div><div class="row" style="gap:10px"><div class="f m" style="flex:1;height:90px"></div><div class="f m" style="flex:1;height:90px"></div></div>${L([80,60],10)}</div></div>`
  + `<div data-pin="1" class="phone" style="left:40px;top:330px;width:190px;height:400px"><div class="row" style="justify-content:space-between"><div class="l" style="width:50px;height:14px;background:var(--ghost-ink);opacity:.8"></div><div data-pin="2" style="width:40px;height:14px;border-radius:4px;background:color-mix(in srgb,var(--fail) 40%,transparent);outline:2px dashed var(--fail);outline-offset:3px"></div></div><div class="f" style="height:90px;margin-top:18px"></div><div class="f m" style="height:70px;margin-top:12px"></div><div class="f m" style="height:70px;margin-top:12px"></div></div>` },

"design-lint": { title:"ESLint for design", sub:"Static checks first, then a judged visual pass at three widths, reported as findings.",
 pts:["Catches layout bugs, like an empty column","Findings ranked by severity","A verdict on what to fix before shipping"], say:`run <b>/design-lint</b>`,
 stage: win(40,90,800,620,"design-lint · pricing page",`<div class="row" style="gap:22px;height:100%">
   <div class="col" style="width:250px;gap:10px;align-items:center"><div class="lab">390 · before</div>
    <div class="f s" style="position:relative;width:230px;height:470px;border-radius:22px;padding:16px;display:flex;gap:10px">
     <div data-pin="1" style="width:60px;border-radius:8px;border:2px dashed var(--fail);background:color-mix(in srgb,var(--fail) 8%,transparent)"></div>
     <div class="col" style="flex:1;gap:10px;margin-right:-40px">${Array(5).fill('<div class="f" style="height:70px"></div>').join("")}</div>
     <div style="position:absolute;right:0;top:0;bottom:0;width:4px;background:var(--fail)"></div></div></div>
   <div class="col" style="flex:1;gap:0"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px"><span data-side="left" data-pin="2" class="txt">Findings</span><span class="lab">6 checks</span></div>
    ${[["ghost-column","390","fail"],["raw px in spacing","all","warn"],["text under 13px","390","warn"],["contrast AA","all","pass"],["focus states","all","pass"],["touch targets","390","pass"]].map(([c,v,s])=>`<div class="row" style="gap:12px;align-items:center;padding:13px 0;border-top:1.5px solid var(--ghost-line)"><span class="txt" style="flex:1;font-size:16px">${c}</span><span class="lab" style="width:40px">${v}</span><span class="st ${s}" style="width:58px;justify-content:center">${s}</span></div>`).join("")}
    <div data-side="left" data-pin="3" style="margin-top:auto;padding-top:14px;border-top:1.5px solid var(--ghost-ink)"><span class="lab">Verdict</span><div class="txt" style="font-size:16px;margin-top:6px">Fix the ghost column, then ship</div></div></div></div>`) },

"adjust-logos": { title:"Align logos by eye", sub:"Same height isn't the same size. Tune each logo optically, inside a fixed band.",
 pts:["The band height stays fixed","Each logo gets its own nudge","Every nudge is commented, so agents keep it"], say:`tell your agent <b>"adjust the logos"</b>`,
 stage: win(40,90,800,500,"Landing page · client strip",`${nav(3)}<div class="col" style="align-items:center;gap:14px;margin-top:40px"><div class="l" style="width:46%;height:22px;background:var(--ghost-ink);opacity:.85"></div><div class="l" style="width:34%;height:22px;background:var(--ghost-ink);opacity:.85"></div><div class="l m" style="width:40%;margin-top:6px"></div><div class="chip ink" style="margin-top:10px">Get started</div></div>
   <div data-pin="1" style="position:relative;margin-top:56px;height:70px;border-top:2px dashed var(--ghost-highlight);border-bottom:2px dashed var(--ghost-highlight);background:color-mix(in srgb,var(--fg) 16%,transparent);display:flex;align-items:center;justify-content:space-around">
    <div class="ink" style="width:40px;height:40px;border-radius:7px"></div>
    <div class="row" style="gap:6px">${Array(3).fill('<div style="width:22px;height:22px;border:3px solid var(--ghost-ink);border-radius:3px"></div>').join("")}</div>
    <div style="width:50px;height:50px;border:4px solid var(--ghost-ink);border-radius:50%"></div>
    <div data-pin="2" class="col" style="align-items:center;transform:translateY(-4px)"><div class="ink" style="width:64px;height:28px;border-radius:4px"></div><div class="ink" style="width:10px;height:12px"></div></div>
    <div class="ink" style="width:130px;height:20px;border-radius:4px"></div>
    <span class="lab" style="position:absolute;right:8px;top:-26px;color:var(--ghost-ink)">band · 20px</span>
   </div>`)
  + `<div data-pin="3" class="win" style="left:350px;top:510px;width:480px;height:270px;background:#15151a;color:#e8e8e8"><div class="wbar" style="background:#222228;color:#9a9aa3"><i style="background:#3a3a44"></i><i style="background:#3a3a44"></i><i style="background:#3a3a44"></i><span>logos.css</span></div><div class="wb mono" style="font-size:17px;line-height:1.7">
   <div>.logo-row__mark--acme {</div><div style="padding-left:24px">height: <span style="color:var(--fg)">19px</span>;</div><div style="padding-left:24px">transform: translateY(<span style="color:var(--fg)">-0.5px</span>);</div><div style="padding-left:24px;color:#8b8b95">/* thin wordmark reads small */</div><div>}</div></div></div>` },

"diy-harness": { title:"Set up your own harness", sub:"Score how ready your project is for agents, then set up only what you pick.",
 pts:["A readiness score from 0 to 1","You pick the tasks","Sets up only what you picked, then checks it"], say:`run <b>/diy-harness</b>`,
 stage: win(40,90,700,580,"diy-harness · Turn A report",`<div class="row" style="gap:24px">
   <div data-pin="1" class="f s" style="width:300px;padding:22px"><span class="lab">Readiness</span><div class="d" style="font-size:72px;line-height:1.1;margin-top:8px;color:var(--ghost-ink)">0.42</div><div class="txt" style="margin-top:2px">Forming</div>
    <div class="row" style="gap:4px;margin-top:22px;height:12px">${[18,34,60].map(p=>`<div style="flex:1;border-radius:4px;background:color-mix(in srgb,var(--ghost-ink) ${p}%,transparent)"></div>`).join("")}</div>
    <div class="row" style="justify-content:space-between;margin-top:8px"><span class="lab" style="font-size:11px">Scattered</span><span class="lab" style="font-size:11px">Organized</span></div></div>
   <div class="col" style="flex:1;gap:10px"><div class="lab">Gaps found</div><div style="margin-top:6px">${L([90,72,84,60,70],20)}</div></div></div>
   <div data-side="left" data-pin="2" class="lab" style="margin-top:26px;margin-bottom:10px">Pick tasks</div>
   ${[[1,"1  Shared tokens file"],[0,"2  Layout contract"],[1,"3  Ship checklist"],[0,"4  Weekly drift check"]].map(([on,l])=>`<div class="row" style="gap:12px;align-items:center;padding:11px 0;border-top:1.5px solid var(--ghost-line)">${box(on)}<span class="txt" style="font-size:16px;${on?'':'opacity:.55'}">${l}</span></div>`).join("")}`)
  + `<div data-pin="3" class="win" style="left:580px;top:440px;width:260px;height:230px"><div class="wbar"><i></i><i></i><i></i><span>Turn B · setup</span></div><div class="wb col" style="gap:12px">${["tokens.css","ship.md"].map(f=>`<div class="row" style="gap:10px;align-items:center"><span class="mono txt" style="font-size:15px;flex:1">${f}</span><span class="lab">new</span></div>`).join("")}<div class="row" style="gap:10px;align-items:center;margin-top:6px">${box(1)}<span class="txt" style="font-size:15px">Verified</span></div></div></div>` },

"ghost-wireframe": { title:"Ghost wireframes", sub:"Skeleton UI for landing-page product shots and loading states, from one set of colour roles.",
 pts:["Five layouts, from dashboard to settings","A mobile companion for each","Swap the --ghost-* roles to re-theme"], say:`tell your agent <b>"ghost wireframe"</b>`,
 stage: win(40,90,800,560,"Dashboard · desktop",`<div class="row" style="gap:20px;height:100%"><div data-pin="1" class="col" style="width:150px;gap:14px"><div class="l" style="width:70%;height:14px;background:var(--ghost-ink);opacity:.8"></div>${L([80,65,75,55,70],18)}</div>
   <div class="col" style="flex:1;gap:16px">${nav(3)}<div class="row" style="gap:14px">${[1,0,0].map(h=>`<div class="f ${h?'hl':'s'}" style="flex:1;height:96px;padding:16px">${L([50,80],12)}</div>`).join("")}</div>
   <div class="f s" style="flex:1;padding:18px;display:flex;align-items:flex-end;gap:14px">${[40,65,50,80,58,90,70].map(h=>`<div class="f" style="flex:1;height:${h}%"></div>`).join("")}</div></div></div>`)
  + `<div data-pin="2" class="phone" style="left:620px;top:380px;width:200px;height:400px"><div class="l" style="width:60px;height:12px;margin:0 auto;background:var(--ghost-ink);opacity:.8"></div><div class="f hl" style="height:80px;margin-top:16px"></div><div style="margin-top:16px">${L([90,70,85,55],14)}</div><div class="f ink" style="height:40px;margin-top:40px"></div></div>`
  + `<div data-pin="3" class="win" style="left:80px;top:600px;width:470px;height:170px"><div class="wbar"><i></i><i></i><i></i><span>--ghost-* roles</span></div><div class="wb row" style="gap:14px;align-items:center">${[["bg","var(--ghost-bg)"],["surface","var(--ghost-surface)"],["fill","var(--ghost-fill)"],["muted","var(--ghost-muted)"],["ink","var(--ghost-ink)"],["highlight","var(--ghost-highlight)"]].map(([n,c])=>`<div class="col" style="gap:8px;align-items:center"><span style="width:46px;height:46px;border-radius:10px;background:${c};border:1.5px solid var(--ghost-line)"></span><span class="mono" style="font-size:12px">${n}</span></div>`).join("")}</div></div>`
  },

"website-launch-checklist-prompt": { title:"Ready to launch?", sub:"A pre-launch audit: score every area, fix the gaps, copy the snippets.",
 pts:["A launch-readiness score","Every area checked, from SEO to legal","Ready-to-paste files, like /llms.txt"], say:`tell your agent <b>"launch checklist"</b>`,
 stage: win(40,90,800,600,"Launch audit · yoursite.com",`<div class="row" style="gap:24px;align-items:center;margin-bottom:18px">
   <div data-pin="1" style="width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--ghost-ink) 0 72%,var(--ghost-fill) 72% 100%);display:flex;align-items:center;justify-content:center"><div style="width:92px;height:92px;border-radius:50%;background:var(--ghost-bg);display:flex;align-items:center;justify-content:center" class="d"><span style="font-size:36px">72</span></div></div>
   <div class="col" style="gap:10px;flex:1"><span class="txt">Launch readiness</span>${L([70,45],10,"m")}</div></div>
   ${[["Technical SEO","pass"],["Social cards","warn"],["Agent readiness","fail"],["AEO · /llms.txt","fail"],["Analytics","pass"],["Legal","pass"]].map(([c,s])=>`<div ${c==="Social cards"?'data-side="left" data-pin="2"':""} class="row" style="gap:14px;align-items:center;padding:12px 0;border-top:1.5px solid var(--ghost-line)"><span class="txt" style="width:200px;font-size:16px">${c}</span><div class="l m" style="flex:1;max-width:280px"></div><span style="flex:1"></span><span class="st ${s}" style="width:58px;justify-content:center">${s}</span></div>`).join("")}`)
  + `<div data-pin="3" class="win" style="left:460px;top:560px;width:380px;height:230px;background:#15151a;color:#e8e8e8"><div class="wbar" style="background:#222228;color:#9a9aa3"><i style="background:#3a3a44"></i><i style="background:#3a3a44"></i><i style="background:#3a3a44"></i><span>llms.txt</span></div><div class="wb mono" style="font-size:16px;line-height:1.75"><div style="color:var(--fg)"># Your Site</div><div style="color:#8b8b95">&gt; What it is, in one line</div><div>## Pages</div><div>- [Pricing](/pricing)</div></div></div>`
  },

"html-slide-presenter": { title:"Present from one HTML file", sub:"A self-contained deck with speaker notes built in. Your phone becomes the remote.",
 pts:["One self-contained HTML file","Speaker notes live inside it","Your phone is the remote"], say:`ask for <b>"an HTML slide deck"</b>`,
 stage: win(40,110,760,540,"deck.html",`<div data-pin="1" class="f s" style="height:400px;padding:44px 48px;display:flex;flex-direction:column;gap:20px"><div class="l" style="width:62%;height:30px;background:var(--ghost-ink);opacity:.85"></div><div class="l" style="width:40%;height:30px;background:var(--ghost-ink);opacity:.85"></div><div style="margin-top:20px">${L([80,66,74],18,"m")}</div><div class="row" style="gap:12px;margin-top:auto"><div class="f hl" style="width:120px;height:60px"></div><div class="f" style="width:120px;height:60px"></div></div></div>
   <div class="row" style="justify-content:space-between;align-items:center;margin-top:16px"><span class="lab">← → keyboard</span><span class="lab">2 / 12</span></div>`)
  + `<div class="phone" style="left:620px;top:330px;width:220px;height:450px"><span data-side="left" data-pin="2" class="txt" style="font-size:15px">Speaker notes</span><div style="margin-top:16px">${L([90,80,95,60,85,70,50],14)}</div><div data-side="left" data-pin="3" class="row" style="gap:10px;position:absolute;left:16px;right:16px;bottom:22px"><span class="chip out" style="flex:1;justify-content:center">Prev</span><span class="chip ink" style="flex:1;justify-content:center">Next</span></div></div>` },
};

// hero: field of mini ghost windows, one per skill colour
const hero = () => {
 const t = SKILLS["bake-the-brief"];
 const PKG = readFileSync(join(VIS, "package-fill.svg"), "utf8").replace('fill="currentColor"', 'fill="currentColor" width="132" height="132"');
 const short = {"website-launch-checklist-prompt":"launch-checklist"};
 // Phosphor package-fill, one per skill in its own accent; no tile behind the icon
 const pkgs = Object.keys(SKILLS).map((k,i)=>{ const c=SKILLS[k]; const x=20+(i%4)*210, y=150+Math.floor(i/4)*280+(i%2?50:0);
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:190px;display:flex;flex-direction:column;align-items:center;gap:14px"><span style="color:${c.fg};display:block;line-height:0">${PKG}</span><span style="font-size:19px;font-weight:500;color:var(--text);white-space:nowrap">${short[k]||k}</span></div>`;}).join("");
 return page(t,{title:"Skills for designers who build",sub:"Eight agent skills for designers who ship with AI. One install command.",pts:[],say:`call any skill by name`,stage:pkgs});
};

const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const tmp = mkdtempSync(join(tmpdir(), "skill-visuals-"));
const pg = await b.newPage({ viewport:{width:1600,height:900}, deviceScaleFactor:2 });
const only = process.argv[2];
const jobs = [...Object.keys(SKILLS).map(k=>[k,page(SKILLS[k],P[k])]),["hero",hero()]];
for (const [k,html] of jobs) { if (only && k!==only) continue;
  const htmlPath = join(tmp, `${k}.html`);
  writeFileSync(htmlPath, html);
  await pg.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" }); await pg.evaluate(() => document.fonts.ready);
  const out = k === "hero" ? join(ROOT, "assets/hero.png") : join(ROOT, "skills", k, "visual.png");
  await pg.screenshot({ path: out });
  console.log("wrote", out.replace(ROOT + "/", "")); }
rmSync(tmp, { recursive: true, force: true });
await b.close();
