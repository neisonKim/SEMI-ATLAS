import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: '반도체 백과사전 검색',
  description: '웨이퍼·HBM·파운드리 등 30개 반도체 개념을 한글, 영문, 약칭으로 검색하세요.',
  alternates: { canonical: '/encyclopedia/' },
  openGraph: {
    title: '반도체 백과사전 검색',
    description: '웨이퍼·HBM·파운드리 등 30개 반도체 개념을 한글, 영문, 약칭으로 검색하세요.',
    url: '/encyclopedia/',
  },
};

export default function EncyclopediaPage() {
  return (
    <main id="main">
      <SearchClient />
    </main>
  );
}
