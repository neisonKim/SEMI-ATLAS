import ConceptCard from '@/components/ConceptCard';
import IndustryHub from '@/components/IndustryHub';
import PageHero from '@/components/PageHero';
import SectionTitle from '@/components/SectionTitle';
import { byId } from '@/lib/data.mjs';
import { industryHub } from '@/lib/industry-hub.mjs';

export const metadata = {
  title: '반도체 산업 지도',
  description: 'EDA/IP·팹리스·파운드리·장비·소재·OSAT/패키징·시스템의 역할을 연결해 반도체 공급망을 이해하세요.',
  alternates: { canonical: '/industry/' },
  openGraph: {
    title: '반도체 산업 지도',
    description: '회사 이름보다 역할을 먼저 이해하며 반도체 산업 생태계를 하나의 흐름으로 학습합니다.',
    url: '/industry/',
  },
};

export default function IndustryPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="CONNECTED ECOSYSTEM"
        title={<>하나의 칩,<br />여러 분야의 협력.</>}
        description="회사 이름보다 먼저 역할을 이해하세요. 설계 도구와 IP에서 칩 설계·제조·장비·소재·패키징·시스템까지 하나의 공급망으로 연결됩니다."
        image="ecosystem"
        action={<a className="button mint" href="#industry-map">산업 지도부터 보기</a>}
      />

      <section className="section container" id="industry-map">
        <SectionTitle
          eyebrow="THE INDUSTRY HUB"
          title="회사보다 역할을 먼저 연결합니다."
          description="각 단계가 해결하는 문제를 이해하면 새로운 기업을 만나도 공급망에서 어디에 위치하는지 판단하기 쉬워집니다."
        />
        <IndustryHub />
      </section>

      <section className="section surface">
        <div className="container">
          <SectionTitle
            eyebrow="THREE THINGS TO REMEMBER"
            title="산업 지도를 읽을 때 기억할 세 가지"
            description="산업 구조는 기업 목록이 아니라 역할·의존성·지원망으로 이해하는 것이 핵심입니다."
          />
          <div className="industry-principles">
            {industryHub.principles.map((principle, index) => (
              <article key={principle.en}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{principle.en}</small>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionTitle
          eyebrow="MVP INDUSTRY PATH · 28—30"
          title="산업 생태계에서 팹리스와 파운드리까지"
          description="MVP 1.0에서는 28번 전체 산업 구조를 먼저 읽고, 29번 팹리스와 30번 파운드리의 역할 차이를 순서대로 학습합니다."
        />
        <div className="cards three">
          {['ecosystem', 'fabless', 'foundry'].map((id) => <ConceptCard key={id} concept={byId[id]} />)}
        </div>
      </section>

      <section className="section surface">
        <div className="container industry-next-band">
          <div>
            <span className="eyebrow">MVP 2.0 EXPANSION</span>
            <h2>다음에는 공급망의 빈칸을 더 깊게 채웁니다.</h2>
            <p>EDA/IP, 장비·소재, OSAT를 개별 상세 콘텐츠로 확장하면 현재 산업 지도가 더 촘촘한 Semiconductor Knowledge Graph로 발전할 수 있습니다.</p>
          </div>
          <div className="industry-next-list" aria-label="MVP 2.0 산업 확장 후보">
            <span>EDA / IP</span>
            <span>Equipment</span>
            <span>Materials</span>
            <span>OSAT</span>
          </div>
        </div>
      </section>
    </main>
  );
}
