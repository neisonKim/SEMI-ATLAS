'use client';

import { useEffect, useMemo, useState } from 'react';
import { categories, concepts } from '@/lib/data.mjs';
import ConceptCard from './ConceptCard';
import { SearchIcon } from './Icons';
import SearchAutocomplete from './SearchAutocomplete';
import { searchConcepts } from '@/lib/search.mjs';

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [ready, setReady] = useState(false);

  const validCategories = useMemo(() => new Set(['all', ...categories.map((item) => item.id)]), []);

  const matches = useMemo(() => searchConcepts(concepts, { query, category, level }), [query, category, level]);

  useEffect(() => {
    const readUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const nextCategory = params.get('category') || 'all';
      const nextLevel = params.get('level') || 'all';
      setQuery(params.get('q') || '');
      setCategory(validCategories.has(nextCategory) ? nextCategory : 'all');
      setLevel(['1', '2', '3'].includes(nextLevel) ? nextLevel : 'all');
      setReady(true);
    };
    readUrl();
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  }, [validCategories]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'all') params.set('category', category);
    if (level !== 'all') params.set('level', level);
    const suffix = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${suffix ? `?${suffix}` : ''}${window.location.hash}`);
  }, [query, category, level, ready]);

  useEffect(() => {
    if (!ready || !document.modelContext?.registerTool) return undefined;
    const lifecycle = new AbortController();
    const validLevels = new Set(['all', '1', '2', '3']);
    const tool = {
      name: 'show_concept_search',
      title: '반도체 개념 검색',
      description: '검색어와 선택한 분야로 이 페이지의 검색 결과를 표시합니다. 데이터는 변경하지 않습니다.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', maxLength: 200 },
          category: { type: 'string', enum: [...validCategories] },
          level: { type: 'string', enum: [...validLevels] },
        },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(args) {
        if (!args || typeof args.query !== 'string' || args.query.length > 200
          || Object.keys(args).some((key) => !['query', 'category', 'level'].includes(key))
          || (args.category !== undefined && !validCategories.has(args.category))
          || (args.level !== undefined && !validLevels.has(args.level))) {
          throw new Error('유효한 검색어, 분야와 난이도를 입력하세요.');
        }
        const nextCategory = args.category || 'all';
        const nextLevel = args.level || 'all';
        setQuery(args.query);
        setCategory(nextCategory);
        setLevel(nextLevel);
        const found = searchConcepts(concepts, { query: args.query, category: nextCategory, level: nextLevel });
        return { count: found.length, concepts: found.map((concept) => ({ title: concept.title, url: `/concept/${concept.id}/` })) };
      },
    };
    try {
      Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, [ready, validCategories]);

  const reset = () => {
    setQuery('');
    setCategory('all');
    setLevel('all');
    requestAnimationFrame(() => document.getElementById('search')?.focus());
  };

  return (
    <>
      <section className="search-heading container">
        <span className="eyebrow">THE ENCYCLOPEDIA</span>
        <h1>궁금한 반도체,<br />여기서 찾아보세요.</h1>
        <p>용어의 뜻부터 작동 원리, 다음에 읽을 개념까지.</p>
        <SearchAutocomplete
          id="search"
          className="search-large"
          value={query}
          onValueChange={setQuery}
          category={category}
          level={level}
          live
        />
      </section>

      <section className="container search-content">
        <div className="search-filters">
          <div className="filter-chips" role="group" aria-label="분야 선택">
            <button className={`filter${category === 'all' ? ' active' : ''}`} data-category="all" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>전체</button>
            {categories.map((item) => (
              <button
                key={item.id}
                className={`filter${category === item.id ? ' active' : ''}`}
                data-category={item.id}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <label className="level-select">
            난이도
            <select id="level-filter" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">전체 난이도</option>
              <option value="1">입문</option>
              <option value="2">기초 원리</option>
              <option value="3">기술 이해</option>
            </select>
          </label>
        </div>

        <div className="results-heading">
          <p id="result-count" role="status" aria-live="polite">
            {query.trim() ? `“${query.trim()}” 검색 결과 · ${matches.length}개 개념` : `${matches.length}개 개념`}
          </p>
          <button type="button" className="text-button" id="reset-search" onClick={reset}>검색·필터 초기화</button>
        </div>

        {matches.length > 0 ? (
          <div id="search-results" className="search-grid">
            {matches.map((concept) => (
              <article className="search-item" data-id={concept.id} data-category={concept.category} data-level={concept.level} key={concept.id}>
                <ConceptCard concept={concept} />
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" id="empty-results">
            <SearchIcon />
            <h2>일치하는 개념을 찾지 못했어요.</h2>
            <p>짧은 용어나 다른 이름으로 검색해보세요.<br />분야·난이도 필터를 해제하면 더 많은 결과를 볼 수 있습니다.</p>
            <button className="button navy" id="empty-reset" type="button" onClick={reset}>전체 개념 보기</button>
            <div className="concept-chips">
              <a href="/learn/">처음 배우기</a>
              <a href="/concept/wafer/">웨이퍼 알아보기</a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
