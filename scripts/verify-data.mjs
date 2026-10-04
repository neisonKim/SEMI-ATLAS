import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { concepts, sources } from '../lib/data.mjs';
import manifest from '../lib/image-manifest.json' with { type: 'json' };

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const ids = new Set(concepts.map((concept) => concept.id));
const files = new Set(manifest.map((item) => item.file));

assert.equal(concepts.length, 30);
for (const concept of concepts) {
  for (const relation of [...concept.prerequisites, ...concept.related, ...concept.next]) assert(ids.has(relation), `${concept.id}: ${relation}`);
  for (const ref of concept.refs) assert(sources[ref], `${concept.id}: source ${ref}`);
  assert.equal(typeof concept.what, 'string', `${concept.id}: what`);
  assert(concept.what.length > 20, `${concept.id}: what too short`);
  assert.equal(concept.structureLabels.length, 3, `${concept.id}: structure labels`);
  assert.equal(typeof concept.industry, 'string', `${concept.id}: industry`);
  assert(concept.industry.length > 20, `${concept.id}: industry too short`);
  assert.match(concept.updatedAt, /^\d{4}-\d{2}-\d{2}$/, `${concept.id}: updatedAt`);
  assert(['Draft','Reviewed','Published','Needs Update'].includes(concept.status), `${concept.id}: status`);
  const item = manifest.find((entry) => entry.file.replace(/\.(webp|svg)$/i, '') === concept.image);
  assert(item, `${concept.id}: image manifest ${concept.image}`);
  assert(fs.existsSync(path.join(root, 'public', 'assets', item.file)), `${concept.id}: image ${item.file}`);
}
for (const file of files) assert(fs.existsSync(path.join(root, 'public', 'assets', file)), file);
console.log(`PASS: ${concepts.length} concepts, all relations, sources and ${files.size} image assets.`);
