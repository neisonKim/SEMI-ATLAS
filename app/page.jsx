import AssetImage from '@/components/AssetImage';
import HeroSlider from '@/components/HeroSlider';
import ConceptCard from '@/components/ConceptCard';
import SectionTitle from '@/components/SectionTitle';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { byId, categories } from '@/lib/data.mjs';
import { absoluteUrl, siteDescription, siteLocale, siteName, socialImagePath } from '@/lib/site-config.mjs';

const homeTitle = 'SEMI-ATLAS | 연결하며 이해하는 반도체';

export const metadata = {
  title: '연결하며 이해하는 반도체',
  description: siteDescription,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    siteName,
    locale: siteLocale,
    title: homeTitle,
    description: siteDescription,
    url: absoluteUrl('/'),
    images: [{
      url: absoluteUrl(socialImagePath),
      width: 1672,
      height: 941,
      alt: 'SEMI-ATLAS 반도체 백과사전 대표 이미지',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: siteDescription,
    images: [absoluteUrl(socialImagePath)],
  },
};

export default function HomePage() {
  return (
    <main id="main">
      <section className="home-hero">
        <HeroSlider />
        <div className="container hero-content">
          <span className="eyebrow">KNOWLEDGE, CONNECTED.</span>
          <h1>반도체의 큰 그림,<br /><em>첫 개념부터.</em></h1>
          <p>작은 칩은 어떻게 세상을 움직일까요?<br />30개의 개념을 연결하며 기초부터 배워보세요.</p>
          <div className="hero-buttons">
            <a className="button mint" href="/concept/semiconductor/">처음이라면 여기서 시작</a>
            <a className="button light-outline" href="/learn/">전체 학습 경로</a>
          </div>
          <SearchAutocomplete id="home-search" className="hero-search" />
          <div className="quick-search">
            <span>궁금한 개념</span>
            <a href="/concept/wafer/">웨이퍼</a>
            <a href="/concept/hbm/">HBM</a>
            <a href="/concept/lithography/">노광</a>
            <a href="/concept/foundry/">파운드리</a>
          </div>
        </div>
      </section>

      <section className="start-strip">
        <div className="container start-grid">
          <div>
            <span className="eyebrow">A GOOD PLACE TO START</span>
            <h2>검색할 용어를<br />몰라도 괜찮습니다.</h2>
          </div>
          <a href="/concept/semiconductor/">
            <span className="step-no">01</span>
            <div><h3>반도체는 무엇일까?</h3><p>가장 쉬운 첫 개념</p></div>
          </a>
          <a href="/process/">
            <span className="step-no">02</span>
            <div><h3>어떻게 만들어질까?</h3><p>제조 과정의 큰 그림</p></div>
          </a>
          <a href="/industry/">
            <span className="step-no">03</span>
            <div><h3>누가 어떤 일을 할까?</h3><p>산업의 연결 구조</p></div>
          </a>
        </div>
      </section>

      <section className="section container">
        <SectionTitle
          eyebrow="EXPLORE THE KNOWLEDGE"
          title="관심 있는 곳에서 시작하세요."
          description="기초부터 산업까지, 하나로 연결된 반도체 지식."
          action={<a className="text-link" href="/encyclopedia/">전체 30개 개념 보기</a>}
        />
        <div className="category-grid">
          {categories.map((category, index) => (
            <a className="category-card" href={`/encyclopedia/?category=${category.id}`} key={category.id}>
              <AssetImage name={category.image} alt={`${category.name} 분야 이미지`} />
              <div>
                <span className="category-number">0{index + 1}</span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-count">{category.range[1] - category.range[0] + 1}개 개념</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section surface">
        <div className="container">
          <SectionTitle
            eyebrow="ONE CONCEPT AT A TIME"
            title="먼저 알아두면 좋은 개념"
            description="익숙한 단어에서 출발해, 작동 원리까지 이해해보세요."
          />
          <div className="cards three">
            {['wafer', 'transistor', 'hbm'].map((id) => <ConceptCard key={id} concept={byId[id]} />)}
          </div>
        </div>
      </section>

      <section className="section surface">
        <div className="container">
          <SectionTitle
            eyebrow="VISUAL GUIDE"
            title="다섯 장의 큰 그림부터 보세요."
            description="실리콘에서 칩, 계산과 기억, 제조공정, HBM, 산업 생태계를 한눈에 연결합니다."
            action={<a className="text-link" href="/visual/">Visual Guide 5종 보기</a>}
          />
          <div className="home-visual-strip">
            {[
              ['01', '실리콘 → 칩', 'foundations'],
              ['02', '계산 ↔ 기억', 'computing'],
              ['03', '제조공정', 'process'],
              ['04', 'HBM 구조', 'hbm'],
              ['05', '산업 생태계', 'industry'],
            ].map(([number, title, id]) => (
              <a href={`/visual/#guide-${id}`} key={id}><span>{number}</span><strong>{title}</strong></a>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="feature-story">
          <AssetImage name="lithography" alt="웨이퍼 위에 패턴을 전달하는 노광 장비" />
          <div>
            <span className="eyebrow">FROM WAFER TO CHIP</span>
            <h2>쌓고, 그리고, 깎고.<br />반복해서 완성하는 작은 회로.</h2>
            <p>반도체 공정은 한 번의 순서로 끝나지 않습니다. 여러 층을 만들고 검사하는 과정을 연결해서 살펴보세요.</p>
            <a className="button navy" href="/process/">공정 지도 살펴보기</a>
          </div>
        </div>
      </section>

      <section className="learning-band">
        <div className="container">
          <div>
            <span className="eyebrow">YOUR FIRST LEARNING PATH</span>
            <h2>첫 다섯 개념으로 기초를 단단하게.</h2>
            <p>반도체, 전기적 성질, 실리콘, 웨이퍼, 트랜지스터.</p>
          </div>
          <a className="button mint" href="/learn/#phase-basics">입문 과정 살펴보기</a>
        </div>
      </section>
    </main>
  );
}
