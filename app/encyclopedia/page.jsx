import SearchClient from '@/components/SearchClient';

export const metadata = {
  title: '반도체 백과사전 검색',
  description: '반도체 개념 40개를 검색하거나 가나다·ABC 색인에서 한글명, 영문명, 약칭으로 찾아보세요.',
  alternates: { canonical: '/encyclopedia/' },
  openGraph: {
    title: '반도체 백과사전 검색',
    description: '반도체 개념 40개를 검색하거나 가나다·ABC 색인에서 한글명, 영문명, 약칭으로 찾아보세요.',
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
