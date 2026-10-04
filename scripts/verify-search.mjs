import assert from 'node:assert/strict';
import { concepts } from '../lib/data.mjs';
import { searchConcepts, suggestConcepts } from '../lib/search.mjs';

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
assert.deepEqual(searchConcepts(concepts, { category: 'packaging', level: '3' }).map((c) => c.id), ['tsv','interposer','integration']);
assert.deepEqual(searchConcepts(concepts, { category: 'packaging', level: '2' }).map((c) => c.id), ['hbm']);
assert.equal(searchConcepts(concepts, { query: '없는개념x739' }).length, 0);
assert.equal(searchConcepts(concepts).length, 30);
const hbmSuggestions = suggestConcepts(concepts, { query: 'HB', limit: 5 });
assert.equal(hbmSuggestions[0]?.concept.id, 'hbm');
assert.equal(hbmSuggestions.length, 5);
assert.ok(hbmSuggestions.slice(1).some((item) => ['dram','tsv','interposer','gpu','integration'].includes(item.concept.id)));
assert.equal(suggestConcepts(concepts, { query: '', limit: 5 }).length, 0);
assert.ok(suggestConcepts(concepts, { query: '노광', limit: 5 }).some((item) => item.concept.id === 'lithography'));
console.log('PASS: Korean/English aliases, filters, empty results and 5-item connected autocomplete.');
