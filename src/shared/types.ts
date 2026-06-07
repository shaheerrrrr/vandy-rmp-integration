export interface RMPResult {
  legacyId: number;
  firstName: string;
  lastName: string;
  avgRating: number;
  avgDifficulty: number;
  numRatings: number;
  /** -1 means no data */
  wouldTakeAgainPercent: number;
  department: string;
  profileUrl: string;
  /** low = last-name matched but first-name/initial was ambiguous */
  confidence: 'high' | 'low';
}

export interface CachedEntry {
  result: RMPResult | null;
  timestamp: number;
}

export interface MessageToSW {
  type: 'GET_PROFESSOR';
  name: string;
}

export interface MessageFromSW {
  type: 'PROFESSOR_RESULT';
  name: string;
  result: RMPResult | null;
  error?: string;
}
