import { concepts } from '../lib/data.mjs';
import { processHub } from '../lib/process-hub.mjs';

const processConcepts = concepts.filter((concept) => concept.num >= 12 && concept.num <= 22);
const expectedIds = processConcepts.map((concept) => concept.id);
const actualIds = processHub.concepts.map((concept) => concept.id);
const missing = expectedIds.filter((id) => !actualIds.includes(id));
const extra = actualIds.filter((id) => !expectedIds.includes(id));
const familyIds = new Set(processHub.families.flatMap((family) => family.concepts));
const ungrouped = expectedIds.filter((id) => !familyIds.has(id));

if (processHub.concepts.length !== 11 || missing.length || extra.length || ungrouped.length) {
  console.error('Process Hub verification failed', { missing, extra, ungrouped, count: processHub.concepts.length });
  process.exit(1);
}

for (let i = 0; i < processHub.concepts.length; i += 1) {
  const expectedNum = 12 + i;
  if (processHub.concepts[i].num !== expectedNum) {
    console.error(`Process Hub order mismatch at index ${i}: expected ${expectedNum}, got ${processHub.concepts[i].num}`);
    process.exit(1);
  }
}

console.log(`✓ Process Hub: ${processHub.concepts.length} concepts (12–22)`);
console.log(`✓ Process families: ${processHub.families.length}, all process concepts grouped`);
console.log('✓ Fabrication → Oxidation → Lithography → EUV/DUV → Etching → Deposition → CVD → ALD → Ion Implantation → CMP → Cleaning');
