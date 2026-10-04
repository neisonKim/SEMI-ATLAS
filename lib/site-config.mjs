const FALLBACK_SITE_URL = 'https://semiconductor-knowledge-atlas.neisonkim.chatgpt.site';

function normalizeSiteUrl(value) {
  const raw = (value || FALLBACK_SITE_URL).trim();
  const url = new URL(raw);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must use http:// or https://');
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be the site root only, e.g. https://example.com');
  }

  return url.origin;
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const siteName = '반도체 백과사전';
export const siteDescription = '30개의 핵심 개념과 학습 경로로 반도체의 기초, 공정, 패키징, 산업을 이해하세요.';
export const siteLocale = 'ko_KR';

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString();
}
