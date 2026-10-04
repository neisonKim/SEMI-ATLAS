import { byId } from '@/lib/data.mjs';
import { industryHub } from '@/lib/industry-hub.mjs';

function StageContent({ stage }) {
  return (
    <>
      <div className="industry-hub-stage-top">
        <span className="industry-hub-number">{stage.number}</span>
        <small>{stage.en}</small>
      </div>
      <strong>{stage.label}</strong>
      <b>{stage.question}</b>
      <p>{stage.role}</p>
      {stage.status && <em>{stage.support ? '여러 단계 지원 · ' : ''}{stage.status}</em>}
    </>
  );
}

export default function IndustryHub() {
  return (
    <div className="industry-hub" aria-label="반도체 산업 생태계 학습 지도">
      <div className="industry-hub-summary">
        <div>
          <span className="eyebrow">SEMICONDUCTOR ECOSYSTEM · ROLE MAP</span>
          <h3>{industryHub.title}</h3>
          <p>{industryHub.description}</p>
        </div>
        <a className="text-link" href="/concept/ecosystem/">28. 산업 생태계부터 읽기</a>
      </div>

      <div className="industry-hub-track" role="list">
        {industryHub.stages.map((stage, index) => {
          const concept = stage.concept ? byId[stage.concept] : null;
          const className = `industry-hub-stage tone-${stage.tone}${stage.support ? ' is-support' : ''}`;
          return (
            <div className="industry-hub-step" role="listitem" key={stage.id}>
              {concept ? (
                <a className={className} href={`/concept/${concept.id}/`} aria-label={`${stage.label}: ${stage.question}`}>
                  <StageContent stage={stage} />
                  <span className="industry-hub-link">개념 읽기 →</span>
                </a>
              ) : (
                <article className={className}>
                  <StageContent stage={stage} />
                  <span className="industry-hub-link muted">확장 예정</span>
                </article>
              )}
              {index < industryHub.stages.length - 1 && <span className="industry-hub-arrow" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>

      <div className="industry-support-rail">
        <span>SUPPORT LAYER</span>
        <strong>Equipment / Materials</strong>
        <p>장비·소재는 단순히 Foundry 다음에 오는 단계가 아니라, 웨이퍼 제조와 패키징의 여러 공정을 가로질러 지원합니다.</p>
      </div>

      <p className="industry-hub-note"><strong>중요:</strong> {industryHub.note}</p>

      <div className="industry-learning-path" aria-label="MVP 산업 학습 경로">
        {industryHub.learningPath.map((item, index) => {
          const concept = byId[item.id];
          return (
            <div className="industry-learning-step" key={item.id}>
              <a href={`/concept/${item.id}/`}>
                <span>{String(item.number).padStart(2, '0')}</span>
                <small>MVP 1.0</small>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </a>
              {index < industryHub.learningPath.length - 1 && <b aria-hidden="true">→</b>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
