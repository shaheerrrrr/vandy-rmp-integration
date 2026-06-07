export interface NormalizedName {
  first: string;
  last: string;
  raw: string;
}

const PLACEHOLDERS = new Set(['staff', 'tba', 'tbd', 'tba/tbd', 'to be announced', 'to be determined']);

const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'phd', 'md', 'dds', 'esq', 'jd']);

function removeDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function stripSuffixes(parts: string[]): string[] {
  return parts.filter((p) => !SUFFIXES.has(p.toLowerCase().replace(/\./g, '')));
}

export function normalizeName(raw: string): NormalizedName | null {
  const trimmed = raw.trim();
  if (!trimmed || PLACEHOLDERS.has(trimmed.toLowerCase())) return null;

  let first = '';
  let last = '';

  if (trimmed.includes(',')) {
    // "Last, First [Middle]" format
    const commaIdx = trimmed.indexOf(',');
    const lastRaw = trimmed.slice(0, commaIdx).trim();
    const rest = trimmed.slice(commaIdx + 1).trim();
    last = removeDiacritics(lastRaw).toLowerCase();
    const firstParts = stripSuffixes(rest.split(/\s+/).filter(Boolean));
    first = firstParts.length > 0 ? removeDiacritics(firstParts[0]).toLowerCase() : '';
  } else {
    // "First [Middle...] Last" format
    const parts = stripSuffixes(trimmed.split(/\s+/).filter(Boolean));
    if (parts.length === 0) return null;
    last = removeDiacritics(parts[parts.length - 1]).toLowerCase();
    first = parts.length > 1 ? removeDiacritics(parts[0]).toLowerCase() : '';
  }

  if (!last) return null;
  return { first, last, raw: trimmed };
}

/**
 * Returns a score for how well a normalized query matches an RMP candidate.
 * 0 = no match (last name mismatch). Higher is better.
 */
export function matchScore(
  query: NormalizedName,
  candidate: { firstName: string; lastName: string },
): number {
  const candLast = removeDiacritics(candidate.lastName).toLowerCase();
  const candFirst = removeDiacritics(candidate.firstName).toLowerCase();

  // Last name must match
  if (candLast !== query.last) {
    // Allow prefix match for hyphenated / truncated names
    if (!candLast.startsWith(query.last) && !query.last.startsWith(candLast)) return 0;
    // Partial last-name match — lower confidence
    if (Math.abs(candLast.length - query.last.length) > 2) return 0;
  }

  let score = 10; // last name matched

  if (!query.first || !candFirst) return score;

  if (candFirst === query.first) {
    score += 5;
  } else if (query.first.length === 1 && candFirst.startsWith(query.first)) {
    // Query is an initial, candidate has full first name
    score += 3;
  } else if (candFirst.length === 1 && query.first.startsWith(candFirst)) {
    // Candidate has initial, query has full first name
    score += 3;
  } else if (candFirst.startsWith(query.first) || query.first.startsWith(candFirst)) {
    score += 2;
  }

  return score;
}

export function isPlaceholder(name: string): boolean {
  return !name.trim() || PLACEHOLDERS.has(name.trim().toLowerCase());
}
