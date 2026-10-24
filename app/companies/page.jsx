import CompanyDirectory from '@/components/CompanyDirectory';
import { concepts } from '@/lib/data.mjs';
import { companies, companyCheckedAt } from '@/lib/companies.mjs';
import { absoluteUrl } from '@/lib/site-config.mjs';

export const metadata = {
  title: '반도체 기업 사전',
  description: '주요 반도체 기업 10개의 역할과 기술을 배우고, 설계·제조·메모리·장비·소재·패키징에서 관련 개념으로 이어가세요.',
  alternates: { canonical: '/companies/' },
  openGraph: { title: '반도체 기업 사전', description: '기업의 역할에서 기술 개념으로, 개념에서 실제 산업으로.', url: '/companies/' },
};

export default function CompaniesPage() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: '반도체 기업 사전', url: absoluteUrl('/companies/'), inLanguage: 'ko', dateModified: companyCheckedAt, mainEntity: { '@type': 'ItemList', numberOfItems: companies.length, itemListElement: companies.map((company, index) => ({ '@type': 'ListItem', position: index + 1, name: company.name, url: absoluteUrl(`/company/${company.id}/`) })) } };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="company-directory-hero">
        <div className="container">
          <nav className="company-breadcrumbs" aria-label="현재 위치"><a href="/">홈</a><span>/</span><a href="/industry/">산업 지도</a><span>/</span><span aria-current="page">기업 사전</span></nav>
          <span className="eyebrow">THE PEOPLE BEHIND THE CHIPS</span>
          <h1>배운 개념이,<br />기업의 역할로 이어집니다.</h1>
          <p>누가 설계하고, 누가 만들고, 누가 연결할까요?<br />주요 기업 10개에서 시작해 반도체 산업의 분업을 살펴보세요.</p>
          <div className="company-hero-facts"><span><b>{companies.length}</b>개 기업</span><span><b>8</b>개 역할 분야</span><span>공식 자료 기준 <time dateTime={companyCheckedAt}>{companyCheckedAt}</time></span></div>
        </div>
      </header>
      <CompanyDirectory conceptOptions={concepts.map(({ id, title }) => ({ id, title }))} />
      <div className="container company-directory-note"><p>제품·서비스와 직접 연결된 개념, 사업 역할, 이해를 돕는 배경 원리를 구분해 설명합니다. 한 기업의 전체 사업을 모두 나열한 목록은 아닙니다.</p><a className="text-link" href="/industry/">산업 지도로 전체 역할 다시 보기 →</a></div>
    </main>
  );
}
