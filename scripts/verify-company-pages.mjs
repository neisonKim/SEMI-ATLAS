import assert from 'node:assert/strict';
import { concepts } from '../lib/data.mjs';
import { companies, companySources, getCompaniesForConcept } from '../lib/companies.mjs';
import { createHash } from 'node:crypto';
import { companyMedia } from '../lib/company-media.mjs';
import { siteUrl } from '../lib/site-config.mjs';
const base = new URL(process.argv[2] || 'http://127.0.0.1:3101');
assert(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Verify a local preview.');
const decode = value => value.replaceAll('&amp;', '&');
const read = async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
};
function section(html, id) {
  const text = html.match(new RegExp(`<section(?=[^>]*\\bid="${id}")[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
  assert(text, `Missing section ${id}`);
  return text;
}
const directory = await read('/companies/');
assert.equal((directory.match(/class="company-card"/g) || []).length, companies.length);
assert(directory.includes('id="company-search"') && directory.includes('기업 역할 선택'));
assert(directory.includes(`rel="canonical" href="${siteUrl}/companies/"`));
const pages = new Map();
for (const company of companies) {
  const html = await read(`/company/${company.id}/`);
  pages.set(company.id, html);
  for (const id of ['company-media', 'role', 'analogy', 'technologies', 'concepts', 'distinction', 'references']) section(html, id);
  const media = companyMedia[company.id];
  const gallery = decode(section(html, 'company-media'));
  assert(gallery.includes(media.image.src) && gallery.includes(media.image.alt) && gallery.includes(media.image.caption));
  assert(gallery.includes(media.image.sourceUrl) && gallery.includes(media.image.credit));
  assert(gallery.includes(media.logo.sourceUrl) && gallery.includes('로고 출처'));
  if (media.image.license) assert(gallery.includes(media.image.licenseUrl) && gallery.includes(media.image.license));
  assert(html.includes('property="og:image"') && html.includes(siteUrl + media.image.src));
  assert(html.includes(`data-company-logo="${company.id}"`));
  assert(directory.includes(media.image.src) && directory.includes(`data-company-logo="${company.id}"`));
  for (const asset of Object.values(media)) {
    const response = await fetch(new URL(asset.src, base));
    assert.equal(response.status, 200, asset.src);
    assert(response.headers.get('content-type').startsWith(asset.contentType), asset.src);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, asset.src);
  }
  const relatedConcepts = section(html, 'concepts');
  const hrefs = [...relatedConcepts.matchAll(/href="(\/concept\/[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(hrefs, company.concepts.map(c => `/concept/${c.id}/`), `${company.id}: concept links missing or duplicated`);
  for (const connection of company.concepts) assert(relatedConcepts.includes(connection.reason));
  for (const source of company.refs) assert(decode(section(html, 'references')).includes(companySources[source][1]), `${company.id}: primary source missing`);
  assert(html.includes(`rel="canonical" href="${siteUrl}/company/${company.id}/"`));
  assert(html.includes('"@type":"BreadcrumbList"') && html.includes('"@type":"Article"'));
  assert(html.includes('href="/companies/"') && html.includes('aria-current="page">기업 사전'));
}
for (const concept of concepts) {
  const html = await read(`/concept/${concept.id}/`);
  const relatedCompanies = section(html, 'companies');
  const hrefs = [...relatedCompanies.matchAll(/href="(\/company\/[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(hrefs, getCompaniesForConcept(concept.id).map(({ company }) => `/company/${company.id}/`), `${concept.id}: reverse company connections missing or duplicated`);
  for (const { company, connection } of getCompaniesForConcept(concept.id)) {
    assert(relatedCompanies.includes(connection.reason));
    assert(relatedCompanies.includes(`data-company-logo="${company.id}"`));
    assert(pages.get(company.id).includes(`/concept/${concept.id}/`));
  }
}
const industry = await read('/industry/');
assert(industry.includes('역할별 기업 예시'));
for (const company of companies) assert(industry.includes(`/company/${company.id}/`), `${company.id}: missing industry entry`);
for (const route of ['/company/not-a-company/', '/company/toString/', '/company/constructor/']) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 404, `Unknown company should return 404: ${route}`);
}
const delivery = [];
for (const id of ['shin-etsu', 'marvell']) {
  const asset = companyMedia[id].image;
  const imageUrl = new URL('/_next/image/', base);
  imageUrl.search = new URLSearchParams({ url: asset.src, w: '640', q: '75' }).toString();
  const response = await fetch(imageUrl, { headers: { Accept: 'image/webp' } });
  assert.equal(response.status, 200, `${id}: responsive image route`);
  assert(response.headers.get('content-type').startsWith('image/'));
  const bytes = (await response.arrayBuffer()).byteLength;
  assert(bytes > 100 && bytes < asset.bytes / 2, `${id}: optimized delivery should reduce large source images`);
  delivery.push({ company: id, originalBytes: asset.bytes, deliveredBytes: bytes });
}
console.log('Responsive image delivery PASS:', JSON.stringify(delivery));
console.log(`Company pages PASS: directory + ${companies.length} profiles + ${concepts.length} reverse concept sections + industry entries, ${companies.length * 2} original media assets, visible credits/licenses, logos on reverse connections, canonical/structured metadata and unknown-route 404.`);
