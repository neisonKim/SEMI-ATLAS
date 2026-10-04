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
export const siteName = 'SEMI-ATLAS | 반도체 백과사전';
export const siteDescription = '반도체 입문부터 공정·패키징·산업까지, 30개 핵심 개념을 연결해 배우는 시각형 반도체 학습 플랫폼입니다.';
export const siteLocale = 'ko_KR';
export const socialImagePath = '/assets/hero-fab.webp';

export function absoluteUrl(path = '/') {
  return new URL(path, `${siteUrl}/`).toString();
}
