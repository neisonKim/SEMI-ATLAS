import { sources } from '@/lib/data.mjs';
import { explanationCheckedAt, explanationSources } from '@/lib/concept-explanations.mjs';

const diagramSources = { ...sources, ...explanationSources };

export default function ConceptDiagram({ diagram }) {
  return <figure id="concept-diagram" className="concept-diagram" aria-labelledby="concept-diagram-title" tabIndex={-1}>
    <div className="concept-diagram-heading"><span>{diagram.kind}</span><h3 id="concept-diagram-title">{diagram.title}</h3></div>
    <img className="concept-diagram-image" src={diagram.src} width={diagram.width} height={diagram.height}
      loading="lazy" decoding="async" alt={diagram.alt} />
    <figcaption>
      <span>{diagram.scope}</span>
      <a href={diagram.src} target="_blank" rel="noopener noreferrer">구조도 크게 보기 ↗<span className="sr-only"> 새 창</span></a>
    </figcaption>
    <details className="concept-diagram-sources" id="diagram-sources">
      <summary>설명·구조도의 원리 참고자료</summary>
      <ul>{diagram.refs.map(key => <li key={key}><a href={diagramSources[key][1]} target="_blank" rel="noopener noreferrer">{diagramSources[key][0]}<span className="sr-only"> 새 창</span> ↗</a></li>)}</ul>
      <span className="diagram-source-date">설명·도식 작성 {explanationCheckedAt} · 학습용으로 직접 작성한 개념도</span>
    </details>
  </figure>;
}
