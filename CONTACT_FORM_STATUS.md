# SEMI-ATLAS Contact Form · v1.15

사이트 Footer의 `studiokei805@gmail.com`을 클릭하면 문의 폼이 열리고, 작성한 내용을 Next.js API Route가 Gmail SMTP를 통해 `studiokei805@gmail.com`으로 전송합니다.

## Vercel 환경변수

아래 3개를 Vercel → Project → Settings → Environment Variables에 등록합니다.

- `CONTACT_GMAIL_USER=studiokei805@gmail.com`
- `CONTACT_GMAIL_APP_PASSWORD=<Google 앱 비밀번호 16자리>`
- `CONTACT_MAIL_TO=studiokei805@gmail.com`

`CONTACT_GMAIL_APP_PASSWORD`는 **Secret**으로 저장하세요. 일반 Gmail 로그인 비밀번호를 넣으면 안 됩니다.

## Google 앱 비밀번호 준비

1. Google 계정에서 2단계 인증을 켭니다.
2. Google 계정의 앱 비밀번호(App passwords)에서 새 앱 비밀번호를 생성합니다.
3. 생성된 16자리 값을 Vercel의 `CONTACT_GMAIL_APP_PASSWORD`에 저장합니다.
4. 환경변수를 저장한 뒤 Vercel에서 Redeploy 합니다.

## 구조 변경

문의 API가 서버에서 실행되어야 하므로 `next.config.mjs`의 `output: 'export'`는 제거되었습니다. Vercel의 일반 Next.js 배포 방식을 사용합니다.
