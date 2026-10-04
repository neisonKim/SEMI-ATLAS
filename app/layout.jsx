import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { absoluteUrl, siteDescription, siteLocale, siteName, siteUrl } from '@/lib/site-config.mjs';

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
    url: '/',
    images: [{ url: '/assets/hero-fab.webp', width: 1536, height: 1024, alt: '반도체 제조 장비와 웨이퍼' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/assets/hero-fab.webp'],
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
