import AssetImage from '@/components/AssetImage';
import ConceptCard from '@/components/ConceptCard';
import PageHero from '@/components/PageHero';
import ProcessHub from '@/components/ProcessHub';
import SectionTitle from '@/components/SectionTitle';
import { concepts } from '@/lib/data.mjs';
import { processHub } from '@/lib/process-hub.mjs';

export const metadata = {
  title: '반도체 공정 지도',
  description: '산화·노광·DUV/EUV·식각·증착·CVD·ALD·이온주입·CMP·세정을 12~22번 학습 경로로 연결해 이해하세요.',
  alternates: { canonical: '/process/' },
  openGraph: {
    title: '반도체 공정 지도',
    description: '웨이퍼 위에 회로를 만드는 핵심 제조공정을 하나의 학습 Hub로 연결합니다.',
    url: '/process/',
  },
};

export default function ProcessPage() {
  const processConcepts = concepts.filter((concept) => concept.category === 'process');

  return (
    <main id="main">
      <PageHero
        eyebrow="FROM WAFER TO CHIP"
        title={<>작은 회로는<br />어떻게 만들어질까요?</>}
        description="12~22번 핵심 개념을 따라가며, 웨이퍼 위에 회로를 만드는 제조공정의 큰 그림과 반복 구조를 이해합니다."
        image="process-overview"
        action={<a className="button mint" href="#process-map">공정 지도부터 보기</a>}
      />

      <section className="section container" id="process-map">
        <SectionTitle
          eyebrow="THE PROCESS HUB"
          title="11개 핵심 개념을 하나의 흐름으로"
          description="각 노드는 개념 상세페이지로 연결됩니다. 처음이라면 12번 전체 공정을 읽고 13번부터 순서대로 따라가세요."
        />
        <ProcessHub />
      </section>

      <section className="section surface">
        <div className="container">
          <SectionTitle
            eyebrow="THREE THINGS TO REMEMBER"
            title="공정 이름보다 먼저 이해할 세 가지"
            description="반도체 제조는 단순한 순서 암기보다 반복·선택성·검증이라는 원리를 이해하는 것이 중요합니다."
          />
          <div className="process-principles">
            {processHub.principles.map((principle, index) => (
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
          eyebrow="EXPLORE THE PROCESS"
          title="공정 하나씩 깊게 보기"
          description="정의 → 필요한 이유 → 작동 방식 → 구조 → 산업 연결 → 다음 학습 순서로 읽을 수 있습니다."
        />
        <div className="cards three">
          {processConcepts.map((concept) => <ConceptCard key={concept.id} concept={concept} compact />)}
        </div>
      </section>

      <section className="section surface">
        <div className="container process-handoff">
          <div className="process-handoff-copy">
            <span className="eyebrow">AFTER FABRICATION</span>
            <h2>웨이퍼 위 회로가 완성되면,<br />칩을 시스템과 연결합니다.</h2>
            <p>제조공정 이후에는 웨이퍼를 다이 단위로 분리하고 검사한 뒤, 전기 연결·보호·열 관리를 담당하는 패키징 단계로 넘어갑니다.</p>
            <div className="hero-buttons">
              <a className="button navy" href="/concept/packaging/">23. 패키징 이해하기</a>
              <a className="button" href="/packaging/">패키징 Hub 보기</a>
            </div>
          </div>
          <AssetImage name="advanced-packaging" alt="로직 칩과 메모리 칩을 함께 배치한 패키지" />
        </div>
      </section>
    </main>
  );
}
