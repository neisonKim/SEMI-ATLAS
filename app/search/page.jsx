import UnifiedSearchClient from '@/components/UnifiedSearchClient';
import { searchIndex } from '@/lib/search-index.mjs';

const description = '반도체 개념 30개와 기업 50개를 한곳에서 검색하세요. 한글·영문·별칭·제품·기술명으로 개념과 관련 기업을 함께 찾습니다.';
export const metadata = {
  title: '개념·기업 통합 검색', description,
  alternates: { canonical: '/search/' },
  openGraph: { title: '개념·기업 통합 검색', description, url: '/search/' },
};

export default function SearchPage() {
  return <main id="main"><UnifiedSearchClient items={searchIndex} /></main>;
}
