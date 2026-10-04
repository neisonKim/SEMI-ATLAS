import { concepts } from '../lib/data.mjs';
import { industryHub } from '../lib/industry-hub.mjs';

const byId = Object.fromEntries(concepts.map((concept) => [concept.id, concept]));
const expectedStageIds = ['eda-ip', 'fabless', 'foundry', 'equipment-materials', 'osat-packaging', 'system'];
const actualStageIds = industryHub.stages.map((stage) => stage.id);
const missingStages = expectedStageIds.filter((id) => !actualStageIds.includes(id));
const extraStages = actualStageIds.filter((id) => !expectedStageIds.includes(id));

if (industryHub.stages.length !== expectedStageIds.length || missingStages.length || extraStages.length) {
  console.error('Industry Hub stage verification failed', { missingStages, extraStages, actualStageIds });
  process.exit(1);
}

const conceptStageErrors = industryHub.stages
  .filter((stage) => stage.concept)
  .filter((stage) => !byId[stage.concept])
  .map((stage) => stage.concept);

if (conceptStageErrors.length) {
  console.error('Industry Hub contains unknown concept links', conceptStageErrors);
  process.exit(1);
}

const expectedLearningPath = [
  { number: 28, id: 'ecosystem' },
  { number: 29, id: 'fabless' },
  { number: 30, id: 'foundry' },
];

for (let index = 0; index < expectedLearningPath.length; index += 1) {
  const expected = expectedLearningPath[index];
  const actual = industryHub.learningPath[index];
  if (!actual || actual.number !== expected.number || actual.id !== expected.id) {
    console.error('Industry learning path order mismatch', { index, expected, actual });
    process.exit(1);
  }
  if (!byId[actual.id] || byId[actual.id].num !== actual.number) {
    console.error('Industry learning path concept mismatch', { actual, concept: byId[actual.id] });
    process.exit(1);
  }
}

const supportStage = industryHub.stages.find((stage) => stage.id === 'equipment-materials');
if (!supportStage?.support) {
  console.error('Equipment / Materials must be marked as a support layer.');
  process.exit(1);
}

console.log(`✓ Industry Hub: ${industryHub.stages.length} role stages`);
console.log('✓ Core role flow: EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System');
console.log('✓ MVP industry learning path: 28 Ecosystem → 29 Fabless → 30 Foundry');
console.log('✓ Equipment / Materials is explicitly marked as a cross-stage support layer');
