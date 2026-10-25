import assert from 'node:assert/strict';
import { concepts, byId } from '../lib/data.mjs';
import { companies, companyById, companyCountries, companyRelationKinds, companySources, companyStages, getCompaniesForConcept, getRelatedCompanies } from '../lib/companies.mjs';
import { companyFilterUrl, readCompanyFilters, searchCompanies } from '../lib/company-search.mjs';

assert.equal(companies.length, 50, 'Expanded directory contains fifty researched profiles.');
assert.equal(companyCountries.length, 10, 'Ten headquarters country/region filters.');
assert.equal(new Set(companies.map(c => c.id)).size, companies.length);
assert.equal(companyStages.length, 8);
for (const field of ['summary', 'role', 'analogy', 'distinction']) assert.equal(new Set(companies.map(c => c[field])).size, companies.length, `Unique company ${field} explanations required.`);
const validStages = new Set(companyStages.map(stage => stage.id));
const validCountries = new Set(companyCountries.map(country => country.id));
let connections = 0;
for (const company of companies) {
  assert(/^[a-z][a-z0-9-]*$/.test(company.id), `Unsafe company slug: ${company.id}`);
  assert(company.name && company.en && company.aliases.length, `${company.id}: missing identity`);
  assert(company.summary.length > 25 && company.role.length > 60 && company.analogy.length > 40 && company.distinction.length > 50, `${company.id}: incomplete beginner explanation`);
  assert(validCountries.has(company.country));
  assert(company.stages.length && company.stages.every(id => validStages.has(id)));
  assert.equal(company.stages.length, new Set(company.stages).size);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(company.checkedAt));
  assert.equal(new URL(company.website).protocol, 'https:');
  assert(company.refs.length >= 2 && new Set(company.refs).size === company.refs.length, `${company.id}: sources required`);
  for (const id of company.refs) assert(companySources[id], `${company.id}: unknown source ${id}`);
  for (const technology of company.technologies) {
    assert(technology.name && technology.description.length > 20);
    assert(company.refs.includes(technology.source), `${company.id}: technology evidence missing from references`);
  }
  assert(company.concepts.length >= 2);
  assert.equal(company.concepts.length, new Set(company.concepts.map(c => c.id)).size);
  for (const connection of company.concepts) {
    assert(byId[connection.id], `${company.id}: unknown concept ${connection.id}`);
    assert(companyRelationKinds[connection.kind] && connection.reason.length > 20);
    assert(getCompaniesForConcept(connection.id).some(item => item.company.id === company.id && item.connection.reason === connection.reason), `${company.id}: missing reverse relationship`);
    connections++;
  }
  for (const item of getRelatedCompanies(company.id)) {
    assert(item.company.id !== company.id && item.shared.length > 0);
    for (const id of item.shared) assert(company.concepts.some(c => c.id === id) && item.company.concepts.some(c => c.id === id));
  }
}
for (const concept of concepts) assert(getCompaniesForConcept(concept.id).length > 0, `No company learning example for ${concept.id}`);
for (const stage of companyStages) assert(companies.some(company => company.stages.includes(stage.id)), `Unrepresented role: ${stage.id}`);
for (const [id, [title, url, type]] of Object.entries(companySources)) {
  assert(title && type && new URL(url).protocol === 'https:');
  assert(new URL(url).pathname !== '/', `${id}: evidence should be a topic page`);
  assert(companies.some(company => company.refs.includes(id)), `Unused company source: ${id}`);
}
const ids = options => searchCompanies(companies, options).map(c => c.id).sort();
assert.deepEqual(ids({ query: '엔비디아' }), ['nvidia']);
assert.deepEqual(ids({ query: 'sK HYniX' }), ['sk-hynix']);
assert.deepEqual(ids({ query: '어플라이드머티어리얼즈' }), ['applied-materials']);
assert.deepEqual(ids({ query: 'CoWoS' }), ['tsmc']);
assert.deepEqual(ids({ stage: 'memory', country: 'KR', concept: 'hbm' }), ['samsung', 'sk-hynix']);
assert.deepEqual(ids({ stage: 'equipment', country: 'US' }), ['applied-materials', 'kla', 'lam-research', 'teradyne']);
assert.deepEqual(ids({ stage: 'memory', country: 'JP' }), ['kioxia']);
assert.deepEqual(ids({ query: '스냅드래곤' }), ['qualcomm']);
assert.deepEqual(ids({ query: '버추오소' }), ['cadence']);
assert.deepEqual(ids({ stage: 'foundry', country: 'CN' }), ['smic']);
assert.deepEqual(ids({ stage: 'materials', country: 'DE' }), ['siltronic']);
assert.deepEqual(ids({ stage: 'eda-ip', country: 'GB' }), ['arm']);
assert.deepEqual(ids({ stage: 'memory', country: 'US', concept: 'hbm' }), ['micron']);
assert.deepEqual(ids({ stage: 'memory', country: 'NL' }), []);
assert.deepEqual(ids({ query: '없는기업xyz' }), []);
assert.deepEqual(ids({ query: '   ' }), companies.map(c => c.id).sort());
assert(companyById.samsung.stages.includes('foundry') && companyById.samsung.stages.includes('memory'));
const filters = { query: 'SK 하이닉스', stage: 'memory', country: 'KR', concept: 'hbm' };
assert.deepEqual(readCompanyFilters(new URL(companyFilterUrl(filters), 'https://example.com').search), filters);
assert.deepEqual(readCompanyFilters('?stage=unknown&country=unknown&concept=unknown'), { query: '', stage: 'all', country: 'all', concept: 'all' });
assert.equal(readCompanyFilters(`?q=${'a'.repeat(201)}`).query.length, 200);
assert.deepEqual(getCompaniesForConcept('missing'), []);
assert.deepEqual(getRelatedCompanies('missing'), []);
assert.deepEqual(getRelatedCompanies('constructor'), []);
assert.equal(companyById.toString, undefined);
console.log(`Companies PASS: ${companies.length} profiles, ${companyStages.length} roles, ${connections} bidirectional learning relations across ${concepts.length} concepts, aliases, intersecting filters and URL restoration.`);
