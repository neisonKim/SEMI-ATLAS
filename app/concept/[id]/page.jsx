import { notFound } from 'next/navigation';
import AssetImage from '@/components/AssetImage';
import { byId, categories, concepts, levels, sources } from '@/lib/data.mjs';
import { absoluteUrl, siteName } from '@/lib/site-config.mjs';
import imageManifest from '@/lib/image-manifest.json';

const imageFileByName = Object.fromEntries(
  imageManifest.map((item) => [item.file.replace(/\.(webp|svg)$/i, ''), item.file]),
);
const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));
const statusLabels = { Draft: '작성 중', Reviewed: '검수됨', Published: '발행됨', 'Needs Update': '업데이트 필요' };
const visualGuideByCategory = { basics: 'foundations', devices: 'computing', process: 'process', packaging: 'hbm', industry: 'industry' };

// Static export only serves the 30 concepts declared below.
export const dynamicParams = false;

export function generateStaticParams() {
  return concepts.map((concept) => ({ id: concept.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const concept = byId[id];
  if (!concept) return {};
  const url = `/concept/${concept.id}/`;
  const imageFile = imageFileByName[concept.image];
  const socialImage = imageFile ? `/assets/${imageFile}` : '/assets/hero-fab.webp';
  return {
    title: concept.title,
    description: concept.summary,
    alternates: { canonical: url },
    openGraph: {
      title: concept.title,
      description: concept.summary,
      url,
      type: 'article',
      images: [{ url: socialImage, alt: `${concept.title} 학습 이미지` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: concept.title,
      description: concept.summary,
      images: [socialImage],
    },
  };
}

function ConceptLinks({ ids }) {
  return (
    <div className="concept-chips">
      {ids.map((id) => <a href={`/concept/${id}/`} key={id}>{byId[id].title}</a>)}
    </div>
  );
}

function RelationshipMap({ concept }) {
  const before = concept.prerequisites.length ? concept.prerequisites : [];
  const after = concept.next.length ? concept.next : [];
  return (
    <div className="relationship-map" aria-label={`${concept.title} 학습 관계`}>
      <div className="relationship-column">
        <span>PREREQUISITE</span>
        {before.length ? before.map((id) => (
          <a href={`/concept/${id}/`} key={id}>{byId[id].title}</a>
        )) : <p>선행지식 없이 시작</p>}
      </div>
      <div className="relationship-arrow" aria-hidden="true">→</div>
      <div className="relationship-current">
        <small>NOW</small>
        <strong>{concept.en}</strong>
        <span>{concept.title}</span>
      </div>
      <div className="relationship-arrow" aria-hidden="true">→</div>
      <div className="relationship-column relationship-next">
        <span>NEXT</span>
        {after.length ? after.map((id) => (
          <a href={`/concept/${id}/`} key={id}>{byId[id].title}</a>
        )) : <a href="/learn/">전체 학습 경로</a>}
      </div>
    </div>
  );
}

export default async function ConceptPage({ params }) {
  const { id } = await params;
  const concept = byId[id];
  if (!concept) notFound();

  const category = categoryById[concept.category];
  const previous = concepts[concept.num - 2];
  const next = concept.next.length ? byId[concept.next[0]] : null;
  const categoryIndex = categories.findIndex((item) => item.id === concept.category);
  const visualGuideId = visualGuideByCategory[concept.category];
  const nextTitles = concept.next.map((nextId) => byId[nextId].title);
  const prerequisiteTitles = concept.prerequisites.map((prerequisiteId) => byId[prerequisiteId].title);
  const faqs = [
    { question: concept.question, answer: concept.answer },
    {
      question: '먼저 무엇을 알고 보면 좋나요?',
      answer: prerequisiteTitles.length
        ? `${prerequisiteTitles.join(', ')}를 먼저 읽으면 이 개념을 더 쉽게 이해할 수 있습니다. 위의 선행지식을 완벽히 외울 필요는 없고, 핵심 역할만 파악한 뒤 돌아와도 충분합니다.`
        : '이 페이지는 별도의 선행지식 없이 시작할 수 있도록 구성했습니다. 한 줄 정의와 핵심 구조부터 읽은 뒤 다음 개념으로 이동하면 됩니다.',
    },
    {
      question: '다음에는 무엇을 공부하면 좋나요?',
      answer: nextTitles.length
        ? `${nextTitles.join(', ')} 순서로 이어가면 현재 개념이 다음 기술과 어떻게 연결되는지 이해하기 쉽습니다.`
        : '이 개념은 MVP 1.0 학습 경로의 마지막 지점입니다. 전체 학습 경로로 돌아가 공정·패키징·산업 구조를 다시 연결해보는 것을 권장합니다.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: concept.title,
    description: concept.summary,
    inLanguage: 'ko',
    articleSection: category.name,
    dateModified: concept.updatedAt,
    mainEntityOfPage: absoluteUrl(`/concept/${concept.id}/`),
    isPartOf: { '@type': 'WebSite', name: siteName, url: absoluteUrl('/') },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/encyclopedia/?category=${concept.category}`) },
      { '@type': 'ListItem', position: 3, name: concept.title, item: absoluteUrl(`/concept/${concept.id}/`) },
    ],
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="container article-shell">
        <nav className="breadcrumbs" aria-label="현재 위치">
          <a href="/">홈</a><span>/</span>
          <a href={`/encyclopedia/?category=${concept.category}`}>{category.name}</a><span>/</span>
          <span aria-current="page">{concept.en}</span>
        </nav>

        <div className="article-layout">
          <article className="article">
            <header className="article-header">
              <div className="article-meta">
                <span className={`level level-${concept.level}`}>{levels[concept.level]}</span>
                <span>개념 {String(concept.num).padStart(2, '0')} / 30</span>
                <span>읽기 약 {concept.minutes}분</span>
                <span className="content-status">{statusLabels[concept.status] ?? concept.status}</span>
              </div>
              <p className="english-title">{concept.en}</p>
              <h1>{concept.title}</h1>
              <p className="article-deck">{concept.summary}</p>
              <p className="updated">Last Updated · {concept.updatedAt}</p>
            </header>

            <figure className="article-image">
              <AssetImage name={concept.image} alt={`${concept.en} 분야의 이해를 돕는 이미지`} eager />
              <figcaption>
                {concept.id === 'integration'
                  ? '2.5D·3D 연결 방식을 단순화한 구조도 · 실제 구조와 비율은 제품마다 다릅니다.'
                  : '관련 분야를 표현한 AI 생성 콘셉트 이미지 · 실제 제품·장비 구조와 다를 수 있습니다.'}
              </figcaption>
            </figure>

            <section id="what">
              <span className="eyebrow">WHAT IT IS</span>
              <h2>무엇인가요?</h2>
              <p>{concept.what}</p>
              <div className="definition-card">
                <span>10초 정의</span>
                <strong>{concept.summary}</strong>
              </div>
            </section>

            <section id="why">
              <span className="eyebrow">WHY IT MATTERS</span>
              <h2>왜 필요한가요?</h2>
              <p>{concept.why}</p>
            </section>

            <section id="how">
              <span className="eyebrow">HOW IT WORKS</span>
              <h2>이렇게 작동합니다.</h2>
              <ol className="explain-steps">
                {concept.steps.map((step, index) => (
                  <li key={step}><span>0{index + 1}</span><p>{step}</p></li>
                ))}
              </ol>
            </section>

            <section id="structure">
              <span className="eyebrow">STRUCTURE</span>
              <h2>구조를 세 부분으로 나눠보세요.</h2>
              <div className="structure-flow">
                {concept.structureLabels.map((label, index) => (
                  <div className="structure-node" key={label}>
                    <small>0{index + 1}</small>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <p className="diagram-note">초보자 학습을 위한 단순화된 구조입니다. 실제 제품과 공정에서는 더 많은 요소와 반복 단계가 포함될 수 있습니다.</p>
            </section>

            <section id="where">
              <span className="eyebrow">IN THE REAL WORLD</span>
              <h2>어디에 쓰이나요?</h2>
              <p>{concept.where}</p>
            </section>

            <section id="industry">
              <span className="eyebrow">INDUSTRY POSITION</span>
              <h2>산업에서는 어디에 연결되나요?</h2>
              <div className="industry-panel">
                <span>{category.en}</span>
                <p>{concept.industry}</p>
                <a className="text-link" href="/industry/">반도체 산업 지도에서 큰 그림 보기</a>
              </div>
            </section>

            <section id="visual-guide">
              <span className="eyebrow">VISUAL GUIDE</span>
              <h2>앞뒤 개념을 한눈에 연결하세요.</h2>
              <p>이 개념을 독립적으로 외우기보다, 먼저 알아야 할 내용과 다음 학습을 함께 보면 전체 반도체 지도가 더 빠르게 연결됩니다.</p>
              <a className="visual-guide-jump" href={`/visual/#guide-${visualGuideId}`}>
                <span>BIG PICTURE</span>
                <strong>대표 Visual Guide에서 이 개념의 위치 보기</strong>
                <b aria-hidden="true">→</b>
              </a>
              <RelationshipMap concept={concept} />
            </section>

            <section id="question">
              <span className="eyebrow">FAQ</span>
              <h2>초보자가 자주 묻는 질문</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details className="faq" open={index === 0} key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="connections" className="connections">
              <span className="eyebrow">CONNECT THE KNOWLEDGE</span>
              <h2>개념을 연결해보세요.</h2>
              {concept.prerequisites.length ? (
                <div className="connection-group">
                  <h3>먼저 알면 더 쉬워요</h3>
                  <ConceptLinks ids={concept.prerequisites} />
                </div>
              ) : <p>이 글은 선행지식 없이 시작할 수 있습니다.</p>}
              <div className="connection-group">
                <h3>함께 보면 이해가 넓어져요</h3>
                <ConceptLinks ids={concept.related} />
              </div>
              <div className="connection-group">
                <h3>학습 순서에서 위치를 확인하세요</h3>
                <a className="text-link" href={`/learn/#phase-${concept.category}`}>{category.name} 학습 경로로 돌아가기</a>
              </div>
            </section>

            <section className="sources" id="references">
              <span className="eyebrow">REFERENCES</span>
              <h2>더 알아보기 · 신뢰할 수 있는 자료</h2>
              <p className="source-intro">공식 기술문서, 산업 표준·협회 자료, 대학 교육자료를 우선해 선별했습니다.</p>
              <ul>
                {concept.refs.map((key) => (
                  <li key={key}>
                    <a href={sources[key][1]} target="_blank" rel="noopener noreferrer">
                      <span className="source-type">{sources[key][2] || '외부 자료'}</span>
                      <span className="source-title">{sources[key][0]}</span>
                      <span className="sr-only"> 새 창</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <nav className="article-navigation" aria-label="학습 이동">
              {previous ? (
                <a href={`/concept/${previous.id}/`}><span>이전 학습</span><b>{previous.title}</b></a>
              ) : (
                <a href="/learn/"><span>학습 경로</span><b>전체 과정 살펴보기</b></a>
              )}
              {next ? (
                <a className="next-lesson" href={`/concept/${next.id}/`}><span>다음으로 읽어보세요</span><b>{next.title}</b></a>
              ) : (
                <a className="next-lesson" href="/learn/"><span>다음 학습을 골라보세요</span><b>전체 학습 경로로 돌아가기</b></a>
              )}
            </nav>
          </article>

          <aside className="article-aside">
            <div className="toc">
              <span className="eyebrow">이 페이지에서</span>
              <a href="#what">무엇인가요?</a>
              <a href="#why">왜 필요한가요?</a>
              <a href="#how">어떻게 작동하나요?</a>
              <a href="#structure">구조</a>
              <a href="#where">어디에 쓰이나요?</a>
              <a href="#industry">산업에서의 위치</a>
              <a href="#visual-guide">Visual Guide</a>
              <a href="#question">FAQ</a>
              <a href="#connections">연결된 개념</a>
              <a href="#references">공식 자료</a>
            </div>
            <div className="aside-course">
              <span>STEP 0{categoryIndex + 1}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <a href={`/learn/#phase-${concept.category}`}>이 과정 살펴보기</a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
