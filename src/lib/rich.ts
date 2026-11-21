/* Content strings may carry two bits of inline markup and nothing else:
     **bold**            and            [link text](/site/path/)
   Everything else is escaped. Links get the base path, and outside links open
   in a new tab. */

import { href, isExternal } from './paths';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function rich(text: string): string {
  let out = escape(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, target: string) => {
    const url = target.replace(/&amp;/g, '&');
    const attrs = isExternal(url) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${escape(href(url))}"${attrs}>${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return phone(out);
}

/** The phone number is always something a thumb can tap: link any bare mention. */
export function phone(html: string): string {
  return html.replace(/(<a\b[\s\S]*?<\/a>)|\(810\) 990-3040/g, (m, a) => a ?? '<a href="tel:+18109903040" data-loc="copy">(810) 990-3040</a>');
}

/** Plain text for meta descriptions and schema: markup stripped. */
export function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** A heading as HTML: escaped, a ** phrase set as the accent, and hyphenated
    words wrapped so they never break at the hyphen. */
const TOWNS = /\b(Grand Blanc(?: Township)?|Flint Township|Mundy Township|Swartz Creek|Atlas Township|Independence Township|Brandon Township|Holly Township|Davison Township|Fenton Township)\b/g;
/** Keep a town's name on one line. */
export const nbTown = (s: string) => s.replace(TOWNS, (m) => m.replace(/ /g, '\u00a0')).replace(/, MI\b/g, ',\u00a0MI');

export function heading(text: string, accentClass = ''): string {
  let out = nbTown(escape(text)).replace(/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)+)/g, '<span class="nw">$1</span>');
  // Punctuation right after the accent goes inside it: the accent is an inline block, so a
  // comma left outside could wrap onto the next line by itself.
  out = out.replace(/\*\*([^*]+)\*\*([,.;:!?]*)/g, accentClass ? `<span class="${accentClass}">$1$2</span>` : '$1$2');
  // Short sentences in a display line keep their beat: lines break between them where they can.
  const parts = out.split(/(?<=[.?!](?:<\/span>)?)\s+(?![^<]*<\/span>)/);
  return parts.length > 1 ? parts.map((p) => `<span class="sent">${p}</span>`).join(' ') : out;
}
