# SEMI-ATLAS v1.19 패치

기존 v1.18 Git 프로젝트 루트에 이 압축의 내용을 그대로 덮어쓰세요.

핵심 수정:
- ContactForm을 React Portal로 document.body에 렌더링
- 모바일 문의 모달이 긴 페이지 기준으로 밀려나는 문제 해결
- 문의창을 실제 viewport 중앙에 고정
- 닫기 버튼이 상단에 유지되고 폼 내부만 스크롤

적용 후:

```powershell
npm install
npm run check
npm run build
npm run dev
```

정상이면:

```powershell
git add .
git commit -m "Fix mobile contact modal viewport positioning"
git push
```
