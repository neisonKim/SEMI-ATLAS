import PageHero from '@/components/PageHero';
import { categories, concepts, levels } from '@/lib/data.mjs';

const phaseDescriptions = {
  basics: '반도체, 실리콘, 웨이퍼와 트랜지스터의 관계를 설명할 수 있어요.',
  devices: 'CPU·GPU와 DRAM·NAND가 맡는 역할을 구분할 수 있어요.',
  process: '막을 만들고 패턴을 가공하는 과정이 어떻게 반복되는지 이해해요.',
  packaging: '작은 칩들이 연결되어 HBM과 첨단 패키지가 되는 과정을 알아요.',
  industry: '팹리스와 파운드리의 역할, 산업의 연결 구조를 설명할 수 있어요.',
};

export const metadata = {
  title: '처음 배우는 반도체',
  description: '반도체 입문부터 공정, 패키징, 산업까지 5단계의 학습 경로를 따라가세요.',
  alternates: { canonical: '/learn/' },
  openGraph: {
    title: '처음 배우는 반도체',
    description: '반도체 입문부터 공정, 패키징, 산업까지 5단계의 학습 경로를 따라가세요.',
    url: '/learn/',
  },
};

export default function LearnPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="YOUR LEARNING PATH"
        title={<>처음이라면,<br />이 순서로 시작하세요.</>}
        description="30개의 짧은 개념을 5단계로 나눴습니다. 궁금한 과정부터 읽어도 좋습니다."
        image="silicon-wafer"
        action={<a className="button mint" href="/concept/semiconductor/">첫 개념 읽기</a>}
      />

      <div className="container learn-layout">
        <aside className="phase-nav">
          <span className="eyebrow">5단계 학습 경로</span>
          {categories.map((category, index) => (
            <a href={`#phase-${category.id}`} key={category.id}>
              <span>0{index + 1}</span>{category.name}
            </a>
          ))}
          <p>로그인 없이<br />모든 개념을 읽을 수 있어요.</p>
        </aside>

        <div className="phase-list">
          {categories.map((category, index) => {
            const phaseConcepts = concepts.filter((concept) => concept.category === category.id);
            return (
              <section className="phase-section" id={`phase-${category.id}`} key={category.id}>
                <div className="phase-title">
                  <span className="large-number">0{index + 1}</span>
                  <div>
                    <span className="eyebrow">{category.en}</span>
                    <h2>{category.name}</h2>
                    <p>{phaseDescriptions[category.id]}</p>
                  </div>
                </div>
                <div className="lesson-list">
                  {phaseConcepts.map((concept) => (
                    <a className="lesson-row" href={`/concept/${concept.id}/`} key={concept.id}>
                      <span className="lesson-number">{String(concept.num).padStart(2, '0')}</span>
                      <div>
                        <h3>{concept.title}</h3>
                        <span>{concept.en}</span>
                      </div>
                      <span className={`level level-${concept.level}`}>{levels[concept.level]}</span>
                      <span className="lesson-time">약 {concept.minutes}분</span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
