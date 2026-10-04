import { byId } from '../lib/data.mjs';
import { visualGuides } from '../lib/visual-guides.mjs';

const errors = [];
if (visualGuides.length !== 5) errors.push(`Expected 5 visual guides, got ${visualGuides.length}`);

for (const guide of visualGuides) {
  if (!guide.id || !guide.title || !guide.type || !guide.nodes?.length) {
    errors.push(`Guide ${guide.id ?? '(missing id)'} is missing required fields`);
  }
  for (const node of guide.nodes ?? []) {
    if (node.concept && !byId[node.concept]) errors.push(`${guide.id}: unknown node concept ${node.concept}`);
  }
  for (const id of guide.related ?? []) {
    if (!byId[id]) errors.push(`${guide.id}: unknown related concept ${id}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${visualGuides.length} visual guides, all concept links valid.`);
