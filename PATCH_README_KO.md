# SEMI-ATLAS v1.21 Patch

기준: v1.20 이상

## 적용 방법
이 ZIP의 내용을 현재 SEMI-ATLAS Git 프로젝트 루트에 그대로 복사하고 같은 파일은 덮어씁니다.

## 변경 파일
- `components/VisualGuide.jsx`
- `app/visual/page.jsx`
- `app/globals.css`
- `scripts/verify-visual-guides.mjs`
- `package.json`
- `package-lock.json`
- `VISUAL_GUIDE_V2_STATUS.md`

## 주요 변경
Visual Guide 5종을 단순 박스 흐름에서 기술 구조 중심의 Visual Guide V2로 변경합니다.

- Silicon → Wafer → Transistor cross-section → Chip
- CPU/GPU ↔ DRAM/NAND data fabric
- Lithography + wafer cross-section + 11-step process rail
- HBM DRAM stack + TSV + GPU + Silicon Interposer + Package Substrate
- Semiconductor ecosystem + Equipment/Materials support layer

## 확인
```powershell
npm run check
npm run build
npm run dev
```
