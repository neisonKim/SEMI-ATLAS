import assert from 'node:assert/strict';
import { byId, categories, concepts, getLearningNavigation } from '../lib/data.mjs';

const templateQuestions = new Set(['먼저 무엇을 알고 보면 좋나요?', '다음에는 무엇을 공부하면 좋나요?']);
const questions = new Set();
let prerequisiteCount = 0;
for (const [index, concept] of concepts.entries()) {
  assert.equal(concept.num, index + 1, `${concept.id}: curriculum numbering`);
  const { previous, next } = getLearningNavigation(concept.id);
  assert.equal(previous?.id, concepts[index - 1]?.id, `${concept.id}: previous lesson`);
  assert.equal(next?.id, concepts[index + 1]?.id, `${concept.id}: next lesson`);
  assert.deepEqual(concept.next, next ? [next.id] : [], `${concept.id}: next relation differs from curriculum`);
  assert.equal(concept.status, 'Published', `${concept.id}: unsupported review status`);
  assert(!templateQuestions.has(concept.question), `${concept.id}: navigation FAQ`);
  assert(!questions.has(concept.question), `${concept.id}: duplicate FAQ`);
  questions.add(concept.question);
  assert(concept.answer?.trim().length > 15, `${concept.id}: missing FAQ answer`);
  const category = categories.find(item => item.id === concept.category);
  assert(category && concept.num >= category.range[0] && concept.num <= category.range[1], `${concept.id}: category range`);
  for (const field of ['prerequisites', 'related', 'next']) {
    assert.equal(new Set(concept[field]).size, concept[field].length, `${concept.id}: duplicate ${field}`);
    for (const id of concept[field]) assert(byId[id] && id !== concept.id, `${concept.id}: invalid ${field} ${id}`);
  }
  for (const id of concept.prerequisites) {
    assert(byId[id].num < concept.num, `${concept.id}: prerequisite ${id} appears later in the beginner curriculum`);
    prerequisiteCount++;
  }
}
assert.equal(getLearningNavigation('not-a-concept'), null);
console.log(`Content quality PASS: ${concepts.length} unique FAQs, ${concepts.length - 1} reversible curriculum steps, ${prerequisiteCount} earlier prerequisites.`);
