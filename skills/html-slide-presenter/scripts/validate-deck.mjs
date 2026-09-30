#!/usr/bin/env node
/** Dependency-free static checks. Does not execute HTML or certify safety/compatibility. */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Read every quoted or unquoted attribute. This is a conservative static scan,
// not HTML error recovery or JavaScript evaluation.
function attributes(text) {
  const attrs = new Map();
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of text.matchAll(pattern)) {
    const key = match[1].toLowerCase();
    if (!attrs.has(key)) attrs.set(key, match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attrs;
}
const hasClass = (attrs, name) => (attrs.get('class') || '').split(/\s+/).includes(name);
const embedded = value => /^(?:data:|#)/i.test(value.trim());
function srcsetUrls(value) {
  // HTML srcset URL tokens may contain commas (notably data URLs).
  const urls = [];
  let rest = value;
  while (rest.trim()) {
    rest = rest.replace(/^[\s,]+/, '');
    if (!rest) break;
    const token = rest.match(/^\S+/)[0];
    rest = rest.slice(token.length);
    const url = token.replace(/,+$/, '');
    urls.push(url);
    if (!token.endsWith(',')) {
      const comma = rest.indexOf(',');
      rest = comma < 0 ? '' : rest.slice(comma + 1);
    }
  }
  return urls;
}

export function validateDeck(source, byteLength = Buffer.byteLength(source, 'utf8')) {
  const errors = [];
  const warnings = [];
  if (!source.trim()) errors.push('The file is empty.');
  if (byteLength > 2097152) errors.push(`File is ${byteLength} bytes; maximum is 2097152.`);
  const markup = source.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of ['html', 'head', 'body']) {
    if (!new RegExp(`<${tag}\\b`, 'i').test(markup) || !new RegExp(`</${tag}\\s*>`, 'i').test(markup)) errors.push(`Missing complete <${tag}> element.`);
  }
  if (!/<meta\b[^>]*charset\s*=\s*["']?utf-8/i.test(markup)) warnings.push('Declare UTF-8 encoding with <meta charset="utf-8">.');
  const scripts = [...markup.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^'">])*)>([\s\S]*?)<\/script\s*>/gi)];
  let jsonCount = 0;
  const runtime = [];
  for (const [, rawAttrs, body] of scripts) {
    const attrs = attributes(rawAttrs);
    if (attrs.has('src')) errors.push('External script dependency found; inline the runtime.');
    if (hasClass(attrs, 'slide-notes')) {
      jsonCount++;
      if ((attrs.get('type') || '').toLowerCase() !== 'application/json') errors.push('slide-notes must use type="application/json".');
      try {
        const notes = JSON.parse(body);
        if (!notes || Array.isArray(notes) || typeof notes !== 'object') throw new Error('expected an object');
        if (typeof notes.title !== 'string' || typeof notes.script !== 'string' || !Array.isArray(notes.notes) || notes.notes.some(n => typeof n !== 'string')) throw new Error('expected title/script strings and notes string array');
        if (notes.title.length > 200 || notes.script.length > 6000 || notes.notes.length > 20 || notes.notes.some(n => n.length > 500)) warnings.push('Notes exceed the recommended phone-reading budget.');
      } catch (error) { errors.push(`Invalid slide-notes JSON: ${error.message}`); }
    } else if (!/^(application\/(?:ld\+)?json)$/i.test(attrs.get('type') || '')) runtime.push(body);
  }
  const withoutScripts = markup.replace(/<script\b(?:"[^"]*"|'[^']*'|[^'">])*>[\s\S]*?<\/script\s*>/gi, '');
  const tags = [...withoutScripts.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)].map(([,tag,attrs]) => ({tag:tag.toLowerCase(),attrs:attributes(attrs)}));
  let slides = 0;
  let asideCount = 0;
  for (const {tag,attrs} of tags) {
    if (hasClass(attrs,'slide') || attrs.has('data-slide')) slides++;
    if (tag === 'aside' && hasClass(attrs,'notes')) asideCount++;
    if (tag === 'link' && (attrs.get('rel') || '').split(/\s+/).some(v => ['stylesheet','preload','modulepreload'].includes(v.toLowerCase()))) errors.push('Linked stylesheet/preload found; embed essential dependencies.');
    if (['img','source','video','audio','iframe','embed','object','input'].includes(tag)) {
      for (const attr of ['src','poster','data']) if (attrs.has(attr) && !embedded(attrs.get(attr))) errors.push(`Non-embedded ${tag} ${attr} dependency found.`);
      if (attrs.has('srcset')) for (const url of srcsetUrls(attrs.get('srcset'))) if (!embedded(url)) errors.push('Non-embedded srcset dependency found.');
    }
  }
  if (/@import\s/i.test(withoutScripts)) errors.push('CSS @import found; inline styles.');
  for (const [,url] of withoutScripts.matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) if (!embedded(url)) errors.push('Non-embedded CSS asset found.');
  if (/\b(?:fetch\s*\(|XMLHttpRequest|WebSocket\s*\(|import\s*\()/i.test(runtime.join('\n'))) errors.push('Network or dynamic-module runtime found; use a self-contained runtime.');
  if (!slides) errors.push('No .slide or [data-slide] elements found.');
  const notesCount = jsonCount + asideCount;
  if (notesCount < slides) warnings.push(`${slides} slides and ${notesCount} note blocks found; check missing notes and per-slide placement.`);
  if (asideCount && !/aside\.notes\s*\{[^}]*display\s*:\s*none/i.test(source)) warnings.push('Add aside.notes { display: none !important; } to hide plain-text notes.');
  if (!/goToSlide/.test(source)) warnings.push('No goToSlide hook found; manually verify bridge compatibility.');
  if (!/ArrowRight/.test(source) || !/ArrowLeft/.test(source) || !/Home/.test(source)) warnings.push('Verify previous/next/Home keyboard navigation.');
  return { bytes: byteLength, slides, noteBlocks: notesCount, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node validate-deck.mjs deck.html'); process.exitCode = 2; }
  else {
    try {
      const bytes = readFileSync(file);
      const result = validateDeck(bytes.toString('utf8'), bytes.length);
      console.log(JSON.stringify({ file, ...result, next: 'Open in a browser with networking disabled; check every slide, controls, notes and layout.' }, null, 2));
      process.exitCode = result.errors.length ? 1 : 0;
    } catch (error) { console.error(error.message); process.exitCode = 2; }
  }
}
