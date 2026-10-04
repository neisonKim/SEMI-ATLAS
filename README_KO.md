# 반도체 백과사전 — Next.js 전환본

기존 `semiconductor_encyclopedia_source_v1.zip`의 디자인, 30개 개념 데이터, 이미지, 검색 방식, 학습 경로와 URL 구조를 유지하면서 Next.js App Router 구조로 전환한 프로젝트입니다.

## 기준 원본

- 원본 소스 커밋: `056b074e9d1e9bd9b8ab6c38cb291988d18745ec`
- 원본 Export date: `2026-10-04`
- 원본 사이트: `https://semiconductor-knowledge-atlas.neisonkim.chatgpt.site`

## 실행

Node.js 20 이상 권장.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

프로덕션 빌드:

```bash
npm run build
```

현재 `next.config.mjs`는 `output: 'export'`를 사용하므로 빌드 결과는 `out/`에 생성됩니다. 로그인·DB·CMS를 붙이는 단계에서는 이 설정을 제거하고 서버 기능을 추가할 수 있습니다.

## Next.js 구조

```text
app/
  page.jsx                 홈
  encyclopedia/page.jsx    검색 결과
  learn/page.jsx           입문 코스
  process/page.jsx         공정 지도
  packaging/page.jsx       패키징
  industry/page.jsx        산업 지도
  visual/page.jsx          한눈에 보기
  concept/[id]/page.jsx    30개 개념 상세
components/
  Header.jsx
  Footer.jsx
  AssetImage.jsx
  ConceptCard.jsx
  PageHero.jsx
  SearchClient.jsx
lib/
  data.mjs                 30개 개념·관계·출처
  concept-details.mjs      상세페이지 What·Structure·Industry 편집 데이터
  image-labels.mjs
  image-manifest.json
public/assets/              기존 이미지 32개
```

## 유지한 사항

- 기존 디자인 시스템과 반응형 스타일을 기반으로 유지
- Dark Navy / White / Mint 디자인 톤
- 홈, 검색, 30개 상세, 5단계 학습 경로
- 공정·패키징·산업·Visual 화면
- 한글·영문·별칭 검색
- 분야/난이도 필터와 URL query 유지
- PREREQUISITE/RELATED/NEXT에 해당하는 개념 연결
- 기존 이미지 파일명·크기·alt 설명
- 공식 참고자료 링크
- 기존 trailing slash URL 구조

## 변경한 사항

- Node 정적 HTML 생성기(`build.mjs`)를 Next.js App Router로 이전
- 30개 상세페이지를 `What → Why → How → Structure → Where → Industry → Visual Guide → FAQ → Connect → References` 표준으로 확장
- 각 개념에 구조 3요소, 산업 연결 설명, 업데이트 날짜, 검수 상태를 추가
- FAQ를 페이지당 3개로 확장하고 PREREQUISITE/NEXT 기반 학습 질문을 자동 구성
- 공통 Header/Footer/Card/Hero를 React 컴포넌트로 분리
- 검색 DOM 조작 코드를 React 상태 기반 검색으로 전환
- 개념 상세 30개를 `[id]` 동적 라우트 + `generateStaticParams()` 구조로 전환
- 메타데이터, sitemap, robots를 Next.js 방식으로 이전

## 아직 포함하지 않은 기능

기존 원본과 동일하게 아래는 포함하지 않습니다.

- 로그인
- 개인 진도 저장
- 데이터베이스
- 관리자 CMS
- 복잡한 Knowledge Graph 시각화

MVP의 현재 목표는 기존 디자인과 30개 연결 학습 경험을 안정적으로 유지하는 것입니다.

## 현재 단계

현재 **검색 자동완성까지 반영**했습니다. 다음 우선순위는 **모바일 QA → Production Build 확인 → 실제 도메인/SEO → Vercel 배포** 입니다.

## v1.3 — 대표 Visual Guide 5종

`/visual/`을 단순 이미지 타일 화면에서 실제 학습용 시각 가이드 허브로 확장했습니다.

1. Silicon → Wafer → Transistor → Chip
2. CPU/GPU ↔ DRAM/NAND
3. Wafer → Oxidation → Lithography → EUV/DUV → Etching → Deposition → CVD/ALD → Ion Implantation → CMP → Cleaning → Packaging
4. DRAM Stack → TSV → HBM ↔ Interposer ↔ GPU
5. EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System

모든 가이드는 HTML/CSS 기반의 반응형 다이어그램이며, 개념 노드를 클릭하면 30개 MVP 상세페이지로 이동합니다. 각 상세페이지의 Visual Guide 영역에서도 해당 대표 가이드로 바로 이동할 수 있습니다.

## v1.3.1: Next.js 16 정적 Export 빌드 수정
`output: 'export'` 환경에서 `/robots.txt`와 `/sitemap.xml` metadata route가 빌드를 막는 문제를 제거했습니다.
이제 두 파일은 `public/`에 정적으로 생성되며 `npm run dev`와 `npm run build` 전에 자동 갱신됩니다.
또한 상위 폴더에 다른 `package-lock.json`이 있어도 현재 프로젝트를 Turbopack root로 사용하도록 설정했습니다.

