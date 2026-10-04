import fs from 'node:fs';

const css = fs.readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const required = [
  '@media(max-width:850px)',
  '@media(max-width:600px)',
  '@media(max-width:430px)',
  '@media(max-width:390px)',
  '@media(max-width:360px)',
  'max-height:calc(100dvh - 66px)',
  'overflow-x:clip',
  '.article-navigation{grid-template-columns:1fr}',
  '.category-grid{grid-template-columns:1fr}',
  '.autocomplete-panel{max-height:min(560px,72dvh)',
  '.guide-lane-nodes{grid-template-columns:1fr}',
];

const missing = required.filter((token) => !css.includes(token));
if (missing.length) {
  console.error('Responsive QA failed. Missing rules:');
  for (const token of missing) console.error(`- ${token}`);
  process.exit(1);
}

const widthBreakpoints = [...css.matchAll(/@media\(max-width:(\d+)px\)/g)].map((m) => Number(m[1]));
for (const target of [360, 390, 430, 600, 850, 1000, 1100, 1120]) {
  if (!widthBreakpoints.includes(target)) {
    console.warn(`Responsive QA note: exact ${target}px breakpoint is not present.`);
  }
}

console.log('Responsive QA PASS');
console.log('Checked mobile hardening for 360 / 390 / 430 / 600 / 850px plus tablet rules.');
