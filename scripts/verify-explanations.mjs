import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { concepts, sources } from '../lib/data.mjs';
import { conceptExplanations, explanationSources } from '../lib/concept-explanations.mjs';
import { explanationModes, explanationModeForReview, explanationModeFromHash } from '../lib/concept-review.mjs';
import { conceptQuizzes } from '../lib/concept-quizzes.mjs';
import { renderConceptDiagram } from './generate-concept-diagrams.mjs';

assert.deepEqual(Object.keys(conceptExplanations), concepts.map(concept => concept.id));
assert.deepEqual(explanationModes.map(mode => mode.id), ['simple', 'principle', 'caution']);
for (const mode of explanationModes) assert.equal(explanationModeFromHash(`#explain-${mode.id}`), mode.id);
for (const hash of ['', '#quiz', '#explain-constructor', '#explain-simple-extra']) assert.equal(explanationModeFromHash(hash), null);
assert.equal(explanationModeForReview('what'), 'simple');
assert.equal(explanationModeForReview('how'), 'principle');
assert.equal(explanationModeForReview('misconceptions'), 'caution');
const paragraphs = new Set(); const diagrams = new Set();
let levelCount = 0; let quizLinks = 0; let assetBytes = 0;
const luminance = hex => {
  const rgb = hex.match(/[a-f0-9]{2}/gi).map(value => {
    const v = parseInt(value,16) / 255;
    return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
  });
  return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
};
const diagramBackgrounds = ['#ffffff','#f7fbfc','#d9f1f3','#b9d7e8','#f5d5ad','#dfe8ed','#e3f2e9'];
for (const concept of concepts) {
  const explanation = conceptExplanations[concept.id];
  for (const mode of explanationModes) {
    const level = explanation.levels[mode.id];
    assert(level.title.length >= 8);
    assert.equal(level.paragraphs.length, 2, concept.id);
    for (const paragraph of level.paragraphs) {
      assert(paragraph.length >= 45, `${concept.id}/${mode.id}: insufficient explanation`);
      assert(!paragraphs.has(paragraph), `${concept.id}/${mode.id}: repeated explanation`);
      paragraphs.add(paragraph);
    }
    levelCount++;
  }
  const diagram = explanation.diagram;
  assert.equal(diagram.id, concept.id);
  assert.equal(diagram.width, 360);
  assert(diagram.height >= 420 && diagram.height <= 490);
  assert(diagram.alt.length > 30 && diagram.scope.length > 20);
  assert(diagram.refs.length >= 2);
  for (const key of diagram.refs) assert(sources[key] || explanationSources[key], `${concept.id}: unknown source ${key}`);
  const svg = await readFile(new URL(`../public${diagram.src}`, import.meta.url), 'utf8');
  assert.equal(svg, renderConceptDiagram(concept.id), `${concept.id}: generated SVG differs`);
  assert(svg.includes(`viewBox="0 0 360 ${diagram.height}"`) && svg.includes('<title') && svg.includes('<desc'));
  assert(!/<script|<foreignObject|<image|\bon\w+\s*=|(?:href|src)=|<!DOCTYPE/i.test(svg), `${concept.id}: active/external SVG`);
  assert(!diagrams.has(svg)); diagrams.add(svg); assetBytes += Buffer.byteLength(svg);
  for (const match of svg.matchAll(/<text[^>]*\bfill="(#[a-f0-9]{6})"/gi)) {
    for (const background of diagramBackgrounds) {
      const a = luminance(match[1]), b = luminance(background);
      assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${concept.id}: SVG text contrast`);
    }
  }
  for (const question of conceptQuizzes[concept.id]) {
    assert(explanation.levels[explanationModeForReview(question.review)]);
    quizLinks++;
  }
}
assert.equal(levelCount, 90); assert.equal(paragraphs.size, 180); assert.equal(diagrams.size, 30); assert.equal(quizLinks, 90);
assert(assetBytes < 250000, 'Diagrams stay small.');
console.log(`Explanations PASS: ${levelCount} levels / ${paragraphs.size} distinct paragraphs, ${diagrams.size} original static SVGs (${assetBytes} bytes), source metadata and ${quizLinks} quiz explanation/diagram targets.`);
