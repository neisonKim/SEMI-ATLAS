# SEMI-ATLAS v1.17 모바일 헤더 안정화 패치

## 수정 내용
- 모바일에서 검색창을 열었다 닫아도 햄버거 버튼이 사라지지 않도록 액션 영역 폭 고정
- 검색 버튼과 햄버거 버튼을 각각 고정 슬롯으로 유지
- 430px 이하에서 검색 form의 absolute 재배치를 제거
- 검색 입력창만 돋보기 왼쪽으로 확장되도록 변경
- 모바일 자동완성 패널이 화면 밖으로 밀리지 않도록 위치 조정

## 적용 방법
현재 Git 프로젝트 루트에 이 ZIP의 내용을 그대로 덮어씁니다.

```powershell
npm run check
npm run build
npm run dev
```

정상 확인 후:

```powershell
git add .
git commit -m "Fix mobile header search and hamburger layout"
git push
```
