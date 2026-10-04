import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const header = fs.readFileSync(path.join(root, 'components', 'Header.jsx'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'app', 'layout.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');

const checks = [
  ['brand click handler', header.includes('onBrandClick') && header.includes('setBrandLoading(true)')],
  ['brand loading overlay', header.includes('brand-loading-overlay') && header.includes('brand-loading-ring')],
  ['home navigation delay', header.includes("window.location.assign('/')")],
  ['page reveal wrapper', layout.includes('site-page-reveal')],
  ['page reveal animation', css.includes('@keyframes sitePageReveal')],
  ['circular loading animation', css.includes('@keyframes brandRingSpin')],
  ['reduced motion support', css.includes('prefers-reduced-motion:reduce')],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}

console.log('Transition UX PASS · page reveal + brand logo loader + reduced-motion support.');
