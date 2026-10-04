import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { absoluteUrl, siteDescription, siteLocale, siteName, siteUrl, socialImagePath } from '@/lib/site-config.mjs';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName,
    locale: siteLocale,
    title: siteName,
    description: siteDescription,
    url: absoluteUrl('/'),
    images: [{ url: absoluteUrl(socialImagePath), width: 1672, height: 941, alt: 'SEMI-ATLAS 반도체 백과사전 대표 이미지' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [absoluteUrl(socialImagePath)],
  },
};

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: absoluteUrl('/'),
    description: siteDescription,
    inLanguage: 'ko',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/encyclopedia/')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="ko">
      <body id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <Header />
        <div className="site-page-reveal">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
