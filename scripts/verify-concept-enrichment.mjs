import assert from 'node:assert/strict';
import { concepts, sources, byId } from '../lib/data.mjs';
import { conceptEnrichment, enrichmentSources } from '../lib/concept-enrichment.mjs';

assert.deepEqual(Object.keys(conceptEnrichment).sort(), concepts.map(c => c.id).sort(), 'Every concept must have enrichment, without orphan entries.');
const analogyTitles = new Set();
const claims = new Set();
const operations = {
  multiply: ([a, b]) => a * b,
  divide: ([a, b]) => a / b,
  power: ([a, b]) => a ** b,
  squareRatio: ([a, b]) => (a / b) ** 2,
  percent: ([a, b]) => a / b * 100,
  scaledRatio: ([a, b, scale]) => a / b * scale,
  decreasePercent: ([before, after]) => (before - after) / before * 100,
};
let factCount = 0;
let exampleCount = 0;
for (const concept of concepts) {
  const context = concept.id;
  const { analogy, numbers, misconceptions, structureDescriptions } = concept;
  assert(analogy.title.length > 8 && analogy.body.length > 65 && analogy.limit.length > 20, `${context}: analogy needs an explanation and limits.`);
  assert(!analogyTitles.has(analogy.title), `${context}: reused analogy`);
  analogyTitles.add(analogy.title);
  assert.equal(structureDescriptions.length, concept.structureLabels.length, `${context}: structure labels need matching explanations.`);
  assert(structureDescriptions.every(text => text.length > 20), `${context}: bare structure label`);
  assert.equal(misconceptions.length, 1, `${context}: expected one focused misconception`);
  for (const item of misconceptions) {
    assert(item.claim.length > 15 && item.correction.length > 50, `${context}: incomplete correction`);
    assert(!claims.has(item.claim), `${context}: repeated misconception`);
    claims.add(item.claim);
  }
  assert.equal(numbers.length, 2, `${context}: expected two meaningful numeric explanations`);
  for (const number of numbers) {
    assert(['fact', 'example'].includes(number.kind), `${context}: unclassified number`);
    assert(/\d/.test(number.value), `${context}: value missing`);
    assert(number.label.length > 5 && number.meaning.length > 25 && number.scope.length > 30, `${context}: value without meaning or conditions`);
    assert(sources[number.source], `${context}: unknown source ${number.source}`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(number.checkedAt), `${context}: missing source check date`);
    if (number.kind === 'example') {
      exampleCount++;
      const { operation, operands, result } = number.calculation ?? {};
      assert(number.formula?.length > 5 && operations[operation], `${context}: calculation must be explicit`);
      assert(operands.every(Number.isFinite) && Number.isFinite(result), `${context}: nonnumeric operands`);
      const calculated = operations[operation](operands);
      assert(Math.abs(calculated - result) <= Math.max(1, Math.abs(result)) * 1e-12, `${context}: incorrect calculation ${number.formula}`);
    } else {
      factCount++;
      assert(!number.calculation && !number.formula, `${context}: assumed calculation presented as a sourced fact`);
    }
  }
}
// Guard common unit/generation mistakes in the learning material.
assert.equal(byId.hbm.numbers[0].value, '1,024 bit');
assert.match(byId.hbm.numbers[0].scope, /HBM3/);
assert.equal(byId.hbm.numbers[1].calculation.result, 819.2);
assert.match(byId.hbm.numbers[1].scope, /십진/);
assert.match(byId['euv-duv'].numbers[1].scope, /실제 길이가 아닙니다/);
assert.match(byId.dram.numbers[1].scope, /8 bit = 1 byte/);
assert.match(byId.foundry.numbers[0].scope, /2024.*12인치/);
for (const [key, source] of Object.entries(enrichmentSources)) {
  assert(concepts.some(c => c.numbers.some(n => n.source === key)), `Unused enrichment source: ${key}`);
  assert.equal(new URL(source[1]).protocol, 'https:');
}
console.log(`Enrichment PASS: ${concepts.length} analogies + limits, ${claims.size} misconceptions, ${concepts.length * 3} structure explanations, ${factCount} sourced values, ${exampleCount} checked calculations.`);
