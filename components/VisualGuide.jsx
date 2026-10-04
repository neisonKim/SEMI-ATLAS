import { byId } from '@/lib/data.mjs';

function ConceptLink({ id, className = '', children, ariaLabel }) {
  if (!id || !byId[id]) return <div className={className}>{children}</div>;
  return <a className={className} href={`/concept/${id}/`} aria-label={ariaLabel}>{children}</a>;
}

function FoundationsTech({ nodes }) {
  const [silicon, wafer, transistor, chip] = nodes;
  return (
    <div className="tech-foundations" aria-label="실리콘에서 칩까지의 구조적 변화">
      <ConceptLink id={silicon.concept} className="tech-stage stage-silicon" ariaLabel="실리콘 개념 보기">
        <div className="silicon-crystal" aria-hidden="true"><span /><span /><span /></div>
        <div className="tech-stage-copy"><small>01 / MATERIAL</small><strong>{silicon.label}</strong><span>{silicon.sub}</span></div>
      </ConceptLink>
      <span className="tech-arrow" aria-hidden="true">→</span>
      <ConceptLink id={wafer.concept} className="tech-stage stage-wafer" ariaLabel="웨이퍼 개념 보기">
        <div className="wafer-disc" aria-hidden="true"><i /><b /></div>
        <div className="tech-stage-copy"><small>02 / PLATFORM</small><strong>{wafer.label}</strong><span>{wafer.sub}</span></div>
      </ConceptLink>
      <span className="tech-arrow" aria-hidden="true">→</span>
      <ConceptLink id={transistor.concept} className="tech-stage stage-transistor" ariaLabel="트랜지스터 개념 보기">
        <div className="transistor-structure" aria-hidden="true">
          <span className="tr-substrate" /><span className="tr-source" /><span className="tr-drain" /><span className="tr-oxide" /><span className="tr-gate" />
        </div>
        <div className="tech-stage-copy"><small>03 / DEVICE</small><strong>{transistor.label}</strong><span>{transistor.sub}</span></div>
      </ConceptLink>
      <span className="tech-arrow" aria-hidden="true">→</span>
      <ConceptLink id={chip.concept} className="tech-stage stage-chip" ariaLabel="반도체 칩 개념 보기">
        <div className="chip-die" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
        <div className="tech-stage-copy"><small>04 / SYSTEM</small><strong>{chip.label}</strong><span>{chip.sub}</span></div>
      </ConceptLink>
    </div>
  );
}

function ComputingTech({ nodes }) {
  const cpu = nodes.find((node) => node.concept === 'cpu');
  const gpu = nodes.find((node) => node.concept === 'gpu');
  const dram = nodes.find((node) => node.concept === 'dram');
  const nand = nodes.find((node) => node.concept === 'nand');
  return (
    <div className="tech-computing" aria-label="CPU GPU DRAM NAND 데이터 흐름">
      <div className="compute-rail compute-rail-a" aria-hidden="true" />
      <div className="compute-rail compute-rail-b" aria-hidden="true" />
      <ConceptLink id={cpu.concept} className="silicon-block cpu-block" ariaLabel="CPU 개념 보기">
        <small>GENERAL PURPOSE</small><strong>CPU</strong><span>제어 · 직렬/범용 처리</span><i className="block-grid" aria-hidden="true" />
      </ConceptLink>
      <ConceptLink id={gpu.concept} className="silicon-block gpu-block" ariaLabel="GPU 개념 보기">
        <small>PARALLEL COMPUTE</small><strong>GPU</strong><span>대규모 병렬 연산</span><i className="block-grid dense" aria-hidden="true" />
      </ConceptLink>
      <div className="memory-fabric" aria-hidden="true"><span>MEMORY FABRIC</span><b>↕ DATA ↕</b></div>
      <ConceptLink id={dram.concept} className="memory-module dram-module" ariaLabel="DRAM 개념 보기">
        <div className="dram-stack-mini" aria-hidden="true"><i /><i /><i /><i /></div>
        <div><small>VOLATILE</small><strong>DRAM</strong><span>작업 데이터 · 빠른 접근</span></div>
      </ConceptLink>
      <ConceptLink id={nand.concept} className="memory-module nand-module" ariaLabel="NAND 개념 보기">
        <div className="nand-array-mini" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</div>
        <div><small>NON-VOLATILE</small><strong>NAND</strong><span>장기 저장 · 비휘발성</span></div>
      </ConceptLink>
      <div className="compute-legend" aria-hidden="true"><span><i className="legend-dot compute" />Compute</span><span><i className="legend-dot memory" />Memory</span><span>개념도 · 실제 시스템 구조는 제품별로 다름</span></div>
    </div>
  );
}

