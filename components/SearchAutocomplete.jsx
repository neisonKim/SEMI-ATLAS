'use client';

import { useMemo, useRef, useState } from 'react';
import { categories, concepts, levels } from '@/lib/data.mjs';
import { suggestConcepts } from '@/lib/search.mjs';
import { SearchIcon } from './Icons';

const categoryNames = Object.fromEntries(categories.map((item) => [item.id, item.name]));

export default function SearchAutocomplete({
  id,
  className = '',
  value,
  onValueChange,
  category = 'all',
  level = 'all',
  live = false,
  placeholder = '웨이퍼, HBM, 노광…',
  buttonLabel = '검색',
  action = '/encyclopedia/',
}) {
  const [internalValue, setInternalValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef(null);
  const query = value ?? internalValue;

  const suggestions = useMemo(
    () => suggestConcepts(concepts, { query, category, level, limit: 5 }),
    [query, category, level],
  );

  const updateQuery = (nextValue) => {
    if (onValueChange) onValueChange(nextValue);
    else setInternalValue(nextValue);
    setOpen(Boolean(nextValue.trim()));
    setActiveIndex(-1);
  };

  const goToSuggestion = (index) => {
    const target = suggestions[index]?.concept;
    if (!target) return;
    window.location.assign(`/concept/${target.id}/`);
  };

  const handleKeyDown = (event) => {
    if (!open || suggestions.length === 0) {
      if (event.key === 'ArrowDown' && query.trim()) {
        setOpen(true);
        setActiveIndex(0);
        event.preventDefault();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      goToSuggestion(activeIndex);
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleSubmit = (event) => {
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      goToSuggestion(activeIndex);
      return;
    }
    setOpen(false);
    if (live) event.preventDefault();
  };

  return (
    <div className={`autocomplete-search ${className}`.trim()}>
      <form className="search-form" action={action} method="get" role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={id}>반도체 용어 검색</label>
        <SearchIcon />
        <input
          id={id}
          name="q"
          type="search"
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={`${id}-suggestions`}
          aria-activedescendant={activeIndex >= 0 ? `${id}-suggestion-${activeIndex}` : undefined}
          onChange={(event) => updateQuery(event.target.value)}
          onFocus={() => {
            if (blurTimer.current) window.clearTimeout(blurTimer.current);
            if (query.trim()) setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => {
              setOpen(false);
              setActiveIndex(-1);
            }, 120);
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit">{buttonLabel}</button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="autocomplete-panel" id={`${id}-suggestions`} role="listbox" aria-label="추천 개념">
          <div className="autocomplete-kicker">추천 개념</div>
          {suggestions.map(({ concept, reason }, index) => (
            <a
              id={`${id}-suggestion-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={`autocomplete-item${activeIndex === index ? ' active' : ''}`}
              href={`/concept/${concept.id}/`}
              key={concept.id}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="autocomplete-index">{String(concept.num).padStart(2, '0')}</span>
              <span className="autocomplete-copy">
                <strong>{concept.title}</strong>
                <small>{concept.en}</small>
              </span>
              <span className="autocomplete-meta">
                <b>{reason === 'connected' ? '연결 개념' : categoryNames[concept.category]}</b>
                <small>{levels[concept.level]}</small>
              </span>
            </a>
          ))}
          <a className="autocomplete-all" href={`/encyclopedia/${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`}>
            전체 검색 결과 보기 <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}
