import { mkdir, writeFile } from 'node:fs/promises';
import { concepts } from '../lib/data.mjs';
import { siteUrl } from '../lib/site-config.mjs';

const staticRoutes = [
  '/',
  '/encyclopedia/',
  '/learn/',
  '/process/',
  '/packaging/',
  '/industry/',
  '/visual/',
];

const conceptDates = concepts.map((concept) => concept.updatedAt).filter(Boolean);
const latestConceptDate = conceptDates.sort().at(-1) || new Date().toISOString().slice(0, 10);
const entries = [
  ...staticRoutes.map((route) => ({ route, lastModified: latestConceptDate })),
  ...concepts.map((concept) => ({ route: `/concept/${concept.id}/`, lastModified: concept.updatedAt || latestConceptDate })),
];

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
  .map(
    ({ route, lastModified }) => `  <url>\n    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>\n    <lastmod>${escapeXml(lastModified)}</lastmod>\n  </url>`,
  )
  .join('\n')}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap, 'utf8');
await writeFile(new URL('../public/robots.txt', import.meta.url), robots, 'utf8');

console.log(`Generated static robots.txt and sitemap.xml (${entries.length} URLs) for ${siteUrl}.`);