function ProcessTech({ nodes }) {
  const concept = (id) => nodes.find((node) => node.concept === id);
  const ordered = nodes;
  return (
    <div className="tech-process-map">
      <div className="process-technical-scene" aria-label="반도체 공정 단면 개념도">
        <div className="process-tooling" aria-hidden="true">
          <div className="mask-plate"><span /><span /><span /><span /><span /></div>
          <div className="exposure-beam" />
        </div>
        <div className="wafer-cross-section" aria-hidden="true">
          <div className="layer photoresist"><span>PHOTORESIST</span></div>
          <div className="layer oxide"><span>OXIDE / DIELECTRIC</span></div>
          <div className="layer film"><span>DEPOSITED FILM</span></div>
          <div className="layer silicon"><span>SILICON WAFER</span></div>
          <i className="implant implant-a" /><i className="implant implant-b" /><i className="implant implant-c" />
        </div>
        <div className="process-callouts">
          <ConceptLink id={concept('lithography')?.concept} className="process-callout callout-lithography">LIGHT / MASK</ConceptLink>
          <ConceptLink id={concept('etching')?.concept} className="process-callout callout-etch">REMOVE</ConceptLink>
          <ConceptLink id={concept('deposition')?.concept} className="process-callout callout-deposition">ADD FILM</ConceptLink>
          <ConceptLink id={concept('ion-implantation')?.concept} className="process-callout callout-implant">DOPE</ConceptLink>
        </div>
      </div>
      <div className="process-tech-flow" role="list" aria-label="대표 반도체 공정 학습 순서">
        {ordered.map((node, index) => (
          <ConceptLink id={node.concept} key={`${node.label}-${index}`} className="process-tech-step" ariaLabel={`${node.label} 개념 보기`}>
            <small>{String(index + 1).padStart(2, '0')}</small><strong>{node.label}</strong><span>{index < ordered.length - 1 ? '→' : 'END'}</span>
          </ConceptLink>
        ))}
      </div>
      <div className="process-cycle-note"><b>↻ MULTI-LAYER CYCLE</b><span>실제 전공정에서는 막 형성·패터닝·식각·세정·계측이 목적에 따라 반복됩니다.</span></div>
    </div>
  );
}

function HbmTech({ nodes }) {
  const [dram, tsv, hbm, interposer, gpu] = nodes;
  return (
    <div className="tech-hbm" aria-label="HBM과 GPU의 2.5D 패키징 개념도">
      <div className="hbm-3d-stack" aria-hidden="true">
        <div className="stack-die die-4"><span>DRAM</span></div>
        <div className="stack-die die-3"><span>DRAM</span></div>
        <div className="stack-die die-2"><span>DRAM</span></div>
        <div className="stack-die die-1"><span>DRAM</span></div>
        <div className="tsv-column tsv-a" /><div className="tsv-column tsv-b" /><div className="tsv-column tsv-c" /><div className="tsv-column tsv-d" />
        <div className="base-die"><span>BASE / INTERFACE</span></div>
      </div>
      <div className="hbm-package-plane" aria-hidden="true">
        <div className="package-gpu"><span>GPU</span><i className="gpu-grid" /></div>
        <div className="package-hbm"><span>HBM</span><i /><i /><i /></div>
        <div className="interposer-lines"><i /><i /><i /><i /><i /><i /></div>
        <div className="package-interposer"><span>SILICON INTERPOSER</span></div>
        <div className="package-substrate"><span>PACKAGE SUBSTRATE</span></div>
      </div>
      <div className="hbm-tech-links">
        <ConceptLink id={dram.concept} className="hbm-tech-link"><small>01</small><strong>DRAM STACK</strong><span>{dram.sub}</span></ConceptLink>
        <ConceptLink id={tsv.concept} className="hbm-tech-link"><small>02</small><strong>TSV</strong><span>{tsv.sub}</span></ConceptLink>
        <ConceptLink id={hbm.concept} className="hbm-tech-link emphasis"><small>03</small><strong>HBM</strong><span>{hbm.sub}</span></ConceptLink>
        <ConceptLink id={interposer.concept} className="hbm-tech-link"><small>04</small><strong>INTERPOSER</strong><span>{interposer.sub}</span></ConceptLink>
        <ConceptLink id={gpu.concept} className="hbm-tech-link"><small>05</small><strong>GPU</strong><span>{gpu.sub}</span></ConceptLink>
      </div>
      <p className="tech-disclaimer">Conceptual package diagram · not to scale · 세대와 제품에 따라 베이스 다이·범프·배선 구조는 달라질 수 있습니다.</p>
    </div>
  );
}

