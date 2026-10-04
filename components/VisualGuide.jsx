import { byId } from '@/lib/data.mjs';

function GuideNode({ node, className = '' }) {
  const content = (
    <>
      <strong>{node.label}</strong>
      {node.sub ? <span>{node.sub}</span> : null}
    </>
  );

  if (node.concept && byId[node.concept]) {
    return <a className={`guide-node ${className}`} href={`/concept/${node.concept}/`}>{content}</a>;
  }

  return <div className={`guide-node guide-node-muted ${className}`}>{content}</div>;
}

function FlowGuide({ nodes }) {
  return (
    <div className="guide-flow" role="list" aria-label="기초 반도체 흐름">
      {nodes.map((node, index) => (
        <div className="guide-flow-item" role="listitem" key={node.label}>
          <GuideNode node={node} />
          {index < nodes.length - 1 ? <span className="guide-connector" aria-hidden="true">→</span> : null}
        </div>
      ))}
    </div>
  );
}

function ComputingGuide({ nodes }) {
  const compute = nodes.filter((node) => node.lane === 'compute');
  const memory = nodes.filter((node) => node.lane === 'memory');
  return (
    <div className="guide-computing">
      <div className="guide-lane">
        <div className="guide-lane-heading"><small>COMPUTE</small><strong>계산</strong></div>
        <div className="guide-lane-nodes">{compute.map((node) => <GuideNode key={node.label} node={node} />)}</div>
      </div>
      <div className="guide-bus" aria-hidden="true"><span>DATA</span><b>↕</b></div>
      <div className="guide-lane">
        <div className="guide-lane-heading"><small>MEMORY</small><strong>기억</strong></div>
        <div className="guide-lane-nodes">{memory.map((node) => <GuideNode key={node.label} node={node} />)}</div>
      </div>
    </div>
  );
}

function ProcessGuide({ nodes }) {
  return (
    <div className="guide-process" role="list" aria-label="반도체 제조공정 대표 흐름">
      {nodes.map((node, index) => (
        <div className="guide-process-item" role="listitem" key={`${node.label}-${index}`}>
          <GuideNode node={node} />
          {index < nodes.length - 1 ? <span className="guide-process-arrow" aria-hidden="true">→</span> : null}
        </div>
      ))}
      <div className="guide-repeat" aria-hidden="true"><span>↻</span><b>여러 층에서 반복</b></div>
    </div>
  );
}

function HbmGuide({ nodes }) {
  const [dram, tsv, hbm, interposer, gpu] = nodes;
  return (
    <div className="guide-hbm" aria-label="HBM과 GPU의 패키징 구조">
      <div className="hbm-memory-stack">
        <GuideNode node={dram} className="hbm-dram" />
        <GuideNode node={tsv} className="hbm-tsv" />
        <GuideNode node={hbm} className="hbm-main" />
      </div>
      <div className="hbm-interconnect"><span aria-hidden="true">⇄</span><small>WIDE I/O</small></div>
      <GuideNode node={gpu} className="hbm-gpu" />
      <GuideNode node={interposer} className="hbm-interposer" />
      <div className="hbm-substrate"><span>PACKAGE SUBSTRATE</span></div>
    </div>
  );
}

function IndustryGuide({ nodes }) {
  return (
    <div className="guide-industry" role="list" aria-label="반도체 산업 생태계 역할 흐름">
      {nodes.map((node, index) => (
        <div className={`guide-industry-item ${node.support ? 'is-support' : ''}`} role="listitem" key={node.label}>
          <GuideNode node={node} />
          {index < nodes.length - 1 ? <span className="guide-industry-arrow" aria-hidden="true">→</span> : null}
        </div>
      ))}
    </div>
  );
}

export default function VisualGuide({ guide }) {
  let diagram;
  if (guide.type === 'flow') diagram = <FlowGuide nodes={guide.nodes} />;
  else if (guide.type === 'computing') diagram = <ComputingGuide nodes={guide.nodes} />;
  else if (guide.type === 'process') diagram = <ProcessGuide nodes={guide.nodes} />;
  else if (guide.type === 'hbm') diagram = <HbmGuide nodes={guide.nodes} />;
  else diagram = <IndustryGuide nodes={guide.nodes} />;

  return (
    <section className="visual-guide-section" id={`guide-${guide.id}`}>
      <div className="visual-guide-copy">
        <div>
          <span className="eyebrow">{guide.number} / {guide.eyebrow}</span>
          <h2>{guide.title}</h2>
        </div>
        <p>{guide.description}</p>
      </div>
      <div className={`visual-guide-board visual-guide-${guide.type}`}>
        {diagram}
      </div>
      <div className="visual-guide-footer">
        <p>{guide.note}</p>
        <div className="concept-chips">
          {guide.related.map((id) => byId[id] ? <a href={`/concept/${id}/`} key={id}>{byId[id].en}</a> : null)}
        </div>
      </div>
    </section>
  );
}
