# Mobile / Responsive QA — v1.7

## Target widths
- 360px: compact mobile
- 390px: common mobile
- 430px: large mobile
- 768px: tablet portrait (covered by 850/760 rules)
- 1024px: tablet / small desktop (covered by 1120/1100/1000 rules)

## Hardened areas
- Sticky header and mobile navigation viewport height
- Hero typography and CTA wrapping
- Search input/button sizing and autocomplete maximum height
- Search filters and level selector
- Category cards on narrow phones
- Concept article typography, images, chips and previous/next navigation
- Visual Guide grids, HBM diagram and computing lanes
- Process Hub horizontal touch scrolling and compact nodes
- Industry Hub one-column flow and expansion cards
- Footer wrapping and global horizontal-overflow guard

## Verification
Run:

```powershell
npm run check
npm run build
npm run dev
```

Then inspect the browser at 360, 390, 430, 768 and 1024px widths. The code-level responsive checks run as part of `npm run check`.
