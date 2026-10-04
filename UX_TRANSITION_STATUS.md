# SEMI ATLAS v1.10 — UX Transition Update

## 추가된 동작
- 모든 페이지 콘텐츠가 진입 시 약 0.48초 동안 부드럽게 페이드 인 + 8px 상승합니다.
- 헤더의 브랜드 로고를 일반 클릭하면 전체 화면 로딩 오버레이가 표시됩니다.
- 로딩 오버레이는 중앙 로고 + 회전형 원형 인디케이터 + `SEMI ATLAS / KNOWLEDGE, CONNECTED.` 문구로 구성됩니다.
- 약 620ms 후 홈(`/`)으로 이동합니다.
- Ctrl/Cmd/Shift/Alt 클릭은 브라우저의 새 탭/새 창 동작을 그대로 유지합니다.
- `prefers-reduced-motion` 사용자는 페이지 전환 애니메이션이 최소화됩니다.

## 수정 파일
- `components/Header.jsx`
- `app/layout.jsx`
- `app/globals.css`
- `package.json` (1.10.0)
