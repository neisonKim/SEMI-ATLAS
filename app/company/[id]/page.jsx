import { notFound } from 'next/navigation';
import GlossaryText from '@/components/GlossaryText';
import CompanyCard from '@/components/CompanyCard';
import CompanyLogo from '@/components/CompanyLogo';
import CompanyMedia from '@/components/CompanyMedia';
import { companyMedia, companyMediaCheckedAt } from '@/lib/company-media.mjs';
import { byId } from '@/lib/data.mjs';
import { companies, companyById, companyCountryById, companyRelationKinds, companySources, companyStageById, getRelatedCompanies } from '@/lib/companies.mjs';
import { absoluteUrl, siteName } from '@/lib/site-config.mjs';

export const dynamicParams = false;
export function generateStaticParams() { return companies.map(company => ({ id: company.id })); }
export async function generateMetadata({ params }) {
  const company = companyById[(await params).id];
  if (!company) return {};
  const image = companyMedia[company.id].image;
  return { title: `${company.name} · 기업 사전`, description: company.summary, alternates: { canonical: `/company/${company.id}/` }, openGraph: { title: `${company.name} · 기업 사전`, description: company.summary, url: `/company/${company.id}/`, type: 'article', images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] }, twitter: { card: 'summary_large_image', images: [image.src] } };
}

