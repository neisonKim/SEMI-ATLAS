# SEMI-ATLAS v1.18 패치

## 변경 사항
1. 모바일 문의창 높이를 줄이고 내부 스크롤 방식으로 변경했습니다.
2. 문의창 상단 헤더/닫기 버튼을 고정하여 폼을 스크롤해도 항상 닫기 버튼이 보입니다.
3. 문의창이 열릴 때 이름 입력칸 자동 포커스로 상단이 밀려나는 현상을 `preventScroll`로 막았습니다.
4. 모바일 입력칸/textarea 높이와 간격을 축소했습니다.
5. 홈페이지 Open Graph에 `og:title`, `og:description`, `og:image`, 절대 URL을 명시했습니다.
6. Twitter/SNS 미리보기 메타도 같이 보강했습니다.

## 적용
현재 Git 프로젝트 루트에 이 ZIP의 내용을 그대로 덮어쓰세요.

```powershell
npm run check
npm run build
npm run dev
```

정상이면:

```powershell
git add .
git commit -m "Improve mobile contact modal and social preview metadata"
git push
```

## 카카오톡 공유 미리보기
배포 후 카카오톡에서 예전 미리보기 정보가 계속 보이면 카카오디벨로퍼스의 URL 메타정보 관리 도구에서 해당 Production URL의 OG 캐시를 초기화해야 합니다.
