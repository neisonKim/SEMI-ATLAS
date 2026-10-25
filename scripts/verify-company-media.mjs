import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { companies } from '../lib/companies.mjs';
import { companyMedia, companyMediaCheckedAt } from '../lib/company-media.mjs';

assert.equal(Object.getPrototypeOf(companyMedia), null);
assert.deepEqual(Object.keys(companyMedia).sort(), companies.map(c => c.id).sort());
assert.equal(companyMediaCheckedAt, '2026-10-25');
const seen = new Set();
let totalBytes = 0;
for (const company of companies) {
  const media = companyMedia[company.id];
  assert.deepEqual(Object.keys(media).sort(), ['image', 'logo']);
  for (const [kind, asset] of Object.entries(media)) {
    assert(asset.src.startsWith(`/assets/companies/${company.id}/${kind}.`));
    assert(!asset.src.includes('..') && !seen.has(asset.src));
    seen.add(asset.src);
    for (const key of ['sourceUrl', 'assetUrl']) assert.equal(new URL(asset[key]).protocol, 'https:');
    assert.equal(asset.checkedAt, companyMediaCheckedAt);
    assert(Number.isInteger(asset.width) && asset.width > 0 && Number.isInteger(asset.height) && asset.height > 0);
    assert(asset.credit && ['official', 'public-logo', 'public-commons'].includes(asset.origin));
    const bytes = await readFile(new URL('../public' + asset.src, import.meta.url));
    assert.equal(bytes.length, asset.bytes, `${company.id} ${kind}: file size changed`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `${company.id} ${kind}: original bytes changed`);
    totalBytes += bytes.length;
    if (asset.contentType === 'image/svg+xml') {
      const svg = bytes.toString('utf8');
      assert(svg.includes('<svg'));
      assert(!/<script\b|<foreignObject\b|\son[a-z]+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|javascript:|data:(?!image\/(?:png|jpeg|webp);base64,))/i.test(svg), 'SVG must contain no active or external content');
      if (asset.symbolId) {
        assert.equal(company.id, 'asml');
        assert(svg.includes('<symbol id="logo"') && svg.includes('viewBox="0 0 108 30"'));
      }
    } else if (asset.contentType === 'image/png') {
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(bytes.readUInt32BE(16), asset.width);
      assert.equal(bytes.readUInt32BE(20), asset.height);
    } else if (asset.contentType === 'image/webp') {
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    } else {
      assert.equal(asset.contentType, 'image/jpeg');
      assert.equal(bytes.subarray(0, 2).toString('hex'), 'ffd8');
    }
    if (kind === 'logo') assert(['light', 'dark'].includes(asset.tone));
    else {
      assert(asset.alt.length >= 12 && asset.caption.length >= 12);
      if (asset.origin === 'public-commons') {
        assert(['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY 4.0', 'Public domain'].includes(asset.license));
        assert(asset.licenseUrl.startsWith('https://creativecommons.org/') || asset.licenseUrl.startsWith('https://commons.wikimedia.org/wiki/File:'));
      }
    }
  }
}
assert(companyMedia.synopsys.image.caption.includes('2009'));
assert(companyMedia.tsmc.image.caption.includes('2020'));
assert.equal(seen.size, companies.length * 2);
assert.equal(seen.size, 100);
assert(totalBytes < 25_000_000, 'Keep all 100 company source assets under 25 MB; displayed photos use responsive image delivery.');
console.log(`Company media PASS: ${companies.length} companies, ${seen.size} original assets, ${totalBytes} bytes; SHA-256, MIME, local paths, attribution, licenses and safe SVG checked.`);
