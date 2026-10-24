# SEMI-ATLAS v1.22 패치 적용

## 목적
개선 기획서 1단계의 첫 기능인 **초보자 용어 50개 + 본문 자동 인식 Tooltip**을 현재 v1.21 프로젝트에 적용합니다.

## 적용 방법
이 ZIP의 폴더 구조를 유지한 채 현재 SEMI-ATLAS 프로젝트 루트에 덮어씁니다.

그 다음:

```powershell
npm run check
npm run build
npm run dev
```

정상이면:

```powershell
git add .
git commit -m "Add beginner glossary tooltips"
git push
```

## 변경 파일
- `lib/glossary.json` — 용어 50개 / 한글·영문·약어 aliases
- `components/GlossaryText.jsx` — 자동 인식 + Tooltip UI
- `app/concept/[id]/page.jsx` — 주요 본문 구간에 자동 Glossary 적용
- `app/globals.css` — Desktop hover/focus + Mobile tap/fixed card UI
- `scripts/verify-glossary.mjs` — 50개 데이터·연결·UI 자동 검증
- `package.json` — v1.22 및 `check:glossary`
- `lib/site-config.mjs`, `.env.example`, `public/robots.txt`, `public/sitemap.xml` — 현재 Production URL `https://semi-atlas.vercel.app` 기준 정리

## 보안
`.env.local`은 포함하지 않았습니다. Gmail App Password 등 Secret은 기존 로컬/Vercel 환경변수를 그대로 사용합니다.
