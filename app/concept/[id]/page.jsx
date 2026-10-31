import { notFound } from 'next/navigation';
import AssetImage from '@/components/AssetImage';
import GlossaryText from '@/components/GlossaryText';
import CompanyCard from '@/components/CompanyCard';
import LessonProgress from '@/components/LessonProgress';
import ConceptQuiz from '@/components/ConceptQuiz';
import { conceptQuizzes } from '@/lib/concept-quizzes.mjs';
import { getCompaniesForConcept } from '@/lib/companies.mjs';
import { byId, categories, concepts, getLearningNavigation, levels, sources } from '@/lib/data.mjs';
import { absoluteUrl, siteName } from '@/lib/site-config.mjs';
import imageManifest from '@/lib/image-manifest.json';

const imageFileByName = Object.fromEntries(
  imageManifest.map((item) => [item.file.replace(/\.(webp|svg)$/i, ''), item.file]),
);
const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));
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

function RelationshipMap({ concept, next }) {
  const before = concept.prerequisites.length ? concept.prerequisites : [];
  return (
    <div className="relationship-map" aria-label={`${concept.title} 학습 관계`}>
      <div className="relationship-column">
        <span>먼저 알면 좋아요</span>
        {before.length ? before.map((id) => (
          <a href={`/concept/${id}/`} key={id}>{byId[id].title}</a>
        )) : <p>선행지식 없이 시작</p>}
      </div>
      <div className="relationship-arrow" aria-hidden="true">→</div>
      <div className="relationship-current">
        <small>지금 읽는 개념</small>
        <strong>{concept.en}</strong>
        <span>{concept.title}</span>
      </div>
      <div className="relationship-arrow" aria-hidden="true">→</div>
      <div className="relationship-column relationship-next">
        <span>학습 순서의 다음</span>
        {next ? <a href={`/concept/${next.id}/`}>{next.title}</a> : <a href="/learn/">전체 학습 경로</a>}
      </div>
    </div>
  );
}

