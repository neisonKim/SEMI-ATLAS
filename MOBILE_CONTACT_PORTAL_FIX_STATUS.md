# SEMI-ATLAS v1.19 · Mobile Contact Portal Fix

문의 모달을 `document.body` Portal로 렌더링해 `.site-page-reveal`의 transform containing block 영향에서 분리했습니다.

- 실제 viewport 기준 fixed backdrop
- header보다 높은 z-index 2200
- 모바일 중앙 정렬
- max-height 72dvh / 600px
- 390px 이하 70dvh / 560px
- 낮은 화면은 64dvh
- 상단 닫기 버튼 고정, 본문 폼만 내부 스크롤
