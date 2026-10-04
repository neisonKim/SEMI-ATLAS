# Semiconductor Encyclopedia · Release Status v1.9

## 완료
- Next.js App Router 전환
- 30개 MVP 개념 및 관계 데이터
- 상세페이지 표준 구조
- Visual Guide 5종
- Process Hub
- Industry Hub
- 한글/영문/Alias 검색 및 자동완성
- 모바일/태블릿 반응형 하드닝
- Metadata / Open Graph / Twitter / JSON-LD / Breadcrumb
- 정적 robots.txt / sitemap.xml
- 환경변수 기반 Site URL
- Static Export 검증 스크립트
- Export HTML 내부 링크 검증 스크립트

## 현재 단계
Release Candidate. 실제 `next build`는 의존성 설치가 가능한 로컬/CI 환경에서 `npm run release:check`로 최종 판정합니다.

## 출시 승인 조건
1. `npm run release:check` PASS
2. `out/` 생성 확인
3. Vercel Production 배포 확인
4. 공개 도메인 적용 후 robots/sitemap/canonical 확인
