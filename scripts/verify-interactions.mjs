import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const hero = fs.readFileSync(path.join(root, 'components', 'HeroSlider.jsx'), 'utf8');
const header = fs.readFileSync(path.join(root, 'components', 'Header.jsx'), 'utf8');
const footer = fs.readFileSync(path.join(root, 'components', 'Footer.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');
const assets = path.join(root, 'public', 'assets');

const heroFiles = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const names = ['wafer','oxidation','lithography','etching','deposition','metallization','eds','packaging'];
  return `hero-process-${n}-${names[i]}.webp`;
});

const checks = [
  ['8 hero slides declared', (hero.match(/image: '\/assets\/hero-process-/g) || []).length === 8],
  ['hero autoplay', hero.includes('AUTOPLAY_MS') && hero.includes('setInterval')],
  ['hero previous / next controls', hero.includes('이전 슬라이드') && hero.includes('다음 슬라이드')],
  ['desktop nav animated bar', css.includes('.desktop-nav>a:after') && css.includes('transform:scaleX(0)')],
  ['hamburger to X state', header.includes('menu-glyph') && header.includes("open ? ' is-open' : ''")],
  ['animated mobile nav state', header.includes("mobile-nav${open ? ' is-open' : ''}") && css.includes('.mobile-nav.is-open')],
  ['mobile menu dark scrim', header.includes('mobile-menu-scrim') && css.includes('.mobile-menu-scrim.is-open') && css.includes('rgba(0,0,0,.62)')],
  ['mobile menu scroll lock', header.includes("document.body.style.overflow = 'hidden'")],
  ['magnifier-adjacent inline search', header.includes('header-direct-search') && header.includes('header-direct-search-input-wrap') && header.includes('header-direct-search-input') && header.includes('setSearchOpen') && !header.includes('header-search-panel')],
  ['header search stays inside header', css.includes('.header-direct-search.is-open') && css.includes('right:44px') && css.includes('width:calc(100% - 44px)')],
  ['header search direct suggestions', header.includes('suggestConcepts') && header.includes('searchSuggestions') && header.includes('header-direct-search-results')],
  ['mobile header action slots remain fixed after search close', css.includes('Mobile header action slots stay fixed when inline search toggles') && css.includes('flex:0 0 94px') && css.includes('.menu-toggle{') && css.includes('display:flex!important')],
  ['brand letter spacing', css.includes('.site-header .brand b') && css.includes('letter-spacing:.16em')],
  ['footer direct contact form', footer.includes('studiokei805@gmail.com') && footer.includes('ContactForm') && footer.includes('setContactOpen(true)')],
  ['desktop header aligned to content container', css.includes('@media(min-width:851px)') && css.includes('width:min(var(--container),calc(100% - 64px))')],
  ['reduced motion handling', css.includes('prefers-reduced-motion:reduce')],
  ['all hero assets exist', heroFiles.every((file) => fs.existsSync(path.join(assets, file)))],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}

console.log('Interaction UX PASS · hero slider + nav underline + animated hamburger/menu + dark scrim + fixed mobile search/menu slots + magnifier-adjacent inline search + spaced brand + direct contact form + aligned desktop header.');
