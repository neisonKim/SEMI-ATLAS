import assert from 'node:assert/strict';
import { concepts, getLearningNavigation, sources } from '../lib/data.mjs';

const base = new URL(process.argv[2] || 'http://localhost:3101');
assert(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Use a local preview for page verification.');
function section(html, id) {
  const value = html.match(new RegExp(`<section(?=[^>]*\\bid="${id}")[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
  assert(value, `Missing section ${id}`);
  return value;
}
function hrefs(html) { return [...html.matchAll(/\bhref="([^"#]*)"/g)].map(match => match[1]); }
for (const concept of concepts) {
  const response = await fetch(new URL(`/concept/${concept.id}/`, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, concept.id);
  const html = await response.text();
  const faq = section(html, 'question');
  assert.equal((faq.match(/<details\b/g) || []).length, 1, `${concept.id}: FAQ count`);
  assert(!faq.includes('먼저 무엇을 알고') && !faq.includes('다음에는 무엇을'), `${concept.id}: template FAQ`);
  const header = html.match(/<header class="article-header">([\s\S]*?)<\/header>/)?.[1];
  assert(header && !header.includes('검수됨'), `${concept.id}: unsupported review label`);
  const analogy = section(html, 'analogy');
  assert(analogy.includes(concept.analogy.title) && analogy.includes(concept.analogy.limit), `${concept.id}: analogy or limits missing from page`);
  const numbers = section(html, 'numbers');
  assert.equal((numbers.match(/class="number-card"/g) || []).length, 2, `${concept.id}: missing numeric cards`);
  const numericLinks = hrefs(numbers).filter(href => /^https:/.test(href)).map(url => new URL(url.replaceAll('&amp;', '&')).href);
  assert.deepEqual(numericLinks, concept.numbers.map(number => new URL(sources[number.source][1]).href), `${concept.id}: number citations differ from evidence`);
  for (const number of concept.numbers) {
    assert(numbers.includes(number.scope), `${concept.id}: number conditions not visible`);
    assert(numbers.includes(`data-number-kind="${number.kind}"`), `${concept.id}: fact/example label missing`);
    if (number.formula) assert(numbers.includes(number.formula.replaceAll('&', '&amp;')), `${concept.id}: calculation formula missing`);
  }
  assert.equal((section(html, 'structure').match(/<p>/g) || []).length, 3, `${concept.id}: structure descriptions missing`);
  const misconception = section(html, 'misconceptions');
  assert(misconception.includes(concept.misconceptions[0].claim) && misconception.includes('바르게 이해하기'), `${concept.id}: misconception correction missing`);
  for (const anchor of ['analogy', 'numbers', 'misconceptions']) assert(html.includes(`href="#${anchor}"`), `${concept.id}: missing TOC anchor ${anchor}`);
  const connections = section(html, 'connections');
  const links = hrefs(connections).filter(url => url.startsWith('/concept/'));
  assert.equal(links.length, new Set(links).size, `${concept.id}: repeated connection links`);
  for (const id of concept.prerequisites) {
    assert(links.includes(`/concept/${id}/`), `${concept.id}: missing prerequisite ${id}`);
  }
  assert.equal((html.match(/class="relationship-map"/g) || []).length, 1, `${concept.id}: repeated relationship map`);
  const navigation = html.match(/<nav class="article-navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert(navigation, `${concept.id}: missing navigation`);
  const { previous, next } = getLearningNavigation(concept.id);
  assert.deepEqual(hrefs(navigation), [previous ? `/concept/${previous.id}/` : '/learn/', next ? `/concept/${next.id}/` : '/learn/'], `${concept.id}: rendered navigation`);
  const refs = section(html, 'references');
  assert.deepEqual(hrefs(refs).map(url => new URL(url.replaceAll('&amp;', '&')).href), concept.refs.map(key => new URL(sources[key][1]).href), `${concept.id}: rendered references`);
  assert(html.includes('glossary-term'), `${concept.id}: glossary missing`);
}
console.log(`Rendered content PASS: all ${concepts.length} pages, analogies, 60 numeric cards + citations + conditions, 90 structure explanations, misconceptions, unique connections, FAQs, curriculum navigation and glossary.`);
