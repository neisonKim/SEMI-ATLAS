# SEMI-ATLAS v1.20 Reference Quality Status

## 목표
MVP 30개 개념의 Reference를 단순 공통 링크에서 개념별 2~4개의 권위 있는 자료로 정비합니다.

## 선정 우선순위
1. 산업 표준/협회: JEDEC, SEMI
2. 장비·제조 공식 기술자료: ASML, Applied Materials, Lam Research, TSMC, Intel
3. 메모리/패키징 공식 기술자료: Samsung Semiconductor, Micron
4. 대학/학술 교육자료: OpenStax, IEEE

## v1.20 반영
- 30개 개념 모두 2~4개 Reference 보유
- 총 47개 Source Catalog 구축
- 개념별 Reference 키를 `lib/reference-map.mjs`로 분리
- Reference 영역에 자료 유형 배지 추가
- `npm run check:references` 자동 검증 추가
- 기존 공통 10개 출처 구조를 개념별 Source Map 구조로 교체

## 다음 검토
- 외부 링크의 장기 유지 여부 정기 확인
- 핵심 10개 글에 논문/표준 원문 추가 검토
- 페이지 본문의 기술 주장과 Reference 간 세부 매칭 강화
