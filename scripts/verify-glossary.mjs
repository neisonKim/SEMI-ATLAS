import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { byId } from '../lib/data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const glossary = JSON.parse(fs.readFileSync(path.join(root, 'lib/glossary.json'), 'utf8'));
const conceptPage = fs.readFileSync(path.join(root, 'app/concept/[id]/page.jsx'), 'utf8');
const component = fs.readFileSync(path.join(root, 'components/GlossaryText.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');

const fail = (message) => {
  console.error(`Glossary verification FAIL: ${message}`);
  process.exit(1);
};

if (glossary.length !== 50) fail(`expected 50 terms, found ${glossary.length}`);

const ids = new Set();
const aliases = new Map();
for (const item of glossary) {
  if (!item.id || !item.term || !item.short) fail('every glossary record needs id, term and short');
  if (ids.has(item.id)) fail(`duplicate id: ${item.id}`);
  ids.add(item.id);
  if (item.short.length < 12) fail(`definition too short: ${item.term}`);
  if (item.concept && !byId[item.concept]) fail(`unknown concept link for ${item.term}: ${item.concept}`);

  for (const alias of [item.term, ...(item.aliases || [])]) {
    const key = alias.trim().toLocaleLowerCase('ko-KR');
    if (!key) fail(`empty alias in ${item.term}`);
    const owner = aliases.get(key);
    if (owner && owner !== item.id) fail(`alias collision: ${alias} (${owner}, ${item.id})`);
    aliases.set(key, item.id);
  }
}

if (!conceptPage.includes("import GlossaryText from '@/components/GlossaryText'")) fail('concept page does not import GlossaryText');
if ((conceptPage.match(/<GlossaryText/g) || []).length < 8) fail('tooltips are not applied across core concept sections');
if (!component.includes("role=\"tooltip\"")) fail('tooltip accessibility role missing');
if (!component.includes("event.key === 'Escape'")) fail('Escape close behavior missing');
if (!css.includes('.glossary-term.is-open .glossary-popover')) fail('open-state tooltip CSS missing');
if (!css.includes('env(safe-area-inset-bottom)')) fail('mobile safe-area handling missing');

console.log(`Glossary verification PASS: ${glossary.length} terms, ${aliases.size} searchable labels, desktop hover/focus + mobile tap UI wired.`);
