/* After `astro build`, before the house rules: set real typographer's quotes and
   ellipses in the text of every page. Content is written with straight quotes
   (Rob's, "Ask Rob"), and the browser shows them straight, which reads as unfinished
   next to the display type.

   Only text between tags changes. Scripts, styles, JSON-LD, code, form fields and
   every attribute (alt, aria-label, href) are left exactly as they are. A quote is
   opened or closed by what comes before it, carried across inline tags, so
   “<span>quoted</span>” still pairs up. */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

const SKIP = /^<(script|style|textarea|code|pre|title|template)\b/i;
const OPENS = /[\s(\[{‘“ /]$/; // a quote after these opens

function setText(text, prev) {
  let out = '';
  for (const ch of text.replace(/\.\.\./g, '…')) {
    const before = out ? out.slice(-1) : prev;
    if (ch === "'") out += !before || OPENS.test(before) ? '‘' : '’';
    else if (ch === '"') out += !before || OPENS.test(before) ? '“' : '”';
    else out += ch;
  }
  return out;
}

function typeset(html) {
  const parts = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/);
  let skip = null;
  let prev = ' ';
  let changed = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (p.startsWith('<')) {
      if (skip) { if (new RegExp(`^</${skip}\\b`, 'i').test(p)) skip = null; continue; }
      const m = p.match(SKIP);
      if (m && !p.endsWith('/>')) skip = m[1];
      if (/^<(p|li|h[1-6]|div|section|td|th|figcaption|blockquote|br|dd|dt|label|button|option)\b/i.test(p) || /^<\/(p|li|h[1-6]|div|section|td|th|figcaption|blockquote|dd|dt|label|button|option)>/i.test(p)) prev = ' ';
      continue;
    }
    if (skip) continue;
    const decoded = p.replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;|&#34;|&#x22;/g, '"');
    if (!/['".]/.test(decoded)) { if (p.trim()) prev = p.slice(-1); continue; }
    const set = setText(decoded, prev);
    if (set !== decoded || decoded !== p) { parts[i] = set; changed++; }
    if (set.trim()) prev = set.slice(-1);
  }
  return { html: parts.join(''), changed };
}

let pages = 0;
for (const f of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const src = readFileSync(f, 'utf8');
  const { html, changed } = typeset(src);
  if (changed) { writeFileSync(f, html); pages++; }
}
console.log(`typeset: curly quotes and ellipses on ${pages} pages`);
