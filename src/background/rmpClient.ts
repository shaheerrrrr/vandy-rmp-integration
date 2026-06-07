import type { RMPResult } from '../shared/types';
import { normalizeName, matchScore } from '../shared/nameNormalize';

const SCHOOL_ID = 'U2Nob29sLTQwMDI='; // btoa('School-4002') — Vanderbilt University
const GRAPHQL_URL = 'https://www.ratemyprofessors.com/graphql';
const AUTH_HEADER = 'Basic dGVzdDp0ZXN0';

// Confirmed schema 2026-06: these fields exist and return expected data.
const QUERY = `query TeacherSearch($text: String!, $schoolID: ID!) {
  newSearch {
    teachers(query: { text: $text, schoolID: $schoolID }) {
      edges {
        node {
          legacyId
          firstName
          lastName
          avgRating
          avgDifficulty
          numRatings
          wouldTakeAgainPercent
          department
        }
      }
    }
  }
}`;

interface RMPNode {
  legacyId: number;
  firstName: string;
  lastName: string;
  avgRating: number;
  avgDifficulty: number;
  numRatings: number;
  wouldTakeAgainPercent: number;
  department: string;
}

export async function searchProfessor(rawName: string): Promise<RMPResult | null> {
  const normalized = normalizeName(rawName);
  if (!normalized) return null;

  const searchText = [normalized.first, normalized.last].filter(Boolean).join(' ');

  const resp = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH_HEADER,
    },
    body: JSON.stringify({ query: QUERY, variables: { text: searchText, schoolID: SCHOOL_ID } }),
  });

  if (!resp.ok) throw new Error(`RMP ${resp.status}`);

  const json = await resp.json() as { data: { newSearch: { teachers: { edges: { node: RMPNode }[] } } } };
  const edges = json?.data?.newSearch?.teachers?.edges ?? [];

  if (edges.length === 0) return null;

  // Pick best-scoring candidate; require at minimum a solid last-name match (score >= 10)
  let bestScore = 9; // threshold: must beat this
  let bestNode: RMPNode | null = null;

  for (const { node } of edges) {
    const score = matchScore(normalized, node);
    if (score > bestScore) {
      bestScore = score;
      bestNode = node;
    }
  }

  if (!bestNode) return null;

  return {
    legacyId: bestNode.legacyId,
    firstName: bestNode.firstName,
    lastName: bestNode.lastName,
    avgRating: bestNode.avgRating,
    avgDifficulty: bestNode.avgDifficulty,
    numRatings: bestNode.numRatings,
    wouldTakeAgainPercent: bestNode.wouldTakeAgainPercent,
    department: bestNode.department,
    profileUrl: `https://www.ratemyprofessors.com/professor/${bestNode.legacyId}`,
    confidence: bestScore >= 15 ? 'high' : 'low',
  };
}
