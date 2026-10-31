'use client';

import { useEffect, useRef, useState } from 'react';
import { explanationModeFromHash, explanationModes } from '@/lib/concept-review.mjs';

export default function ConceptExplanation({ levels }) {
  const [active, setActive] = useState('simple');
  const tabs = useRef({});

  useEffect(() => {
    const readHash = () => {
      const mode = explanationModeFromHash(window.location.hash);
      if (!mode) return;
      setActive(mode);
      requestAnimationFrame(() => {
        if (window.location.hash !== `#explain-${mode}`) return;
        const panel = document.getElementById(`explain-${mode}`);
        panel?.scrollIntoView({ block: 'start' });
        panel?.focus({ preventScroll: true });
      });
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  const select = (mode, focus = false) => {
    setActive(mode);
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#explain-${mode}`);
    if (focus) tabs.current[mode]?.focus();
  };

  const onKey = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % explanationModes.length;
    else if (event.key === 'ArrowLeft') next = (index + explanationModes.length - 1) % explanationModes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = explanationModes.length - 1;
    else return;
    event.preventDefault();
    select(explanationModes[next].id, true);
  };

  return <div className="concept-explanation">
    <div className="explanation-tabs" role="tablist" aria-label="설명 깊이 선택">
      {explanationModes.map((mode, index) => <button key={mode.id} type="button" role="tab"
        id={`explain-tab-${mode.id}`} aria-controls={`explain-${mode.id}`} aria-selected={active === mode.id}
        tabIndex={active === mode.id ? 0 : -1} ref={element => { tabs.current[mode.id] = element; }}
        onClick={() => select(mode.id)} onKeyDown={event => onKey(event, index)}>
        <span>{mode.label}</span><small>{mode.hint}</small>
      </button>)}
    </div>
    {explanationModes.map(mode => <div className="explanation-panel" id={`explain-${mode.id}`} key={mode.id}
      role="tabpanel" aria-labelledby={`explain-tab-${mode.id}`} hidden={active !== mode.id} tabIndex={0}>
      <h3>{levels[mode.id].title}</h3>
      {levels[mode.id].paragraphs.map(text => <p key={text}>{text}</p>)}
      <a href="#concept-diagram">구조도와 함께 보기 ↓</a>
    </div>)}
  </div>;
}
