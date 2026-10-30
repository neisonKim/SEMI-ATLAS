'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { suggestConcepts } from '@/lib/search.mjs';
import { SearchIcon } from './Icons';
import SearchSuggestionList from './SearchSuggestionList';
import { suggestUnified, unifiedSearchUrl } from '@/lib/unified-search.mjs';

export default function SearchAutocomplete({
  id,
  className = '',
  value,
  onValueChange,
  category = 'all',
  level = 'all',
  conceptItems = [],
  categories = [],
  levels = {},
  items,
  kind = 'all',
  live = false,
  placeholder,
  buttonLabel = '검색',
  action = '/encyclopedia/',
  autoFocus = false,
}) {
  const [internalValue, setInternalValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const composing = useRef(false);
  const categoryNames = Object.fromEntries(categories.map(item => [item.id, item.name]));
  const query = value ?? internalValue;
  const unified = Boolean(items);
  const panelOpen = open && Boolean(query.trim());
  const resultsUrl = unified ? unifiedSearchUrl({ query, kind }) : `/encyclopedia/${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`;

  const suggestions = useMemo(
    () => unified ? suggestUnified(items, { query, kind, limit: 6 }) : suggestConcepts(conceptItems, { query, category, level, limit: 5 }),
    [items, unified, conceptItems, query, kind, category, level],
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [kind, category, level]);

  const updateQuery = (nextValue) => {
    if (onValueChange) onValueChange(nextValue);
    else setInternalValue(nextValue);
    setOpen(Boolean(nextValue.trim()));
    setActiveIndex(-1);
  };

  const goToSuggestion = (index) => {
    const target = suggestions[index];
    if (!target) return;
    window.location.assign(unified ? target.href : `/concept/${target.concept.id}/`);
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing || composing.current || event.keyCode === 229) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!panelOpen || suggestions.length === 0) {
      if (event.key === 'ArrowDown' && query.trim() && suggestions.length) {
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
    }
  };

  const handleSubmit = (event) => {
    if (composing.current) { event.preventDefault(); return; }
    if (panelOpen && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      goToSuggestion(activeIndex);
      return;
    }
    if (live) {
      event.preventDefault();
      setOpen(Boolean(query.trim()));
      setActiveIndex(-1);
      return;
    }
    setOpen(false);
  };

  return (
    <div className={`autocomplete-search ${className}`.trim()} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }}>
      <form className="search-form" action={unified ? '/search/' : action} method="get" role="search" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={id}>{unified ? '반도체 개념·기업 검색' : '반도체 용어 검색'}</label>
        {unified && kind !== 'all' && <input type="hidden" name="kind" value={kind} />}
        <SearchIcon />
        <input
          id={id}
          name="q"
          type="search"
          placeholder={placeholder || (unified ? 'HBM, 삼성전자, 스냅드래곤…' : '웨이퍼, HBM, 노광…')}
          maxLength={200}
          autoComplete="off"
          autoFocus={autoFocus}
          value={query}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={panelOpen && (unified || suggestions.length > 0)}
          aria-controls={`${id}-suggestions`}
          aria-activedescendant={panelOpen && suggestions[activeIndex] ? (unified ? `${id}-suggestions-${activeIndex}` : `${id}-suggestion-${activeIndex}`) : undefined}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
          onChange={(event) => updateQuery(event.target.value)}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit">{buttonLabel}</button>
      </form>

      {unified && panelOpen && <SearchSuggestionList id={`${id}-suggestions`} items={suggestions}
        activeIndex={activeIndex} onActiveChange={setActiveIndex} href={resultsUrl} />}
      {!unified && panelOpen && suggestions.length > 0 && (
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
