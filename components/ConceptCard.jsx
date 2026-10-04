import { categories, levels } from '@/lib/data.mjs';
import AssetImage from './AssetImage';

export default function ConceptCard({ concept, compact = false }) {
  const category = categories.find((item) => item.id === concept.category);
  return (
    <a className={`concept-card${compact ? ' compact-card' : ''}`} href={`/concept/${concept.id}/`}>
      <AssetImage name={concept.image} alt={`${concept.en} 관련 반도체 이미지`} />
      <div className="card-body">
        <div className="card-meta">
          <span>{category.short}</span>
          <span>{levels[concept.level]}</span>
        </div>
        <h3>{concept.title}</h3>
        <p>{concept.summary}</p>
        <span className="read-label">{concept.en} <span>약 {concept.minutes}분</span></span>
      </div>
    </a>
  );
}
