import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_NAME = 60;
const MAX_EMAIL = 160;
const MAX_SUBJECT = 120;
const MAX_MESSAGE = 4000;

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Honeypot: bots often fill hidden fields. Return success without sending.
    if (clean(data.website, 200)) {
      return Response.json({ ok: true });
    }

    const name = clean(data.name, MAX_NAME);
    const email = clean(data.email, MAX_EMAIL);
    const subject = clean(data.subject, MAX_SUBJECT) || '웹사이트 문의';
    const message = clean(data.message, MAX_MESSAGE);

    if (name.length < 2) {
      return Response.json({ ok: false, message: '이름을 2자 이상 입력해주세요.' }, { status: 400 });
    }
    if (!validEmail(email)) {
      return Response.json({ ok: false, message: '회신받을 이메일 주소를 확인해주세요.' }, { status: 400 });
    }
    if (message.length < 10) {
      return Response.json({ ok: false, message: '문의 내용을 10자 이상 입력해주세요.' }, { status: 400 });
    }

    const gmailUser = process.env.CONTACT_GMAIL_USER;
    const gmailAppPassword = process.env.CONTACT_GMAIL_APP_PASSWORD;
    const mailTo = process.env.CONTACT_MAIL_TO || 'studiokei805@gmail.com';

    if (!gmailUser || !gmailAppPassword) {
      console.error('Contact mail environment variables are not configured.');
      return Response.json(
        { ok: false, message: '문의 메일 설정이 아직 완료되지 않았습니다.' },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

    await transporter.sendMail({
      from: `SEMI-ATLAS 문의 <${gmailUser}>`,
      to: mailTo,
      replyTo: `${name} <${email}>`,
      subject: `[SEMI-ATLAS 문의] ${subject}`,
      text: [
        'SEMI-ATLAS 웹사이트 문의',
        '',
        `이름: ${name}`,
        `회신 이메일: ${email}`,
        `제목: ${subject}`,
        '',
        message,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,'Noto Sans KR',sans-serif;line-height:1.7;color:#172b3a">
          <h2 style="margin:0 0 18px">SEMI-ATLAS 웹사이트 문의</h2>
          <table style="border-collapse:collapse;margin-bottom:22px">
            <tr><td style="padding:5px 18px 5px 0;color:#667b8b">이름</td><td>${safeName}</td></tr>
            <tr><td style="padding:5px 18px 5px 0;color:#667b8b">회신 이메일</td><td>${safeEmail}</td></tr>
            <tr><td style="padding:5px 18px 5px 0;color:#667b8b">제목</td><td>${safeSubject}</td></tr>
          </table>
          <div style="padding:18px;border:1px solid #d8e5eb;border-radius:8px;background:#f7fafb">${safeMessage}</div>
        </div>
      `,
    });

    return Response.json({ ok: true, message: '문의가 전송되었습니다.' });
  } catch (error) {
    console.error('Contact form send failed:', error);
    return Response.json(
      { ok: false, message: '메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
