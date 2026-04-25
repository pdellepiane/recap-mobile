/** Ranking rows on the event detail Ranking tab. */

export type RankingMedal = 'gold' | 'silver' | 'bronze';

export type RankingRow = {
  id: string;
  rank: number;
  name: string;
  points: number;
  /** When no photo, initials (e.g. "JA"). */
  initials?: string;
  medal?: RankingMedal;
};