export default async function ConceptPage({ params }) {
  const { id } = await params;
  const concept = byId[id];
  if (!concept) notFound();

  const category = categoryById[concept.category];
  const linkedCompanies = getCompaniesForConcept(id);
  const { previous, next } = getLearningNavigation(id);
  const relatedIds = concept.related.filter((relatedId) => !concept.prerequisites.includes(relatedId) && relatedId !== next?.id);
  const categoryIndex = categories.findIndex((item) => item.id === concept.category);
  const visualGuideId = visualGuideByCategory[concept.category];
  const faqs = [{ question: concept.question, answer: concept.answer }];

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
                <span>개념 {String(concept.num).padStart(2, '0')} / {concepts.length}</span>
                <span>읽기 약 {concept.minutes}분</span>
              </div>
              <p className="english-title">{concept.en}</p>
              <h1>{concept.title}</h1>
              <p className="article-deck"><GlossaryText text={concept.summary} maxTerms={4} /></p>
              <p className="updated">Last Updated · {concept.updatedAt}</p>
              <div className="glossary-guide" aria-label="용어 도움말 안내">
                <span>GLOSSARY</span>
                <p><b>점선 밑줄</b> 용어를 탭하거나 마우스를 올리면 한 줄 설명을 볼 수 있습니다.</p>
              </div>
              <LessonProgress key={id} conceptId={id} />
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
              <p><GlossaryText text={concept.what} /></p>
              <div className="definition-card">
                <span>10초 정의</span>
                <strong><GlossaryText text={concept.summary} maxTerms={3} /></strong>
              </div>
            </section>

            <section id="analogy">
              <span className="eyebrow">AN EVERYDAY ANALOGY</span>
              <h2>비유로 먼저 이해해보세요.</h2>
              <div className="analogy-card">
                <h3>{concept.analogy.title}</h3>
                <p><GlossaryText text={concept.analogy.body} maxTerms={4} /></p>
                <p className="analogy-limit"><b>비유의 범위</b> {concept.analogy.limit}</p>
              </div>
            </section>

            <section id="why">
              <span className="eyebrow">WHY IT MATTERS</span>
              <h2>왜 필요한가요?</h2>
              <p><GlossaryText text={concept.why} /></p>
            </section>

            <section id="how">
              <span className="eyebrow">HOW IT WORKS</span>
              <h2>이렇게 작동합니다.</h2>
              <ol className="explain-steps">
                {concept.steps.map((step, index) => (
                  <li key={step}><span>0{index + 1}</span><p><GlossaryText text={step} maxTerms={4} /></p></li>
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
                    <p><GlossaryText text={concept.structureDescriptions[index]} maxTerms={3} /></p>
                  </div>
                ))}
              </div>
              <p className="diagram-note">초보자 학습을 위한 단순화된 구조입니다. 실제 제품과 공정에서는 더 많은 요소와 반복 단계가 포함될 수 있습니다.</p>
            </section>

            <section id="numbers">
              <span className="eyebrow">NUMBERS WITH CONTEXT</span>
              <h2>숫자로 감을 잡아보세요.</h2>
              <p className="numbers-intro">자료에 나온 값은 적용 조건과 함께, 계산 예시는 가정과 함께 읽어보세요.</p>
              <ul className="number-grid">
                {concept.numbers.map((number) => (
                  <li className="number-card" key={number.label} data-number-kind={number.kind}>
                    <span className={`number-kind number-kind-${number.kind}`}>{number.kind === 'example' ? '계산 예시' : '자료의 수치'}</span>
                    <p className="number-value">{number.value}</p>
                    <h3>{number.label}</h3>
                    <p className="number-meaning"><GlossaryText text={number.meaning} maxTerms={3} /></p>
                    {number.formula && <p className="number-formula">{number.formula}</p>}
                    <p className="number-scope"><b>적용 범위</b> {number.scope}</p>
                    <div className="number-source">
                      <a href={sources[number.source][1]} target="_blank" rel="noopener noreferrer">{number.kind === 'example' ? '원리·단위 참고' : '수치 출처'} · {sources[number.source][0]}<span className="sr-only"> 새 창</span></a>
                      <time dateTime={number.checkedAt}>자료 확인 {number.checkedAt}</time>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="where">
              <span className="eyebrow">IN THE REAL WORLD</span>
              <h2>어디에 쓰이나요?</h2>
              <p><GlossaryText text={concept.where} /></p>
            </section>

            <section id="industry">
              <span className="eyebrow">INDUSTRY POSITION</span>
              <h2>산업에서는 어디에 연결되나요?</h2>
              <div className="industry-panel">
                <span>{category.en}</span>
                <p><GlossaryText text={concept.industry} /></p>
                <a className="text-link" href="/industry/">반도체 산업 지도에서 큰 그림 보기</a>
              </div>
            </section>

            <section id="companies">
              <span className="eyebrow">CONCEPTS IN THE INDUSTRY</span>
              <h2>어떤 기업의 역할과 연결될까요?</h2>
              <p>기업의 제품·서비스, 사업 역할, 배경 원리를 이 개념과 연결해보세요.</p>
              <div className="company-concept-grid">
                {linkedCompanies.map(({ company, connection }) => <CompanyCard company={company} connection={connection} key={company.id} />)}
              </div>
              <a className="text-link company-section-link" href={`/companies/?concept=${id}`}>이 개념에 연결된 기업 모아보기 →</a>
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
            </section>

            <section id="misconceptions">
              <span className="eyebrow">COMMON MISCONCEPTIONS</span>
              <h2>이렇게 오해하기 쉬워요.</h2>
              {concept.misconceptions.map((item) => (
                <div className="misconception-card" key={item.claim}>
                  <p className="misconception-claim"><span>흔한 오해</span><strong>{item.claim}</strong></p>
                  <p><b className="correction-label">바르게 이해하기</b><GlossaryText text={item.correction} maxTerms={4} /></p>
                </div>
              ))}
            </section>

            <section id="question">
              <span className="eyebrow">FAQ</span>
              <h2>초보자가 자주 묻는 질문</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <details className="faq" open={index === 0} key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p><GlossaryText text={faq.answer} maxTerms={5} /></p>
                  </details>
                ))}
              </div>
            </section>

            <ConceptQuiz key={id} conceptId={id} questions={conceptQuizzes[id]} />

            <section id="connections" className="connections">
              <span className="eyebrow">CONNECT THE KNOWLEDGE</span>
              <h2>개념을 연결해보세요.</h2>
              <p>먼저 알면 좋은 개념은 이해를 돕는 배경지식입니다. 아래의 이전·다음 학습은 전체 학습 경로의 순서를 따릅니다.</p>
              <RelationshipMap concept={concept} next={next} />
              {relatedIds.length > 0 && <div className="connection-group">
                <h3>함께 보면 이해가 넓어져요</h3>
                <ConceptLinks ids={relatedIds} />
              </div>}
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
              <a href="#analogy">비유로 이해하기</a>
              <a href="#why">왜 필요한가요?</a>
              <a href="#how">어떻게 작동하나요?</a>
              <a href="#structure">구조</a>
              <a href="#numbers">핵심 수치·계산 예시</a>
              <a href="#where">어디에 쓰이나요?</a>
              <a href="#industry">산업에서의 위치</a>
              <a href="#companies">연결된 기업</a>
              <a href="#visual-guide">Visual Guide</a>
              <a href="#misconceptions">흔한 오해</a>
              <a href="#question">FAQ</a>
              <a href="#quiz">학습 확인 퀴즈</a>
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
