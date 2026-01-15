export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchQuery(terms: string[]): string {
  return terms.join(' ');
}

export function calculateRelevanceScore(searchText: string, queryTerms: string[]): number {
  const textLower = searchText.toLowerCase();
  let score = 0;

  for (const term of queryTerms) {
    if (textLower.includes(term)) {
      score += 1;
      if (textLower.startsWith(term)) {
        score += 0.5;
      }
    }
  }

  return score;
}
