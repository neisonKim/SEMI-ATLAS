import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const route = fs.readFileSync(path.join(root, 'app', 'api', 'contact', 'route.js'), 'utf8');
const form = fs.readFileSync(path.join(root, 'components', 'ContactForm.jsx'), 'utf8');
const footer = fs.readFileSync(path.join(root, 'components', 'Footer.jsx'), 'utf8');
const config = fs.readFileSync(path.join(root, 'next.config.mjs'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
const css = fs.readFileSync(path.join(root, 'app', 'globals.css'), 'utf8');

const checks = [
  ['contact API route', route.includes('export async function POST') && route.includes('nodemailer.createTransport')],
  ['gmail smtp', route.includes("host: 'smtp.gmail.com'") && route.includes('CONTACT_GMAIL_APP_PASSWORD')],
  ['target inbox', route.includes("'studiokei805@gmail.com'") && route.includes('CONTACT_MAIL_TO')],
  ['reply-to visitor', route.includes('replyTo:')],
  ['contact form component', form.includes("fetch('/api/contact/'") && form.includes('문의 보내기')],
  ['footer opens form', footer.includes('ContactForm') && footer.includes('setContactOpen(true)')],
  ['nodemailer dependency', Boolean(pkg.dependencies?.nodemailer)],
  ['server runtime enabled', !config.includes("output: 'export'") && !config.includes('output:"export"')],
  ['environment template', env.includes('CONTACT_GMAIL_USER=') && env.includes('CONTACT_GMAIL_APP_PASSWORD=') && env.includes('CONTACT_MAIL_TO=')],
  ['contact modal CSS', css.includes('.contact-dialog-backdrop') && css.includes('.contact-form') && css.includes('.contact-success')],
  ['mobile compact contact sheet', css.includes('max-height:min(76dvh,620px)') && css.includes('position:sticky') && css.includes('height:118px')],
  ['focus without scrolling header away', form.includes('focus({ preventScroll: true })') && form.includes('dialogRef.current.scrollTop = 0')],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  for (const [name] of failed) console.error(`FAIL: ${name}`);
  process.exit(1);
}

console.log('Contact form PASS · Next.js API + Gmail SMTP + recipient + reply-to + modal form + env template.');
