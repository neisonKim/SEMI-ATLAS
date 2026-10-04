import AssetImage from '@/components/AssetImage';
import ConceptCard from '@/components/ConceptCard';
import PageHero from '@/components/PageHero';
import SectionTitle from '@/components/SectionTitle';
import { byId, concepts } from '@/lib/data.mjs';

export const metadata = {
  title: '칩을 연결하는 패키징',
  description: '패키징부터 TSV, 인터포저, HBM, 2.5D와 3D 집적까지 연결해서 이해하세요.',
  alternates: { canonical: '/packaging/' },
  openGraph: {
    title: '칩을 연결하는 패키징',
    description: '패키징부터 TSV, 인터포저, HBM, 2.5D와 3D 집적까지 연결해서 이해하세요.',
    url: '/packaging/',
  },
};

export default function PackagingPage() {
  const packagingConcepts = concepts.filter((concept) => concept.category === 'packaging');
  return (
    <main id="main">
      <PageHero
        eyebrow="MORE THAN A CHIP"
        title={<>칩을 연결하면,<br />가능성이 넓어집니다.</>}
        description="보호와 연결, 성능과 열 관리. 패키징의 역할부터 HBM의 구조까지 단계별로 살펴보세요."
        image="packaging-overview"
        action={<a className="button mint" href="/concept/packaging/">패키징 기초부터 읽기</a>}
      />

      <section className="section container">
        <SectionTitle
          eyebrow="BUILD YOUR UNDERSTANDING"
          title="패키징을 이해하는 다섯 개념"
          description="기초 역할, 연결 기술, 실제 응용 순서로 배웁니다."
        />
        <div className="cards three">
          {packagingConcepts.map((concept) => <ConceptCard key={concept.id} concept={concept} />)}
        </div>
      </section>

      <section className="section surface">
        <div className="container">
          <div className="feature-story">
            <AssetImage name="computing" alt="프로세서와 메모리 부품이 배치된 컴퓨터 회로" />
            <div>
              <span className="eyebrow">MEMORY MEETS COMPUTING</span>
              <h2>빠른 계산에는<br />빠른 데이터 공급이 필요합니다.</h2>
              <p>HBM은 DRAM, 수직 연결, 고밀도 패키징을 함께 이해하면 더 쉽게 보입니다.</p>
              <div className="concept-chips">
                {['dram', 'tsv', 'interposer'].map((id) => <a href={`/concept/${id}/`} key={id}>{byId[id].title}</a>)}
              </div>
              <a className="button navy" href="/concept/hbm/">HBM의 원리 읽기</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
