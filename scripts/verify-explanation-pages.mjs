import assert from 'node:assert/strict';
import { concepts, sources } from '../lib/data.mjs';
import { conceptExplanations, explanationSources } from '../lib/concept-explanations.mjs';
const base = new URL(process.argv[2] || 'http://127.0.0.1:3102');
assert(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname));
const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
for (const concept of concepts) {
  const response = await fetch(new URL(`/concept/${concept.id}/`,base)); assert.equal(response.status,200);
  const html = await response.text(); const data=conceptExplanations[concept.id];
  for (const [mode, level] of Object.entries(data.levels)) {
    assert(html.includes(`id="explain-${mode}"`) && html.includes(`aria-controls="explain-${mode}"`));
    assert(html.includes(esc(level.title)));
    for (const paragraph of level.paragraphs) assert(html.includes(esc(paragraph)));
  }
  assert.equal((html.match(/role="tabpanel"/g)||[]).length,3);
  assert(html.includes('id="concept-diagram"') && html.includes(esc(data.diagram.alt)) && html.includes(esc(data.diagram.scope)));
  assert(html.includes(`href="${data.diagram.src}"`));
  for (const key of data.diagram.refs) assert(html.includes(esc((sources[key]||explanationSources[key])[1])));
  const svg = await fetch(new URL(data.diagram.src,base)); assert.equal(svg.status,200);
  assert(svg.headers.get('content-type').startsWith('image/svg+xml'));
  assert((await svg.text()).includes('<title'));
  assert(html.includes('href="#explanations"') && html.includes('href="#concept-diagram"'));
}
console.log('Explanation pages PASS: 30 pages with 90 accessible tab panels, 30 SVG HTTP/MIME/source/alt/scope checks, reference links and deep-link targets.');
