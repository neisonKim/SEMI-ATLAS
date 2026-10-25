'use client';

import { useEffect, useMemo, useState } from 'react';
import CompanyCard from './CompanyCard';
import { companies, companyCountries, companyStages } from '@/lib/companies.mjs';
import { companyFilterUrl, readCompanyFilters, searchCompanies } from '@/lib/company-search.mjs';

export default function CompanyDirectory({ conceptOptions }) {
  const [filters, setFilters] = useState(() => readCompanyFilters());
  const [ready, setReady] = useState(false);
  const matches = useMemo(() => searchCompanies(companies, filters), [filters]);

  useEffect(() => {
    const read = () => { setFilters(readCompanyFilters(window.location.search)); setReady(true); };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  useEffect(() => {
    if (ready) window.history.replaceState(null, '', `${companyFilterUrl(filters)}${window.location.hash}`);
  }, [filters, ready]);

  const update = (key, value) => setFilters(current => ({ ...current, [key]: value }));
  const reset = () => {
    setFilters(readCompanyFilters());
    document.getElementById('company-search')?.focus();
  };
  const activeConcept = conceptOptions.find(concept => concept.id === filters.concept);

  return (
    <section className="container company-directory" id="company-directory" aria-labelledby="directory-title">
      <div className="company-directory-heading">
        <div><span className="eyebrow">FIND YOUR CONNECTION</span><h2 id="directory-title">기업의 역할을 찾아보세요.</h2></div>
        <p>한 기업이 여러 역할에 나타날 수 있습니다.<br />국가·지역은 본사 기준으로 표시합니다.</p>
      </div>
      <div className="company-filter-panel">
        <div className="company-search-row">
          <label className="company-query-label" htmlFor="company-search">기업명·제품·기술 검색
            <input id="company-search" type="search" maxLength={200} value={filters.query} placeholder="삼성, NVIDIA, HBM, 웨이퍼…" onChange={event => update('query', event.target.value)} />
          </label>
          <label>본사 국가·지역
            <select value={filters.country} onChange={event => update('country', event.target.value)}>
              <option value="all">전체 국가·지역</option>
              {companyCountries.map(country => <option key={country.id} value={country.id}>{country.label}</option>)}
            </select>
          </label>
          <label>연결된 개념
            <select value={filters.concept} onChange={event => update('concept', event.target.value)}>
              <option value="all">전체 개념</option>
              {conceptOptions.map(concept => <option key={concept.id} value={concept.id}>{concept.title}</option>)}
            </select>
          </label>
        </div>
        <div className="filter-chips company-role-filters" role="group" aria-label="기업 역할 선택">
          <button type="button" className={`filter${filters.stage === 'all' ? ' active' : ''}`} aria-pressed={filters.stage === 'all'} onClick={() => update('stage', 'all')}>전체 역할</button>
          {companyStages.map(stage => <button type="button" className={`filter${filters.stage === stage.id ? ' active' : ''}`} key={stage.id} aria-pressed={filters.stage === stage.id} onClick={() => update('stage', stage.id)}>{stage.label}</button>)}
        </div>
      </div>
      <div className="results-heading company-results-heading">
        <p role="status" aria-live="polite" id="company-result-count">{matches.length}개 기업{activeConcept ? ` · ${activeConcept.title}` : ''}</p>
        <button type="button" className="text-button" onClick={reset}>검색·필터 초기화</button>
      </div>
      {matches.length ? <div className="company-grid">{matches.map(company => <CompanyCard company={company} showImage key={company.id} />)}</div> : (
        <div className="empty-state" id="company-empty-state"><h3>일치하는 기업을 찾지 못했어요.</h3><p>기업의 다른 이름이나 제품명으로 검색하거나 역할·개념 필터를 바꿔보세요.</p><button type="button" className="button navy" onClick={reset}>전체 기업 보기</button></div>
      )}
    </section>
  );
}
