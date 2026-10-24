'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import glossary from '@/lib/glossary.json';

const byAlias = new Map();
for (const entry of glossary) {
  for (const alias of [entry.term, ...(entry.aliases || [])]) {
    const normalized = alias.trim().toLocaleLowerCase('ko-KR');
    if (!byAlias.has(normalized)) byAlias.set(normalized, entry);
  }
}

const aliases = [...byAlias.keys()].sort((a, b) => b.length - a.length);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliasPattern = aliases
  .map((alias) => {
    const escaped = escapeRegExp(alias);
    return /^[a-z0-9]/i.test(alias)
      ? `(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`
      : escaped;
  })
  .join('|');
const matcher = new RegExp(`(${aliasPattern})`, 'giu');

function GlossaryTerm({ entry, label, open, onToggle, uid }) {
  const tooltipId = `${uid}-${entry.id}`;
  return (
    <span className={`glossary-term${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="glossary-trigger"
        aria-expanded={open}
        aria-describedby={tooltipId}
        onClick={onToggle}
      >
        {label}
      </button>
      <span className="glossary-popover" id={tooltipId} role="tooltip">
        <span className="glossary-popover-kicker">용어 설명</span>
        <strong>{entry.term}</strong>
        <span>{entry.short}</span>
        {entry.concept ? <a href={`/concept/${entry.concept}/`}>개념에서 더 보기 <b aria-hidden="true">→</b></a> : null}
      </span>
    </span>
  );
}

export default function GlossaryText({ text, maxTerms = 5 }) {
  const [active, setActive] = useState(null);
  const rootRef = useRef(null);
  const uid = useId().replace(/:/g, '');

  const parts = useMemo(() => {
    if (!text || typeof text !== 'string') return [{ value: text ?? '', entry: null, key: 'plain-0' }];
    matcher.lastIndex = 0;
    const output = [];
    const seen = new Set();
    let cursor = 0;
    let annotated = 0;
    let match;

    while ((match = matcher.exec(text)) !== null) {
      if (match.index > cursor) output.push({ value: text.slice(cursor, match.index), entry: null, key: `plain-${cursor}` });
      const raw = match[0];
      const entry = byAlias.get(raw.toLocaleLowerCase('ko-KR'));
      const canAnnotate = entry && !seen.has(entry.id) && annotated < maxTerms;
      if (canAnnotate) {
        output.push({ value: raw, entry, key: `term-${entry.id}-${match.index}` });
        seen.add(entry.id);
        annotated += 1;
      } else {
        output.push({ value: raw, entry: null, key: `plain-${match.index}` });
      }
      cursor = match.index + raw.length;
      if (!raw.length) matcher.lastIndex += 1;
    }

    if (cursor < text.length) output.push({ value: text.slice(cursor), entry: null, key: `plain-${cursor}` });
    return output.length ? output : [{ value: text, entry: null, key: 'plain-all' }];
  }, [text, maxTerms]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (active !== null && rootRef.current && !rootRef.current.contains(event.target)) setActive(null);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActive(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active]);

  return (
    <span className="glossary-text" ref={rootRef}>
      {parts.map((part, index) => part.entry ? (
        <GlossaryTerm
          key={part.key}
          entry={part.entry}
          label={part.value}
          uid={`${uid}-${index}`}
          open={active === index}
          onToggle={() => setActive((current) => current === index ? null : index)}
        />
      ) : <span key={part.key}>{part.value}</span>)}
    </span>
  );
}
