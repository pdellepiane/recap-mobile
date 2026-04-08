/** Ranking rows on the event detail Ranking tab. */

export type RankingMedal = 'gold' | 'silver' | 'bronze';

export type RankingRow = {
  id: string;
  /** Displayed position (may repeat when tied). */
  rank: number;
  name: string;
  points: number;
  avatarUrl?: string;
  /** When no photo, initials (e.g. "JA"). */
  initials?: string;
  medal?: RankingMedal;
  isCurrentUser?: boolean;
  /**
   * Pre-start ranking: wedding sprite icon slot (0–3) instead of rank number/medal.
   */
  preEventRankSlot?: 0 | 1 | 2 | 3;
};

const RANKING_BY_EVENT: Record<string, RankingRow[]> = {
  'evt-live-1': [
    {
      id: 'rk1',
      rank: 1,
      name: 'Marco Fernandez',
      points: 100,
      medal: 'gold',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80',
    },
    {
      id: 'rk2',
      rank: 2,
      name: 'Michelle Lorenzo',
      points: 90,
      medal: 'silver',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80',
    },
    {
      id: 'rk3',
      rank: 3,
      name: 'Gabriel Hilario',
      points: 80,
      medal: 'bronze',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&q=80',
    },
    {
      id: 'rk4a',
      rank: 4,
      name: 'Jorge Arbuluz',
      points: 70,
      initials: 'JA',
    },
    {
      id: 'rk4b',
      rank: 4,
      name: 'Paolo Dellepiane',
      points: 70,
      isCurrentUser: true,
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&q=80',
    },
    {
      id: 'rk5a',
      rank: 5,
      name: 'Olinda Mattos',
      points: 80,
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80',
    },
    {
      id: 'rk5b',
      rank: 5,
      name: 'Manuel Romero',
      points: 80,
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&q=80',
    },
  ],
};

/**
 * For `evt-live-1` (event not live yet): zero points, no medals, decorative icon slot.
 */
function withPreEventRanking(rows: RankingRow[]): RankingRow[] {
  return rows.map((row, index) => ({
    ...row,
    points: 0,
    medal: undefined,
    preEventRankSlot: (index % 4) as 0 | 1 | 2 | 3,
  }));
}

export function getEventRanking(eventId: string): RankingRow[] {
  const rows = RANKING_BY_EVENT[eventId] ?? RANKING_BY_EVENT['evt-live-1'] ?? [];
  if (eventId === 'evt-live-1') {
    return withPreEventRanking(rows);
  }
  return rows;
}
