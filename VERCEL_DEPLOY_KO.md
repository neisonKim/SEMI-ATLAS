# Vercel 배포 가이드 · v1.9 Release Candidate

## 1. 로컬 최종 검사

```powershell
npm install
npm run release:check
```

`release:check`는 다음을 한 번에 실행합니다.

1. 30개 개념/관계/검색/Visual Guide/공정/산업/반응형/SEO 데이터 검사
2. Next.js production build
3. `out/` 정적 Export 핵심 파일 검사
4. 37개 공개 URL sitemap 검사
5. Export된 HTML 내부 링크 검사

정상 종료 시 `out/` 폴더가 생성됩니다.

## 2. GitHub 업로드

프로젝트 루트를 Git 저장소로 만들고 GitHub에 push합니다. `.env.local`, `.next`, `out`, `node_modules`는 `.gitignore`에 의해 제외됩니다.

## 3. Vercel Import

Vercel에서 GitHub 저장소를 Import합니다. Framework Preset은 Next.js 자동 감지를 사용합니다.

## 4. 환경변수

Vercel Project Settings → Environment Variables에 아래 값을 등록합니다.

```env
NEXT_PUBLIC_SITE_URL=https://실제-공개-도메인
```

처음 Vercel 임시 도메인으로 확인할 경우 1차 배포 후 부여된 `https://프로젝트명.vercel.app`을 등록하고 다시 배포합니다. 커스텀 도메인을 연결한 뒤에는 그 주소로 다시 변경합니다.

## 5. 배포 후 확인

- `/`
- `/encyclopedia/`
- `/learn/`
- `/process/`
- `/packaging/`
- `/industry/`
- `/visual/`
- `/concept/semiconductor/`
- `/concept/hbm/`
- `/concept/foundry/`
- `/robots.txt`
- `/sitemap.xml`

그리고 Chrome DevTools에서 360 / 390 / 430 / 768 / 1024px 화면을 마지막으로 확인합니다.

## 6. MVP 1.0 Release 기준

아래가 모두 통과하면 MVP 1.0 Release Candidate를 실제 공개본으로 승격할 수 있습니다.

- `npm run release:check` PASS
- Vercel Production 배포 PASS
- 30개 개념 상세 진입 PASS
- 자동완성 검색 PASS
- 모바일 QA PASS
- 실제 도메인 canonical / robots / sitemap PASS
