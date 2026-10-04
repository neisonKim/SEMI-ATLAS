# SEMI-ATLAS v1.21 — Visual Guide V2

## 변경 요약
기존 박스형 Visual Guide 5종을 기술 구조 중심의 시각화로 재설계했습니다.

1. **Foundations** — Silicon → Wafer → Transistor 단면 → Chip die
2. **Compute & Memory** — CPU/GPU와 DRAM/NAND 사이의 데이터 패브릭 구조
3. **Manufacturing** — 노광 장치 + 웨이퍼 단면 + 11단계 공정 흐름
4. **HBM / Advanced Packaging** — DRAM stack, TSV, GPU, Silicon Interposer, Package Substrate 구조
5. **Semiconductor Ecosystem** — 설계→Fabless→Foundry→OSAT→System 및 Equipment/Materials Support Layer

## 원칙
- 교육용 개념도이며 실제 제품의 비율/구조를 그대로 재현하지 않습니다.
- 기존 30개 개념 링크를 유지합니다.
- 모바일에서는 세로 흐름과 수평 스크롤을 사용해 정보가 잘리지 않도록 했습니다.
- 과도한 SF/HUD 효과보다 실제 반도체 구조를 이해하는 데 필요한 레이어와 연결을 우선합니다.

## 검증
`npm run check:visual`에서 5개 가이드, 개념 링크, V2 컴포넌트/CSS 토큰을 함께 검사합니다.
