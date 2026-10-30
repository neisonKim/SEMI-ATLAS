export const searchQueryLimit = 200;
export const searchKinds = ['all', 'concept', 'company'];
const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

// Keep the browser payload to search records; lesson bodies, sources and media
// manifests stay on the server. Each result has a type-qualified identity.
export function buildSearchIndex({ concepts, companies, categories, levels, stages, countries }) {
  const conceptById = new Map(concepts.map(item => [item.id, item]));
  const categoryNames = new Map(categories.map(item => [item.id, item.name]));
  const stageNames = new Map(stages.map(item => [item.id, `${item.label} ${item.en}`]));
  const countryNames = new Map(countries.map(item => [item.id, item.label]));
  const record = (item, names, products, related, text) => ({
    ...item,
    primary: [item.title, item.en, item.id].map(normalize),
    names: names.map(normalize).filter(Boolean),
    products: products.map(normalize).filter(Boolean),
    related: normalize(related.join(' ')),
    text: normalize(text.join(' ')),
  });
  return [
    ...concepts.map(concept => record({
      key: `concept:${concept.id}`, id: concept.id, kind: 'concept',
      title: concept.title, en: concept.en, summary: concept.summary,
      href: `/concept/${concept.id}/`, number: concept.num,
      meta: `${categoryNames.get(concept.category)} · ${levels[concept.level]}`,
    }, [concept.title, concept.en, concept.id, ...concept.aliases], [], [],
    [concept.title, concept.en, ...concept.aliases, concept.summary, categoryNames.get(concept.category)])),
    ...companies.map(company => {
      const names = [company.name, company.en, company.id, ...company.aliases];
      const products = company.technologies.map(item => item.name);
      const related = company.concepts.flatMap(({ id }) => {
        const concept = conceptById.get(id);
        return concept ? [concept.title, concept.en, ...concept.aliases] : [];
      });
      const roles = company.stages.map(id => stageNames.get(id));
      return record({
        key: `company:${company.id}`, id: company.id, kind: 'company',
        title: company.name, en: company.en, summary: company.summary,
        href: `/company/${company.id}/`,
        meta: `${roles.join(' · ')} · ${countryNames.get(company.country)}`,
      }, names, products, related,
      [...names, ...products, ...related, ...roles, countryNames.get(company.country), company.summary,
        ...company.technologies.map(item => item.description)]);
    }),
  ];
}

function score(item, q, tokens) {
  if (item.primary.includes(q)) return 0;
  if (item.names.includes(q)) return 1;
  if (item.primary.some(name => name.startsWith(q))) return 2;
  if (item.names.some(name => name.startsWith(q))) return 3;
  if (item.primary.some(name => name.includes(q))) return 4;
  if (item.names.some(name => name.includes(q))) return 5;
  if (item.products.some(product => product.includes(q))) return 6;
  if (item.related.includes(q)) return 7;
  if (item.text.includes(q)) return 8;
  return tokens.every(token => item.text.includes(token)) ? 9 : Infinity;
}

export function searchUnified(index, { query = '', kind = 'all' } = {}) {
  const input = String(query).slice(0, searchQueryLimit).trim();
  const q = normalize(input);
  const tokens = input.split(/\s+/).map(normalize).filter(Boolean);
  if (input && !q) return [];
  const selectedKind = searchKinds.includes(kind) ? kind : 'all';
  return index.map((item, position) => ({ item, position, score: q ? score(item, q, tokens) : 0 }))
    .filter(({ item, score }) => (selectedKind === 'all' || item.kind === selectedKind) && Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.position - b.position)
    .map(({ item }) => item);
}

export function suggestUnified(index, { query = '', kind = 'all', limit = 6 } = {}) {
  if (!normalize(String(query).slice(0, searchQueryLimit)) || limit <= 0) return [];
  const matches = searchUnified(index, { query, kind });
  const output = matches.slice(0, limit);
  // Both kinds remain discoverable even when one kind has many close matches.
  if (kind === 'all' && limit >= 2 && output.length >= 2) {
    const missing = matches.find(item => !output.some(result => result.kind === item.kind));
    if (missing) output[output.length - 1] = missing;
  }
  return output;
}

export function readSearchFilters(search = '') {
  const params = new URLSearchParams(search);
  return {
    query: (params.get('q') || '').slice(0, searchQueryLimit),
    kind: searchKinds.includes(params.get('kind')) ? params.get('kind') : 'all',
  };
}

export function unifiedSearchUrl({ query = '', kind = 'all' } = {}) {
  const params = new URLSearchParams();
  const input = String(query).slice(0, searchQueryLimit).trim();
  if (input) params.set('q', input);
  if (kind !== 'all' && searchKinds.includes(kind)) params.set('kind', kind);
  return `/search/${params.size ? `?${params}` : ''}`;
}
