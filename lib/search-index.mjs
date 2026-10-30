import { concepts, categories, levels } from './data.mjs';
import { companies, companyStages, companyCountries } from './companies.mjs';
import { buildSearchIndex } from './unified-search.mjs';

// Import from server pages/layout only, then pass the compact records as props.
export const searchIndex = buildSearchIndex({
  concepts, companies, categories, levels,
  stages: companyStages, countries: companyCountries,
});
