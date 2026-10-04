# Next.js Migration / MVP Status

## 완료 — Next.js 전환

- 기존 정적 HTML 구조를 Next.js App Router로 이전
  - 홈
  - 검색
  - 학습 경로
  - 개념 상세 30개
  - 공정 / 패키징 / 산업 / Visual
  - 404
- 기존 이미지 32개 보존
- 기존 30개 개념의 핵심 정의·Why·How·Where·관계·출처 보존
- 검색을 React 상태 기반으로 이전
- 모바일 메뉴를 React 상태 기반으로 이전
- Metadata / JSON-LD / sitemap / robots 이전
- trailing slash URL 구조 유지

## 완료 — MVP 상세페이지 표준 확장 (v1.2)

30개 개념 상세페이지를 아래 공통 구조로 확장했습니다.

1. What — 무엇인가요?
2. Why — 왜 필요한가요?
3. How — 어떻게 작동하나요?
4. Structure — 구조를 3요소로 단순화
5. Where — 어디에 쓰이나요?
6. Industry — 산업·공급망에서의 위치
7. Visual Guide — PREREQUISITE → NOW → NEXT 관계도
8. FAQ — 페이지당 3개
9. Connect — 선행/관련/학습 경로
10. References — 공식 자료
11. Last Updated / Status

추가 데이터는 `lib/concept-details.mjs`에 분리해 원본 이관 데이터와 구분했습니다.

## 자동 검증 결과

- 개념 데이터: 30개
- 관계 누락: 0
- 상세 확장 필드(What / Structure / Industry / Updated / Status): 30개 모두 확인
- 이미지 매니페스트: 32개 / 파일 누락 0
- 한글·영문·별칭 검색 테스트: 통과

실행한 검증:

```bash
node scripts/verify-data.mjs
node scripts/verify-search.mjs
```

## 빌드 검증 상태

이 실행 환경에서 `npm install`을 시도했으나 의존성 설치가 제한 시간 안에 끝나지 않아 `next build`는 아직 실행하지 못했습니다.
데이터 검증은 통과했으며, 로컬 환경에서 아래 순서로 최종 빌드/브라우저 QA가 필요합니다.

```bash
npm install
npm run check
npm run build
npm run dev
```

## 다음 개발 우선순위

1. 대표 Visual Guide 5종 제작 및 연결
2. 공정 Hub를 12~22 개념의 전체 흐름으로 강화
3. 산업 Hub를 EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT → System 흐름으로 강화
4. 검색 자동완성
5. 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 반응형 QA
6. 실제 도메인 확정 후 canonical / sitemap / OpenGraph 정리
7. Vercel 배포

로그인·진도 저장·CMS·복잡한 Knowledge Graph는 MVP 1.0 이후로 유지합니다.

## 완료 — 대표 Visual Guide 5종 (v1.3)

- `/visual/`을 5개 실제 학습 다이어그램으로 재구성
- Foundations: Silicon → Wafer → Transistor → Chip
- Computing & Memory: CPU/GPU ↔ DRAM/NAND
- Manufacturing: 주요 공정 11개 연결 + 반복 공정 안내
- HBM: DRAM Stack / TSV / HBM / Interposer / GPU / Package Substrate 구조
- Industry: EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System
- 모든 연결 가능한 노드를 개념 상세페이지로 연결
- 홈에 Visual Guide 5종 빠른 진입 영역 추가
- 30개 상세페이지 Visual Guide 섹션에 카테고리별 대표 가이드 바로가기 추가
- 모바일 1열/2열 재배치 규칙 추가

### 다음 우선순위

1. 공정 Hub를 12~22 개념의 전체 흐름으로 강화
2. 산업 Hub를 역할·공급망 중심으로 강화
3. 검색 자동완성
4. 반응형 브라우저 QA
5. 도메인/SEO 정리 및 Vercel 배포

## v1.3.1 build compatibility fix
- Removed dynamic `app/robots.js` and `app/sitemap.js` metadata routes that conflict with `output: 'export'` in Next.js 16.
- Added static `public/robots.txt` and `public/sitemap.xml` generation before dev/build.
- Added `scripts/generate-static-metadata.mjs` and `scripts/clean-build.mjs`.
- Set `turbopack.root = process.cwd()` so a parent-folder `package-lock.json` no longer changes the inferred workspace root.
- `npm run check` passes for all 30 concepts, search aliases, relations, images, and 5 Visual Guides.

## 완료 — 공정 Hub 강화 (v1.4)

