import { companies, companyCountries, companyStages, companyStageById, companyCountryById } from './companies.mjs';

const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const validStages = new Set(companyStages.map(stage => stage.id));
const validCountries = new Set(companyCountries.map(country => country.id));
const validConcepts = new Set(companies.flatMap(company => company.concepts.map(concept => concept.id)));

export function readCompanyFilters(search = '') {
  const params = new URLSearchParams(search);
  return {
    query: (params.get('q') || '').slice(0, 200),
    stage: validStages.has(params.get('stage')) ? params.get('stage') : 'all',
    country: validCountries.has(params.get('country')) ? params.get('country') : 'all',
    concept: validConcepts.has(params.get('concept')) ? params.get('concept') : 'all',
  };
}

export function companyFilterUrl(filters) {
  const params = new URLSearchParams();
  if (filters.query?.trim()) params.set('q', filters.query.trim().slice(0, 200));
  if (validStages.has(filters.stage)) params.set('stage', filters.stage);
  if (validCountries.has(filters.country)) params.set('country', filters.country);
  if (validConcepts.has(filters.concept)) params.set('concept', filters.concept);
  return `/companies/${params.size ? `?${params}` : ''}`;
}

export function searchCompanies(items, { query = '', stage = 'all', country = 'all', concept = 'all' } = {}) {
  const tokens = query.trim().split(/\s+/).map(normalize).filter(Boolean);
  return items.filter(company => {
    if (stage !== 'all' && !company.stages.includes(stage)) return false;
    if (country !== 'all' && company.country !== country) return false;
    if (concept !== 'all' && !company.concepts.some(item => item.id === concept)) return false;
    const haystack = normalize([
      company.name, company.en, ...company.aliases, company.summary,
      companyCountryById[company.country].label,
      ...company.stages.map(id => `${companyStageById[id].label} ${companyStageById[id].en}`),
      ...company.technologies.map(item => item.name),
      ...company.concepts.map(item => `${item.id} ${item.reason}`),
    ].join(' '));
    return tokens.every(token => haystack.includes(token));
  });
}
