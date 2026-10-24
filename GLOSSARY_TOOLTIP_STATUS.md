# SEMI-ATLAS v1.22 · Glossary Tooltip

## 구현 범위
개선 기획서 7장 1단계 중 첫 번째 구현인 `glossary.json + 개념 페이지 용어 툴팁`을 적용했습니다.

- 용어 50개
- 한글/영문/약어/동의어 포함 검색 라벨 132개
- 개념 상세페이지 핵심 본문 자동 인식
- Desktop: hover / keyboard focus / click
- Mobile: tap open/close, 화면 하단 fixed card, safe-area 대응
- Escape 또는 바깥 영역 클릭으로 닫기
- 관련 개념이 있는 용어는 `/concept/[id]/`로 바로 이동
- 한 문단 안에서는 같은 용어를 한 번만 강조해 시각적 과밀을 줄임
- `npm run check:glossary` 추가

## 적용 위치
- Article deck
- What
- 10초 정의
- Why
- How 단계
- Where
- Industry 설명
- FAQ 답변

## 데이터
`lib/glossary.json`

각 항목:
- `id`
- `term`
- `aliases`
- `short`
- `concept`

## 다음 단계
기획서 1단계의 나머지 작업:
1. 30개 개념에 비유 1개씩
2. 공식 자료로 검증한 핵심 수치 2개 이상 + 기준연도
3. 흔한 오해 1~2개
4. 중복 FAQ와 근거 없는 `검수됨` 라벨 정리
5. Reference 직접 링크 및 이전/다음 관계 전수 점검
