'use client';

import { useEffect, useMemo, useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';
import { SearchIcon } from './Icons';
import { readSearchFilters, searchUnified, unifiedSearchUrl } from '@/lib/unified-search.mjs';

const kinds = [['all', '전체'], ['concept', '개념'], ['company', '기업']];

export default function UnifiedSearchClient({ items }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [ready, setReady] = useState(false);
  const allMatches = useMemo(() => searchUnified(items, { query }), [items, query]);
  const matches = useMemo(() => allMatches.filter(item => kind === 'all' || item.kind === kind), [allMatches, kind]);
  const countFor = key => key === 'all' ? allMatches.length : allMatches.filter(item => item.kind === key).length;

  useEffect(() => {
    const readUrl = () => {
      const filters = readSearchFilters(window.location.search);
      setQuery(filters.query);
      setKind(filters.kind);
      setReady(true);
    };
    readUrl();
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.history.replaceState(null, '', `${unifiedSearchUrl({ query, kind })}${window.location.hash}`);
  }, [query, kind, ready]);

  const reset = () => {
    setQuery('');
    setKind('all');
    requestAnimationFrame(() => document.getElementById('unified-search')?.focus());
  };

  return (
    <>
      <section className="search-heading container unified-search-heading">
        <span className="eyebrow">KNOWLEDGE, CONNECTED.</span>
        <h1>개념에서 기업까지,<br />한 번에 찾아보세요.</h1>
        <p>반도체 개념 {items.filter(item => item.kind === 'concept').length}개와 기업 {items.filter(item => item.kind === 'company').length}개를 함께 검색합니다.<br />한글·영문·별칭·제품·기술명으로 찾아보세요.</p>
        <SearchAutocomplete id="unified-search" className="search-large" items={items}
          value={query} onValueChange={setQuery} kind={kind} live />
        <div className="unified-directory-links">
          <a href={`/encyclopedia/${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`}>개념별 분야·난이도 보기 ↗</a>
          <a href={`/companies/${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`}>기업별 역할·국가 보기 ↗</a>
        </div>
      </section>
      <section className="container search-content" aria-label="통합 검색 결과">
        <div className="filter-chips unified-search-filters" role="group" aria-label="검색 결과 종류">
          {kinds.map(([key, label]) => (
            <button key={key} type="button" className={`filter${kind === key ? ' active' : ''}`}
              aria-pressed={kind === key} data-search-kind={key} onClick={() => setKind(key)}>
              {label} <span>{countFor(key)}</span>
            </button>
          ))}
        </div>
        <div className="results-heading">
          <p id="unified-result-count" role="status" aria-live="polite">
            {query.trim() ? `“${query.trim()}” · ` : ''}{matches.length}개 결과
          </p>
          <button type="button" className="text-button" onClick={reset}>검색·필터 초기화</button>
        </div>
        {matches.length ? (
          <div id="unified-search-results" className="unified-result-grid">
            {matches.map(item => (
              <a className="unified-result-card" key={item.key} href={item.href} data-search-key={item.key}>
                <div className="unified-result-meta">
                  <span className={`search-kind search-kind-${item.kind}`}>{item.kind === 'concept' ? '개념' : '기업'}</span>
                  <span>{item.kind === 'concept' ? String(item.number).padStart(2, '0') : 'COMPANY'}</span>
                </div>
                <h2>{item.title}</h2><p className="unified-result-en">{item.en}</p>
                <p className="unified-result-summary">{item.summary}</p>
                <div className="unified-result-footer"><span>{item.meta}</span><span aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty-state" id="unified-empty-results">
            <SearchIcon /><h2>일치하는 {kind === 'concept' ? '개념' : kind === 'company' ? '기업' : '개념이나 기업'}을 찾지 못했어요.</h2>
            <p>짧은 단어나 한글·영문 이름으로 다시 검색해보세요.</p>
            {kind !== 'all' && allMatches.length > 0 && <button className="button navy" type="button" onClick={() => setKind('all')}>다른 종류의 결과 {allMatches.length}개 보기</button>}
            <button className="text-button" type="button" onClick={reset}>검색·필터 초기화</button>
          </div>
        )}
      </section>
    </>
  );
}
