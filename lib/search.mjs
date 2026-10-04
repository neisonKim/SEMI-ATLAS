export const normalizeSearch = (value) => String(value)
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[\s·\-_/.,?？!()]+/g, '');

export function scoreConcept(concept, query) {
  const q = normalizeSearch(query);
  if (!q) return 5;
  const aliases = [concept.en, ...concept.aliases].map(normalizeSearch);
  const title = normalizeSearch(concept.title);
  if (aliases.includes(q)) return 0;
  if (title.includes(q)) return 1;
  if (aliases.some((alias) => alias.startsWith(q))) return 2;
  if (aliases.some((alias) => alias.includes(q))) return 3;
  const haystack = normalizeSearch([concept.title, concept.en, ...concept.aliases, concept.summary].join(' '));
  const terms = String(query).trim().split(/\s+/).map(normalizeSearch).filter(Boolean);
  return terms.length && terms.every((term) => haystack.includes(term)) ? 4 : Number.POSITIVE_INFINITY;
}

export function searchConcepts(concepts, { query = '', category = 'all', level = 'all' } = {}) {
  return concepts
    .map((concept, index) => ({ concept, index, score: scoreConcept(concept, query) }))
    .filter(({ concept, score }) => Number.isFinite(score)
      && (category === 'all' || concept.category === category)
      && (level === 'all' || String(concept.level) === String(level)))
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map(({ concept }) => concept);
}

export function suggestConcepts(concepts, {
  query = '', category = 'all', level = 'all', limit = 5,
} = {}) {
  if (!normalizeSearch(query) || limit <= 0) return [];

  const direct = searchConcepts(concepts, { query, category, level });
  const byId = new Map(concepts.map((concept) => [concept.id, concept]));
  const output = [];
  const seen = new Set();

  const allowed = (concept) => concept
    && (category === 'all' || concept.category === category)
    && (level === 'all' || String(concept.level) === String(level));

  const push = (concept, reason) => {
    if (!allowed(concept) || seen.has(concept.id) || output.length >= limit) return;
    seen.add(concept.id);
    output.push({ concept, reason });
  };

  direct.slice(0, limit).forEach((concept) => push(concept, 'match'));

  if (output.length < limit) {
    for (const seed of direct.slice(0, 2)) {
      const connectedIds = [
        ...(seed.prerequisites || []),
        ...(seed.related || []),
        ...(seed.next || []),
      ];
      connectedIds.forEach((id) => push(byId.get(id), 'connected'));
      if (output.length >= limit) break;
    }
  }

  return output.slice(0, limit);
}