권장 실행 순서:
```powershell
npm install
npm run check
npm run build
npm run dev
```

이전 실패 빌드의 `.next`/`out` 폴더는 `npm run build` 전에 자동 정리됩니다.

## v1.4 — 공정 Hub 강화

`/process/`를 MVP 12~22번 개념의 실제 학습 Hub로 확장했습니다.

- 12 Fabrication → 13 Oxidation → 14 Lithography → 15 DUV/EUV → 16 Etching → 17 Deposition → 18 CVD → 19 ALD → 20 Ion Implantation → 21 CMP → 22 Cleaning 전체 연결
- 모든 공정 노드를 해당 개념 상세페이지로 연결
- 공정을 5개 역할군(표면 준비 / 패턴 정의 / 구조 형성 / 전기적 성질 / 평탄화·세정)으로 재구성
- 실제 제조가 직선형 1회 공정이 아니라 반복 구조라는 안내 강화
- Repeat / Selectivity / Measure 3개 핵심 원리 추가
- 제조공정 이후 23 Packaging으로 자연스럽게 이어지는 handoff CTA 추가
- 모바일에서는 전체 공정 지도를 수평 스크롤 학습 흐름으로 유지
- `npm run check:process` 검증 추가

## v1.5 — 산업 Hub 강화

`/industry/`를 단순한 3개 역할 카드에서 역할·의존성·지원망을 함께 읽는 산업 생태계 학습 Hub로 확장했습니다.

- EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System 6개 역할 지도 구현
- Fabless / Foundry / Packaging 노드를 기존 MVP 개념 상세페이지와 직접 연결
- EDA/IP / Equipment·Materials / System은 MVP 2.0 확장 예정 역할로 명확히 구분
- Equipment / Materials가 단순한 순차 단계가 아니라 제조·패키징을 가로지르는 Support Layer라는 설명 추가
- MVP 28 산업 생태계 → 29 Fabless → 30 Foundry 학습 경로를 별도 표시
- Role First / Interdependence / Support Layer 3개 산업 이해 원칙 추가
- MVP 2.0 확장 후보 EDA/IP / Equipment / Materials / OSAT 안내 추가
- 데스크톱 6열 → 태블릿 3열 → 모바일 1열 반응형 산업 지도 적용
- `npm run check:industry` 검증 추가


## v1.6 — 검색 자동완성

홈과 `/encyclopedia/` 검색창에 최대 5개의 즉시 추천을 추가했습니다.

- 한글·영문·별칭 검색 결과를 우선 노출
- 직접 일치 결과가 적을 때 PREREQUISITE / RELATED / NEXT 연결 개념으로 추천 확장
- 예: `HB` → HBM 우선 + DRAM / TSV / Interposer / GPU 등 연결 개념
- 키보드 ↑ / ↓ / Enter / Esc 조작 지원
- 모바일에서는 1열 compact suggestion UI 적용
- 전체 검색 결과 CTA 유지
- 기존 분야·난이도 필터를 적용한 상태에서도 자동완성 결과 동기화
- `scripts/verify-search.mjs`에 자동완성 검증 추가


## v1.7 Responsive QA
- 360 / 390 / 430px mobile hardening
- 768 / 1024px tablet breakpoint coverage reviewed
- Autocomplete/mobile navigation viewport overflow protection
- Narrow-screen article navigation and category card refinements
- `npm run check` now includes responsive rule verification

## v1.8 — Production / SEO hardening

- `NEXT_PUBLIC_SITE_URL` 환경변수로 canonical, metadataBase, JSON-LD, robots.txt, sitemap.xml의 기준 도메인을 한 곳에서 관리
- `.env.example` 추가
- WebSite + SearchAction JSON-LD 추가
- 개념 상세에 Article + BreadcrumbList JSON-LD 적용
- 홈 기본 Open Graph/Twitter 이미지 및 개념별 대표 소셜 이미지 연결
- sitemap의 개념별 `lastmod`를 각 콘텐츠 `updatedAt`과 연동
- `npm run check:seo` 추가: robots/sitemap URL 및 37개 경로 검증
- 정적 Export 결과를 별도 패키지 없이 확인할 수 있도록 `npm run start`/`npm run preview`용 로컬 서버 추가
- 실제 배포 절차는 `PRODUCTION_CHECKLIST.md` 참조

실제 도메인이 정해지면 프로젝트 루트에 `.env.local`을 만들고 다음 한 줄만 지정하면 됩니다.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## v1.9 Release Candidate 최종 검사

```powershell
npm install
npm run release:check
```

빌드 이후 `out/`의 37개 공개 URL, robots/sitemap, 내부 링크까지 자동 검사합니다. Vercel 배포 절차는 `VERCEL_DEPLOY_KO.md`를 참고하세요.
