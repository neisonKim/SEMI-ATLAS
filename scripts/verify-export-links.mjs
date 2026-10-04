import { readdir, readFile, stat } from 'node:fs/promises';
import { concepts } from '../lib/data.mjs';

const outUrl = new URL('../out/', import.meta.url);
const routeSet = new Set([
  '/', '/encyclopedia/', '/learn/', '/process/', '/packaging/', '/industry/', '/visual/',
  ...concepts.map((concept) => `/concept/${concept.id}/`),
]);

async function walk(url, relative = '') {
  const entries = await readdir(url, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, url);
    const childRelative = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await walk(child, childRelative));
    else if (entry.name.endsWith('.html')) result.push({ url: child, relative: childRelative });
  }
  return result;
}

function normalizeInternalHref(raw) {
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) return null;
  const withoutHash = raw.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  if (!withoutQuery) return null;
  if (!withoutQuery.startsWith('/')) return null;
  if (/\.[a-z0-9]{2,6}$/i.test(withoutQuery)) return null;
  return withoutQuery.endsWith('/') ? withoutQuery : `${withoutQuery}/`;
}

const htmlFiles = await walk(outUrl);
const broken = [];
for (const file of htmlFiles) {
  const html = await readFile(file.url, 'utf8');
  const hrefs = [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    const normalized = normalizeInternalHref(href);
    if (normalized && !routeSet.has(normalized)) {
      broken.push(`${file.relative} → ${href}`);
    }
  }
}

if (broken.length) {
  console.error(`Internal-link verification FAIL · ${broken.length} unresolved routes`);
  for (const item of [...new Set(broken)]) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Internal-link verification PASS · ${htmlFiles.length} exported HTML files checked.`);
