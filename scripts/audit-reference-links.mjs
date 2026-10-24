import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { sources } from '../lib/data.mjs';
import { enrichmentSources } from '../lib/concept-enrichment.mjs';
import { companySources } from '../lib/companies.mjs';

// Network restrictions are inconclusive, not evidence that a source is valid or broken.
const output = resolve(process.argv[2] || 'reports/reference-link-audit.json');
if (process.argv.includes('--companies') && process.argv.includes('--enrichment')) throw new Error('Choose one source catalog per audit.');
const catalog = process.argv.includes('--companies') ? companySources : process.argv.includes('--enrichment') ? enrichmentSources : { ...sources, ...Object.fromEntries(Object.entries(companySources).map(([id, value]) => [`company_${id}`, value])) };
const entries = Object.entries(catalog);
const results = new Array(entries.length);
let cursor = 0;

async function inspect([id, [label, url]]) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'SEMI-ATLAS-reference-audit/1.0', Accept: 'text/html,application/pdf' },
    });
    const finalUrl = response.url;
    let title = '';
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('html')) {
      const html = await response.text();
      title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
    } else {
      await response.body?.cancel();
    }
    const blocked = [401, 403, 408, 429].includes(response.status) || response.status >= 500;
    const softError = /page not found|404 not found|access denied|request rejected|just a moment/i.test(title);
    const homepage = new URL(finalUrl).pathname.replace(/\/+$/, '') === '';
    const status = blocked ? 'unverified'
      : !response.ok || softError ? 'broken'
        : homepage ? 'generic'
          : 'ok';
    return { id, label, url, finalUrl, httpStatus: response.status, title, status };
  } catch (error) {
    return { id, label, url, status: 'unverified', error: error.cause?.code || error.message };
  }
}

await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < entries.length) {
    const index = cursor++;
    results[index] = await inspect(entries[index]);
    console.log(`${results[index].status.padEnd(10)} ${results[index].id}: ${results[index].httpStatus || results[index].error}`);
  }
}));

const counts = Object.fromEntries(['ok', 'broken', 'generic', 'unverified'].map(status => [status, results.filter(row => row.status === status).length]));
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ checkedAt: new Date().toISOString(), counts, results }, null, 2) + '\n');
console.log(JSON.stringify({ counts, output }));
if (counts.broken || counts.generic || counts.unverified) process.exitCode = 1;
