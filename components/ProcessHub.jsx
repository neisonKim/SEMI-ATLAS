import { byId } from '@/lib/data.mjs';
import { processHub } from '@/lib/process-hub.mjs';

function ConceptLink({ id, compact = false }) {
  const concept = byId[id];
  if (!concept) return null;
  return (
    <a className={compact ? 'process-chip' : 'process-hub-node'} href={`/concept/${concept.id}/`}>
      {!compact && <span className="process-hub-number">{String(concept.num).padStart(2, '0')}</span>}
      <strong>{compact ? concept.en : concept.title}</strong>
      {!compact && <small>{concept.en}</small>}
    </a>
  );
}

export default function ProcessHub() {
  return (
    <div className="process-hub" aria-label="반도체 제조공정 학습 지도">
      <div className="process-hub-summary">
        <div>
          <span className="eyebrow">MVP PROCESS MAP · 12—22</span>
          <h3>{processHub.title}</h3>
          <p>{processHub.description}</p>
        </div>
        <a className="text-link" href="/concept/fabrication/">전체 공정 설명 읽기</a>
      </div>

      <div className="process-hub-track" role="list">
        {processHub.concepts.map((item, index) => {
          const concept = byId[item.id];
          return (
            <div className={`process-hub-step tone-${item.tone}`} role="listitem" key={item.id}>
              <a href={`/concept/${item.id}/`} aria-label={`${item.num} ${concept?.title ?? item.label}`}>
                <span className="process-hub-number">{String(item.num).padStart(2, '0')}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.en}</small>
                </div>
                <p>{item.role}</p>
              </a>
              {index < processHub.concepts.length - 1 && <span className="process-hub-arrow" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>

      <p className="process-hub-note"><strong>중요:</strong> {processHub.note}</p>

      <div className="process-family-grid">
        {processHub.families.map((family) => (
          <section className="process-family-card" key={family.id}>
            <span>{family.number}</span>
            <div>
              <h3>{family.title}</h3>
              <p>{family.description}</p>
              <div className="process-family-links">
                {family.concepts.map((id) => <ConceptLink id={id} compact key={id} />)}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
