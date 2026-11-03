import { sources } from '@/lib/data.mjs';

const title = '뉴스 속 반도체 용어';
const description = 'HBM, EUV, GAA, 칩렛, 수율, 파운드리를 뉴스 문장 예시로 풀이하고 관련 개념과 공식 자료로 연결합니다.';

export const metadata = {
  title,
  description,
  alternates: { canonical: '/news-terms/' },
  openGraph: { title, description, url: '/news-terms/' },
};

const terms = [
  {
    id: 'hbm',
    title: 'HBM',
    context: '고대역폭 메모리',
    example: '새 AI 가속기가 더 높은 대역폭의 HBM을 탑재했다.',
    meaning: 'DRAM 칩을 여러 층으로 쌓고 넓은 인터페이스로 연결한 메모리를 사용해, 초당 더 많은 데이터를 주고받을 수 있다는 뜻입니다.',
    check: 'GB는 저장 용량이고 GB/s는 초당 전송량입니다. 비교하는 대역폭이 HBM 스택 하나의 수치인지, 가속기에 달린 전체 메모리의 합인지 확인하세요.',
    lessons: [['hbm', 'HBM의 구조'], ['tsv', '칩을 위아래로 잇는 TSV']],
    source: 'micron_hbm3e',
  },
  {
    id: 'euv',
    title: 'EUV',
    context: '극자외선 노광',
    example: '제조사가 미세 패턴을 만드는 일부 층에 EUV를 적용한다.',
    meaning: '극자외선으로 웨이퍼 위 감광막에 미세한 회로 패턴을 옮기는 노광 방식을 쓴다는 뜻입니다.',
    check: '어느 층에 적용하는지, 장비 도입 계획인지 양산 공정에 실제로 쓰고 있는지 확인하세요. 한 칩을 만들 때도 층에 따라 EUV와 DUV를 함께 쓸 수 있습니다.',
    lessons: [['euv-duv', 'EUV와 DUV 비교'], ['photomask', '패턴 원판인 포토마스크']],
    source: 'asml_reticle',
  },
  {
    id: 'gaa',
    title: 'GAA',
    context: '채널을 둘러싸는 게이트',
    example: '새 로직 공정에 나노시트 기반 GAA 트랜지스터가 적용된다.',
    meaning: '전류가 흐르는 채널의 단면 둘레 전체를 게이트가 감싸도록 만든 트랜지스터를 쓴다는 뜻입니다.',
    check: '성능이나 소비전력 개선율이 함께 나오면 비교 대상 공정과 측정 조건을 확인하세요. 같은 전력에서 비교한 속도와 같은 속도에서 비교한 전력은 서로 다른 지표입니다.',
    lessons: [['gaa', 'GAA의 나노시트 단면'], ['finfet', 'FinFET과 비교']],
    source: 'intel_gaa',
  },
  {
    id: 'chiplet',
    title: '칩렛',
    context: '기능을 나눈 다이',
    example: '프로세서가 연산 칩렛과 입출력 칩렛을 한 패키지에 담았다.',
    meaning: '계산과 입출력 같은 기능을 각각의 다이에 넣고 패키지 안에서 연결해 하나의 시스템처럼 동작시킨다는 뜻입니다.',
    check: '어떤 기능을 나눴고 다이끼리 어떻게 데이터를 주고받는지 살펴보세요. 공통 인터페이스를 지원해도 함께 조립하려면 전기 조건과 패키지 규격이 맞아야 합니다.',
    lessons: [['chiplet', '칩렛과 다이 간 연결'], ['integration', '2.5D·3D 패키징']],
    source: 'ucie_specs',
  },
  {
    id: 'yield',
    title: '수율',
    context: '검사 합격품의 비율',
    example: '새 공정의 수율이 개선됐다.',
    meaning: '정해진 검사 기준에서 검사 대상 중 합격한 비율이 높아졌다는 뜻입니다.',
    check: '어떤 제품을 어느 검사 단계에서 판정했는지 확인하세요. 웨이퍼에서 개별 다이를 검사한 수율과 조립한 제품의 최종 테스트 수율은 분모가 다를 수 있습니다.',
    lessons: [['yield', '수율의 분모와 계산'], ['metrology-inspection', '계측과 결함 검사']],
    source: 'samsung_yield',
  },
  {
    id: 'foundry',
    title: '파운드리',
    context: '반도체 위탁 제조',
    example: '칩 설계사가 차세대 제품을 생산할 파운드리를 선정했다.',
    meaning: '설계사가 만든 회로를 실제 웨이퍼에 구현해 줄 제조 파트너를 정했다는 뜻입니다.',
    check: '파트너 선정, 시험 생산, 양산 중 어떤 단계인지 확인하세요. 웨이퍼 제조를 맡는 기업과 패키징·최종 테스트를 맡는 기업은 다를 수 있습니다.',
    lessons: [['foundry', '파운드리의 역할'], ['fabless', '팹리스의 역할']],
    source: 'tsmc_foundry',
  },
];

export default function NewsTermsPage() {
  return (
    <main id="main">
      <header className="container page-heading">
        <span className="eyebrow">READ THE HEADLINES</span>
        <h1>{title}</h1>
        <p>기사에서 만나는 표현을 읽고, 뜻과 비교 조건을 짚어보세요.</p>
        <p className="news-terms-note">예시 문장은 학습을 위해 작성했습니다. 각 항목의 출처는 용어를 설명하는 기술 자료입니다.</p>
      </header>

      <nav className="container concept-chips news-terms-jump" aria-label="뉴스 용어 바로가기">
        {terms.map(term => <a key={term.id} href={`#term-${term.id}`}>{term.title}</a>)}
      </nav>

      <div className="container news-terms-grid">
        {terms.map(term => {
          const [sourceTitle, sourceUrl] = sources[term.source];
          return (
            <article className="news-term" key={term.id} aria-labelledby={`term-${term.id}`}>
              <header>
                <p className="eyebrow">{term.context}</p>
                <h2 id={`term-${term.id}`} tabIndex={-1}>{term.title}</h2>
              </header>
              <dl className="news-term-reading">
                <div className="news-term-example"><dt>기사 표현 예시</dt><dd>{term.example}</dd></div>
                <div><dt>한 문장 풀이</dt><dd>{term.meaning}</dd></div>
                <div><dt>읽을 때 확인할 점</dt><dd>{term.check}</dd></div>
              </dl>
              <footer className="news-term-links">
                <h3>관련 개념</h3>
                <div className="concept-chips">
                  {term.lessons.map(([id, label]) => <a key={id} href={`/concept/${id}/`}>{label}</a>)}
                </div>
                <a className="text-link" href={sourceUrl}>{sourceTitle} ↗</a>
              </footer>
            </article>
          );
        })}
        <a className="text-link news-terms-all" href="/encyclopedia/">백과사전에서 전체 개념 보기 →</a>
      </div>
    </main>
  );
}