export default async function CompanyPage({ params }) {
  const company = companyById[(await params).id];
  if (!company) notFound();
  const media = companyMedia[company.id];
  const related = getRelatedCompanies(company.id);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: `${company.name} · 기업의 역할과 연결 개념`, description: company.summary, dateModified: companyMediaCheckedAt, image: absoluteUrl(media.image.src), inLanguage: 'ko', mainEntityOfPage: absoluteUrl(`/company/${company.id}/`), isPartOf: { '@type': 'WebSite', name: siteName, url: absoluteUrl('/') }, about: { '@type': 'Organization', name: company.en, alternateName: company.name, url: company.website, logo: absoluteUrl(media.logo.src) } };
  const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: absoluteUrl('/') }, { '@type': 'ListItem', position: 2, name: '기업 사전', item: absoluteUrl('/companies/') }, { '@type': 'ListItem', position: 3, name: company.name, item: absoluteUrl(`/company/${company.id}/`) }] };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="container company-detail-shell">
        <nav className="breadcrumbs" aria-label="현재 위치"><a href="/">홈</a><span>/</span><a href="/companies/">기업 사전</a><span>/</span><span aria-current="page">{company.name}</span></nav>
        <div className="article-layout company-detail-layout">
          <article className="article company-article">
            <header className="article-header company-detail-header">
              <span className="eyebrow">COMPANY ENCYCLOPEDIA</span>
              <CompanyLogo company={company} eager />
              <p className="english-title">{company.en}</p><h1>{company.name}</h1>
              <p className="article-deck"><GlossaryText text={company.summary} maxTerms={4} /></p>
              <div className="company-stage-tags">{company.stages.map(id => <a key={id} href={`/companies/?stage=${id}`}>{companyStageById[id].label}</a>)}</div>
              <dl className="company-profile-facts"><div><dt>본사 국가·지역</dt><dd>{companyCountryById[company.country].label}</dd></div><div><dt>자료 확인일</dt><dd><time dateTime={company.checkedAt}>{company.checkedAt}</time></dd></div><div><dt>공식 웹사이트</dt><dd><a href={company.website} target="_blank" rel="noopener noreferrer">{new URL(company.website).hostname}<span className="sr-only"> 새 창</span> ↗</a></dd></div></dl>
            </header>
            <section id="company-media" className="company-media-section"><span className="eyebrow">PRODUCTS & PLACES</span><h2>제품과 현장으로 만나보기</h2><CompanyMedia company={company} /><p className="company-logo-source">로고 · {media.logo.credit} · <a href={media.logo.sourceUrl} target="_blank" rel="noopener noreferrer">로고 출처<span className="sr-only"> · 새 창</span> ↗</a></p></section>
            <section id="role"><span className="eyebrow">ROLE IN THE INDUSTRY</span><h2>어떤 일을 하나요?</h2><p><GlossaryText text={company.role} maxTerms={5} /></p><div className="company-role-descriptions">{company.stages.map(id => <div key={id}><strong>{companyStageById[id].label}</strong><p>{companyStageById[id].description}</p></div>)}</div></section>
            <section id="analogy"><span className="eyebrow">AN EVERYDAY ANALOGY</span><h2>쉽게 비유하면</h2><div className="analogy-card"><p><GlossaryText text={company.analogy} maxTerms={3} /></p></div></section>
            <section id="technologies"><span className="eyebrow">PRODUCTS & TECHNOLOGIES</span><h2>이 제품과 기술로 연결됩니다.</h2><div className="company-technology-list">{company.technologies.map(technology => <div key={technology.name}><h3>{technology.name}</h3><p><GlossaryText text={technology.description} maxTerms={3} /></p><a href={companySources[technology.source][1]} target="_blank" rel="noopener noreferrer">공식 자료 보기<span className="sr-only"> · {technology.name} · 새 창</span> ↗</a></div>)}</div></section>
            <section id="concepts"><span className="eyebrow">CONNECT THE KNOWLEDGE</span><h2>이 기업을 이해하는 {company.concepts.length}개 개념</h2><p>연결의 종류와 이유를 함께 읽고, 필요한 개념부터 살펴보세요.</p><div className="company-concept-list">{company.concepts.map(connection => <div className="company-concept-connection" key={connection.id} data-concept-id={connection.id}><span className="company-connection-kind">{companyRelationKinds[connection.kind]}</span><a href={`/concept/${connection.id}/`}><span>{String(byId[connection.id].num).padStart(2, '0')}</span><strong>{byId[connection.id].title}</strong><b aria-hidden="true">→</b></a><p>{connection.reason}</p></div>)}</div></section>
            <section id="distinction"><span className="eyebrow">ONE THING TO REMEMBER</span><h2>이 점을 구분해보세요.</h2><div className="company-distinction"><p><GlossaryText text={company.distinction} maxTerms={4} /></p></div></section>
            {related.length > 0 && <section id="related-companies"><span className="eyebrow">SHARED LEARNING TOPICS</span><h2>같은 개념으로 함께 살펴보기</h2><p>공통된 학습 개념을 기준으로 이어지는 기업입니다.</p><div className="company-related-grid">{related.map(item => <div key={item.company.id}><CompanyCard company={item.company} /><p className="company-shared-topics">공통 개념 · {item.shared.slice(0, 3).map(id => byId[id].en).join(' · ')}</p></div>)}</div></section>}
            <section id="references" className="sources"><span className="eyebrow">PRIMARY SOURCES</span><h2>공식 자료에서 더 알아보기</h2><p className="source-intro">기업의 사업 소개와 기술 자료를 참고해 학습용으로 정리했습니다. 확인일은 {company.checkedAt}입니다.</p><ul>{company.refs.map(key => <li key={key}><a href={companySources[key][1]} target="_blank" rel="noopener noreferrer"><span className="source-type">{companySources[key][2]}</span><span className="source-title">{companySources[key][0]}</span><span className="sr-only"> 새 창</span></a></li>)}</ul></section>
            <nav className="company-bottom-nav" aria-label="기업 학습 이동"><a className="button navy" href="/companies/">전체 기업 사전</a><a className="text-link" href="/industry/">산업 지도에서 역할 보기 →</a></nav>
          </article>
          <aside className="article-aside"><nav className="toc" aria-label="이 페이지에서"><span className="eyebrow">이 페이지에서</span><a href="#company-media">제품과 현장</a><a href="#role">기업의 역할</a><a href="#analogy">쉽게 비유하면</a><a href="#technologies">제품·기술</a><a href="#concepts">연결된 개념</a><a href="#distinction">구분할 점</a>{related.length > 0 && <a href="#related-companies">함께 볼 기업</a>}<a href="#references">공식 자료</a></nav><div className="aside-course"><span>KEEP EXPLORING</span><h3>역할로 산업 읽기</h3><p>기업마다 다른 역할이 하나의 칩과 시스템으로 연결됩니다.</p><a href="/companies/">다른 기업 찾아보기 →</a></div></aside>
        </div>
      </div>
    </main>
  );
}
