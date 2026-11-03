import assert from 'node:assert/strict';
import { concepts } from '../lib/data.mjs';
import { buildConceptIndex } from '../lib/concept-index.mjs';
import { searchConcepts, suggestConcepts } from '../lib/search.mjs';
import { searchIndex } from '../lib/search-index.mjs';
import { readSearchFilters, searchUnified, suggestUnified, unifiedSearchUrl } from '../lib/unified-search.mjs';

const first = (query, options = {}) => searchConcepts(concepts, { query, ...options })[0]?.id;
for (const [query, expected] of [
  ['웨이퍼', 'wafer'],
  ['wafer', 'wafer'],
  ['파운드리', 'foundry'],
  ['FOUNDRY', 'foundry'],
  ['ＨＢＭ', 'hbm'],
  ['h b m', 'hbm'],
  ['트랜지스터', 'transistor'],
  ['반도체란', 'semiconductor'],
]) assert.equal(first(query), expected, query);

assert.deepEqual(searchConcepts(concepts, { category: 'basics' }).map((c) => c.id), ['semiconductor','conductors','silicon','wafer','transistor']);
assert.deepEqual(searchConcepts(concepts, { category: 'packaging', level: '3' }).map((c) => c.id), ['rdl','tsv','interposer','integration','chiplet']);
assert.deepEqual(searchConcepts(concepts, { category: 'packaging', level: '2' }).map((c) => c.id), ['hbm']);
assert.equal(searchConcepts(concepts, { query: '없는개념x739' }).length, 0);
assert.equal(searchConcepts(concepts).length, concepts.length);
const hbmSuggestions = suggestConcepts(concepts, { query: 'HB', limit: 5 });
assert.equal(hbmSuggestions[0]?.concept.id, 'hbm');
assert.equal(hbmSuggestions.length, 5);
assert.ok(hbmSuggestions.slice(1).some((item) => ['dram','tsv','interposer','gpu','integration'].includes(item.concept.id)));
assert.equal(suggestConcepts(concepts, { query: '', limit: 5 }).length, 0);
assert.ok(suggestConcepts(concepts, { query: '노광', limit: 5 }).some((item) => item.concept.id === 'lithography'));
console.log('PASS: Korean/English aliases, filters, empty results and 5-item connected autocomplete.');

assert.equal(searchIndex.length, 90);
assert.equal(new Set(searchIndex.map(item => item.key)).size, 90);
assert.equal(searchUnified(searchIndex).length, 90);
assert.equal(searchUnified(searchIndex, { kind: 'concept' }).length, concepts.length);
assert.equal(searchUnified(searchIndex, { kind: 'company' }).length, 50);
for (const item of searchIndex) {
  for (const query of [item.title, item.en, item.id]) {
    assert.equal(searchUnified(searchIndex, { query })[0]?.key, item.key, query);
  }
  assert.equal(item.href, `/${item.kind === 'concept' ? 'concept' : 'company'}/${item.id}/`);
}
for (const [query, key] of [
  ['ＨＢＭ', 'concept:hbm'], ['h b m', 'concept:hbm'],
  ['엔비디아', 'company:nvidia'], ['스냅드래곤', 'company:qualcomm'],
  ['SNAPDRAGON', 'company:qualcomm'], ['CoWoS', 'company:tsmc'],
  ['마이크론', 'company:micron'], ['SK hynix', 'company:sk-hynix'],
  ['samsung hbm', 'company:samsung'], ['삼성 HBM', 'company:samsung'],
]) assert.equal(searchUnified(searchIndex, { query })[0]?.key, key, query);
const unifiedHbm = searchUnified(searchIndex, { query: 'HBM' });
assert.equal(unifiedHbm[0]?.key, 'concept:hbm');
for (const id of ['samsung', 'sk-hynix', 'micron']) {
  assert(unifiedHbm.some(item => item.key === `company:${id}`));
  assert(suggestUnified(searchIndex, { query: 'HBM' }).some(item => item.key === `company:${id}`));
}
assert(searchUnified(searchIndex, { query: 'HBM', kind: 'company' }).every(item => item.kind === 'company'));
for (const query of ['없는결과x739', '?!()']) assert.deepEqual(searchUnified(searchIndex, { query }), []);
for (const query of ['', '  ', '?!()']) assert.deepEqual(suggestUnified(searchIndex, { query }), []);
assert.deepEqual(suggestUnified(searchIndex, { query: 'HBM', limit: 0 }), []);
for (const query of ['반도체', '웨이퍼', 'HBM', '노광']) {
  const results = suggestUnified(searchIndex, { query });
  assert(results.length <= 6);
  assert.equal(new Set(results.map(item => item.key)).size, results.length);
  assert(results.some(item => item.kind === 'concept'));
  assert(results.some(item => item.kind === 'company'));
}
const filters = { query: '삼성 HBM & <chip>', kind: 'company' };
assert.deepEqual(readSearchFilters(new URL(unifiedSearchUrl(filters), 'http://localhost').search), filters);
assert.deepEqual(readSearchFilters('?kind=constructor'), { query: '', kind: 'all' });
assert.equal(readSearchFilters(`?q=${'a'.repeat(201)}`).query.length, 200);
assert.equal(unifiedSearchUrl({ query: '  ', kind: 'invalid' }), '/search/');
assert(searchIndex.every(item => !('refs' in item) && !('technologies' in item) && !('sections' in item)));
assert(Buffer.byteLength(JSON.stringify(searchIndex)) < 150000, 'Search records stay compact.');
console.log('PASS: 90 unified results, all 270 identities, product/technology aliases, mixed suggestions, kind filters, safe URL round trip, empty/invalid inputs.');

for (const language of ['ko', 'en']) {
  const groups = buildConceptIndex(concepts, language);
  const entries = groups.flatMap(group => group.entries);
  assert.equal(new Set(entries.map(entry => entry.concept.id)).size, concepts.length);
  assert.equal(new Set(groups.map(group => group.id)).size, groups.length);
  assert.equal(groups[0].label, '0–9');
  assert(groups.every(group => group.entries.length > 0));
  if (language === 'ko') assert.equal(entries.length, concepts.length);
  assert.deepEqual(buildConceptIndex([], language), []);
}

for (const [language, initial, name, id] of [
  ['ko', 'ㅈ', '재배선층', 'rdl'],
  ['ko', 'ㅈ', '전자설계자동화', 'eda'],
  ['ko', 'ㅍ', '핀펫', 'finfet'],
  ['en', 'R', 'RDL', 'rdl'],
  ['en', 'E', 'EDA', 'eda'],
  ['en', 'D', 'DUV', 'euv-duv'],
  ['en', 'E', 'EUV', 'euv-duv'],
]) {
  const filtered = searchConcepts(concepts, { query: id === 'rdl' ? 'RDL' : '' });
  const group = buildConceptIndex(filtered, language).find(item => item.label === initial);
  assert(group?.entries.some(entry => entry.name === name && entry.concept.id === id), name);
}
const filtered = searchConcepts(concepts, { query: 'RDL', category: 'packaging', level: '3' });
assert.deepEqual(buildConceptIndex(filtered, 'ko').flatMap(group => group.entries.map(entry => entry.concept.id)), ['rdl']);
console.log('Index PASS: all 40 concepts in both modes, name and acronym placement, stable numeric group and combined filters.');
