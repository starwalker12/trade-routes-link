export const SYNONYM_GROUPS = [
  ['case', 'cover'],
  ['glass', 'protector', 'screen'],
  ['handsfree', 'earphones', 'earbuds', 'headphones'],
  ['charger', 'adaptor', 'adapter'],
  ['cable', 'wire'],
  ['silicone', 'soft'],
];

export function expandSearchWithSynonyms(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/);
  const expandedTerms = new Set<string>();

  for (const term of terms) {
    expandedTerms.add(term);
    
    for (const group of SYNONYM_GROUPS) {
      if (group.includes(term)) {
        group.forEach(synonym => expandedTerms.add(synonym));
      }
    }
  }

  return Array.from(expandedTerms);
}
