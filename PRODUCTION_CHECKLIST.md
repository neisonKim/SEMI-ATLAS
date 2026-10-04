# Production checklist · v1.8

## 1. 실제 도메인 지정
프로젝트 루트에 `.env.local`을 만들고 아래 값을 실제 배포 주소로 설정합니다.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

도메인이 아직 없다면 `.env.example`의 기본 주소로도 개발/빌드는 가능합니다. 실제 공개 전에는 반드시 실제 도메인으로 교체하세요.

## 2. 검증

```powershell
npm install
npm run check
npm run build
```

`npm run check`는 30개 데이터, 검색, Visual Guide, 공정/산업 Hub, 반응형 규칙과 함께 robots/sitemap SEO 설정도 검사합니다.

## 3. 정적 Export 결과
`npm run build` 성공 후 `out/` 폴더가 생성되어야 합니다. 아래 파일도 함께 존재해야 합니다.

- `out/index.html`
- `out/encyclopedia/index.html`
- `out/concept/hbm/index.html`
- `out/robots.txt`
- `out/sitemap.xml`

## 4. 배포 후 확인
- 실제 도메인의 `/robots.txt`
- 실제 도메인의 `/sitemap.xml`
- 홈 canonical/Open Graph
- 개념 페이지 canonical/Article JSON-LD/Breadcrumb JSON-LD
- 모바일 360/390/430/768/1024px
- 홈/백과사전 자동완성 검색

## 5. Vercel
Next.js 프로젝트로 Import한 뒤 환경변수 `NEXT_PUBLIC_SITE_URL`을 Production 도메인으로 등록하고 재배포합니다.
