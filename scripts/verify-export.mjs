import { access, readFile, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { concepts } from '../lib/data.mjs';
import { siteUrl } from '../lib/site-config.mjs';

const outUrl = new URL('../out/', import.meta.url);
const outPath = decodeURIComponent(outUrl.pathname);

const requiredFiles = [
  'index.html',
  'encyclopedia/index.html',
  'learn/index.html',
  'process/index.html',
  'packaging/index.html',
  'industry/index.html',
  'visual/index.html',
  'robots.txt',
  'sitemap.xml',
  '404.html',
  ...concepts.map((concept) => `concept/${concept.id}/index.html`),
];

const missing = [];
for (const relativePath of requiredFiles) {
  try {
    await access(new URL(relativePath, outUrl), constants.R_OK);
    const info = await stat(new URL(relativePath, outUrl));
    if (!info.isFile() || info.size === 0) missing.push(`${relativePath} (empty)`);
  } catch {
    missing.push(relativePath);
  }
}

if (missing.length) {
  console.error(`Export verification FAIL · ${missing.length} missing/empty files`);
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const sitemap = await readFile(new URL('sitemap.xml', outUrl), 'utf8');
const robots = await readFile(new URL('robots.txt', outUrl), 'utf8');
const htmlFiles = requiredFiles.filter((file) => file.endsWith('.html'));

const expectedRoutes = [
  '/', '/encyclopedia/', '/learn/', '/process/', '/packaging/', '/industry/', '/visual/',
  ...concepts.map((concept) => `/concept/${concept.id}/`),
];
const missingSitemap = expectedRoutes.filter((route) => !sitemap.includes(`${siteUrl}${route}`));
if (missingSitemap.length) {
  console.error('Export verification FAIL · sitemap routes missing');
  for (const route of missingSitemap) console.error(`- ${route}`);
  process.exit(1);
}
if (!robots.includes(`${siteUrl}/sitemap.xml`)) {
  console.error('Export verification FAIL · robots.txt sitemap URL mismatch');
  process.exit(1);
}

for (const relativePath of htmlFiles) {
  const html = await readFile(new URL(relativePath, outUrl), 'utf8');
  if (!html.includes('<html') || !html.includes('</html>')) {
    console.error(`Export verification FAIL · malformed HTML: ${relativePath}`);
    process.exit(1);
  }
}

console.log(`Export verification PASS · ${htmlFiles.length} HTML files + robots/sitemap · ${siteUrl}`);
console.log(`Output: ${outPath}`);
