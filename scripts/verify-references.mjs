import { concepts, sources } from '../lib/data.mjs';

const errors = [];
const sourceEntries = Object.entries(sources);
for (const [key, value] of sourceEntries) {
  if (!Array.isArray(value) || value.length < 3) errors.push(`Source ${key} must be [title, url, type]`);
  const [title, url, type] = value || [];
  if (!title || !type) errors.push(`Source ${key} missing title/type`);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') errors.push(`Source ${key} must use https`);
  } catch { errors.push(`Source ${key} has invalid URL`); }
}

for (const concept of concepts) {
  if (!Array.isArray(concept.refs) || concept.refs.length < 2 || concept.refs.length > 4) {
    errors.push(`${concept.id}: expected 2-4 references, got ${concept.refs?.length ?? 0}`);
    continue;
  }
  const unique = new Set(concept.refs);
  if (unique.size !== concept.refs.length) errors.push(`${concept.id}: duplicate reference keys`);
  for (const key of concept.refs) if (!sources[key]) errors.push(`${concept.id}: unknown source ${key}`);
}

if (errors.length) {
  console.error('Reference verification FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const totalLinks = concepts.reduce((sum, concept) => sum + concept.refs.length, 0);
const counts = concepts.map((concept) => concept.refs.length);
console.log(`Reference verification PASS: ${concepts.length} concepts, ${sourceEntries.length} source records, ${totalLinks} concept-source links, ${Math.min(...counts)}-${Math.max(...counts)} refs/concept.`);
