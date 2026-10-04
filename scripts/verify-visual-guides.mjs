import fs from 'node:fs';
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

const component = fs.readFileSync(new URL('../components/VisualGuide.jsx', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const requiredComponentTokens = [
  'tech-foundations', 'tech-computing', 'tech-process-map', 'tech-hbm', 'tech-industry-map',
  'transistor-structure', 'wafer-cross-section', 'hbm-3d-stack', 'ecosystem-node'
];
for (const token of requiredComponentTokens) if (!component.includes(token)) errors.push(`Missing premium visual component token: ${token}`);
for (const token of ['.visual-guide-premium .premium-board', '.tech-foundations', '.tech-computing', '.tech-hbm', '.tech-industry-map']) {
  if (!css.includes(token)) errors.push(`Missing premium visual CSS: ${token}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${visualGuides.length} premium visual guides, all concept links and technical layouts valid.`);
