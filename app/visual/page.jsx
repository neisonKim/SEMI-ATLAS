import VisualGuide from '@/components/VisualGuide';
import { visualGuides } from '@/lib/visual-guides.mjs';

export const metadata = {
  title: '반도체 Visual Guide',
  description: '실리콘에서 칩, CPU·GPU와 메모리, 제조공정 단면, HBM 패키징, 산업 생태계를 5개의 고급 기술 시각 가이드로 연결해 이해하세요.',
  alternates: { canonical: '/visual/' },
  openGraph: {
    title: '반도체 Visual Guide | SEMI-ATLAS',
    description: '반도체의 기초, 계산과 기억, 제조공정, HBM, 산업 생태계를 기술 구조와 흐름으로 한눈에 연결합니다.',
    url: '/visual/',
  },
};

export default function VisualPage() {
  return (
    <main id="main">
      <section className="container page-heading visual-page-heading">
        <span className="eyebrow">SEE THE BIG PICTURE</span>
        <h1>글보다 먼저,<br />구조와 흐름을 보세요.</h1>
        <p>30개 개념을 읽기 전에 꼭 잡아야 할 다섯 개의 큰 그림입니다. 단순 박스형 흐름을 넘어 소자·단면·패키지·산업 네트워크를 기술 시각화로 재구성했습니다.</p>
      </section>

      <nav className="container visual-guide-index" aria-label="Visual Guide 바로가기">
        {visualGuides.map((guide) => (
          <a href={`#guide-${guide.id}`} key={guide.id}>
            <span>{guide.number}</span>
            <div><small>{guide.eyebrow}</small><strong>{guide.title}</strong></div>
          </a>
        ))}
      </nav>

      <div className="container visual-guide-list">
        {visualGuides.map((guide) => <VisualGuide guide={guide} key={guide.id} />)}
      </div>
    </main>
  );
}