function IndustryTech({ nodes }) {
  const [eda, fabless, foundry, support, osat, system] = nodes;
  return (
    <div className="tech-industry-map" aria-label="반도체 산업 생태계 네트워크">
      <div className="ecosystem-line main-line" aria-hidden="true" />
      <div className="ecosystem-line support-line" aria-hidden="true" />
      <ConceptLink id={eda.concept} className="ecosystem-node node-eda"><small>DESIGN FOUNDATION</small><strong>{eda.label}</strong><span>{eda.sub}</span></ConceptLink>
      <ConceptLink id={fabless.concept} className="ecosystem-node node-fabless"><small>CHIP DESIGN</small><strong>{fabless.label}</strong><span>{fabless.sub}</span></ConceptLink>
      <ConceptLink id={foundry.concept} className="ecosystem-node node-foundry"><small>WAFER FAB</small><strong>{foundry.label}</strong><span>{foundry.sub}</span></ConceptLink>
      <ConceptLink id={osat.concept} className="ecosystem-node node-osat"><small>BACK-END</small><strong>{osat.label}</strong><span>{osat.sub}</span></ConceptLink>
      <ConceptLink id={system.concept} className="ecosystem-node node-system"><small>APPLICATION</small><strong>{system.label}</strong><span>{system.sub}</span></ConceptLink>
      <ConceptLink id={support.concept} className="ecosystem-node node-support"><small>SUPPORT LAYER</small><strong>{support.label}</strong><span>{support.sub}</span></ConceptLink>
      <div className="industry-data-strip" aria-hidden="true"><span>DESIGN DATA</span><b>→</b><span>MASK / WAFER</span><b>→</b><span>DIE / PACKAGE</span><b>→</b><span>SYSTEM VALUE</span></div>
    </div>
  );
}

export default function VisualGuide({ guide }) {
  let diagram;
  if (guide.type === 'flow') diagram = <FoundationsTech nodes={guide.nodes} />;
  else if (guide.type === 'computing') diagram = <ComputingTech nodes={guide.nodes} />;
  else if (guide.type === 'process') diagram = <ProcessTech nodes={guide.nodes} />;
  else if (guide.type === 'hbm') diagram = <HbmTech nodes={guide.nodes} />;
  else diagram = <IndustryTech nodes={guide.nodes} />;

  return (
    <section className="visual-guide-section visual-guide-premium" id={`guide-${guide.id}`}>
      <div className="visual-guide-copy">
        <div>
          <span className="eyebrow">{guide.number} / {guide.eyebrow}</span>
          <h2>{guide.title}</h2>
        </div>
        <p>{guide.description}</p>
      </div>
      <div className={`visual-guide-board premium-board premium-${guide.type}`}>
        <div className="technical-grid" aria-hidden="true" />
        <div className="board-corner-label" aria-hidden="true"><span>SEMI-ATLAS</span><b>TECHNICAL VISUAL GUIDE</b></div>
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
