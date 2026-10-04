import { readFile } from 'node:fs/promises';
import { concepts } from '../lib/data.mjs';
import { siteUrl } from '../lib/site-config.mjs';

const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
const expectedCount = 7 + concepts.length;
const locCount = (sitemap.match(/<loc>/g) || []).length;

const problems = [];
if (!/^https?:\/\//.test(siteUrl)) problems.push('SITE URL must be absolute.');
if (locCount !== expectedCount) problems.push(`sitemap URL count ${locCount} != ${expectedCount}`);
if (!sitemap.includes(`<loc>${siteUrl}/</loc>`)) problems.push('sitemap home URL mismatch');
if (!sitemap.includes(`<loc>${siteUrl}/concept/hbm/</loc>`)) problems.push('sitemap concept URL mismatch');
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) problems.push('robots sitemap URL mismatch');
for (const concept of concepts) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(concept.updatedAt || '')) {
    problems.push(`${concept.id}: invalid updatedAt`);
  }
}

if (problems.length) {
  console.error('SEO verification failed:');
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exit(1);
}

console.log(`SEO verification PASS · ${expectedCount} sitemap URLs · ${siteUrl}`);