- `/process/`에 12~22번 제조공정 전체 학습 경로 구현
- 공정 지도 노드 11개를 각 상세페이지와 직접 연결
- 5개 역할군으로 공정 개념 재분류: 표면 준비 / 패턴 정의 / 구조 형성 / 전기적 성질 / 평탄화·세정
- 실제 제조공정의 반복성과 계측·검사 개념을 설명하는 교육 블록 추가
- 공정 핵심 원리 Repeat / Selectivity / Measure 카드 추가
- 제조공정 → Packaging 전환 CTA 추가
- 모바일 수평 스크롤 Process Map 및 1열 역할 카드 대응
- `scripts/verify-process-hub.mjs` 추가 및 전체 check 체인에 연결

### 다음 우선순위
1. 산업 Hub를 EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System 흐름으로 강화
2. 검색 자동완성
3. 반응형 브라우저 QA
4. 실제 도메인/SEO 정리 및 Vercel 배포

## 완료 — 산업 Hub 강화 (v1.5)

- `/industry/`에 EDA/IP → Fabless → Foundry → Equipment/Materials → OSAT/Packaging → System 역할 지도 구현
- 연결 가능한 MVP 역할은 개념 상세페이지와 직접 연결
- EDA/IP, 장비·소재, System은 MVP 2.0 확장 대상으로 표시
- Equipment / Materials를 제조·패키징 여러 단계에 걸친 Support Layer로 별도 설명해 단순 직선형 공급망 오해 방지
- 28 Ecosystem → 29 Fabless → 30 Foundry의 MVP 1.0 산업 학습 경로 고정
- Role First / Interdependence / Support Layer 학습 원칙 추가
- 데스크톱·태블릿·모바일 반응형 Industry Map 구현
- `lib/industry-hub.mjs`, `components/IndustryHub.jsx`, `scripts/verify-industry-hub.mjs` 추가
- `npm run check`에 Industry Hub 검증 연결

### 검증
- 30개 개념/관계/이미지 검증 PASS
- 한글·영문·Alias 검색 검증 PASS
- Visual Guide 5종 검증 PASS
- Process Hub 12~22 검증 PASS
- Industry Hub 6개 역할 + 28→29→30 학습 경로 검증 PASS
- JS/JSX 21개 TypeScript parser 구문 검증 PASS

## 완료 — 검색 자동완성 (v1.6)

- 홈 및 백과사전 검색창에 최대 5개 즉시 추천 구현
- 직접 검색 결과 우선 + 연결 개념(PREREQUISITE / RELATED / NEXT) 보강
- 한글·영문·Alias 검색 규칙과 동일한 ranking 재사용
- 키보드 탐색(↑/↓/Enter/Escape), combobox/listbox ARIA 적용
- 분야·난이도 필터와 추천 결과 동기화
- 모바일 자동완성 UI 추가
- 검색 검증에 `HB` → HBM + 연결 개념 5개 케이스 추가

### 다음 우선순위
1. 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 반응형 브라우저 QA
2. 로컬 `npm run build` 최종 확인
3. 실제 도메인/SEO 정리
4. Vercel 배포


## v1.7 Responsive QA
- 360 / 390 / 430px mobile hardening
- 768 / 1024px tablet breakpoint coverage reviewed
- Autocomplete/mobile navigation viewport overflow protection
- Narrow-screen article navigation and category card refinements
- `npm run check` now includes responsive rule verification

## 완료 — Production / SEO hardening (v1.8)

- 사이트 URL을 `lib/site-config.mjs` + `NEXT_PUBLIC_SITE_URL`로 중앙화
- metadataBase / canonical / Open Graph / Twitter / JSON-LD / robots / sitemap의 도메인 일관성 확보
- WebSite SearchAction JSON-LD 추가
- 개념 상세 Article + BreadcrumbList JSON-LD 추가
- 개념별 대표 이미지 Open Graph/Twitter 메타 연결
- sitemap 37개 URL + 개념별 Last Modified 자동 생성
- `check:seo`를 전체 `npm run check` 체인에 추가
- 정적 Export `out/` 전용 로컬 preview 서버 추가
- `.env.example` 및 `PRODUCTION_CHECKLIST.md` 추가

### 남은 출시 단계
1. 사용자가 실제 Production 도메인 확정
2. `.env.local` 또는 Vercel 환경변수에 `NEXT_PUBLIC_SITE_URL` 등록
3. 로컬 `npm run build` 성공 확인
4. Vercel 배포 후 canonical / robots / sitemap / 모바일 실브라우저 최종 확인
