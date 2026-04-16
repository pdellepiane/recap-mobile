import type { EventRankingApiItem } from '@/src/core/api/types';
import type { RankingMedal, RankingRow } from '@/src/features/events/presentation/data/eventRanking';

/** Rotating Unsplash thumbnails when {@link mapRankingApiItemsToRows} uses `assignMockAvatars`. */
const MOCK_AVATAR_POOL = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&q=80',
];

function initialsFromFullName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
}

/** Olympic-style ranks on an array sorted by points descending. */
function assignCompetitionRanks(sorted: EventRankingApiItem[]): number[] {
  const n = sorted.length;
  const ranks: number[] = [];
  let i = 0;
  while (i < n) {
    const rank = i + 1;
    let j = i + 1;
    while (j < n && sorted[j]!.points === sorted[i]!.points) {
      j++;
    }
    for (let k = i; k < j; k++) {
      ranks[k] = rank;
    }
    i = j;
  }
  return ranks;
}

export type MapRankingOptions = {
  /** When true (mock remote), every row gets {@link MOCK_AVATAR_POOL} rotation. Real API leaves avatars unset → UI shows initials. */
  assignMockAvatars?: boolean;
};

/** Maps GET /api/events/:id/ranking `data[]` into {@link RankingRow} for the detail tab. */
export function mapRankingApiItemsToRows(
  items: EventRankingApiItem[],
  options?: MapRankingOptions,
): RankingRow[] {
  if (items.length === 0) {
    return [];
  }
  const sorted = [...items].sort((a, b) => b.points - a.points);
  const ranks = assignCompetitionRanks(sorted);
  const assignMockAvatars = options?.assignMockAvatars === true;

  return sorted.map((item, index) => {
    const fullName = `${item.name} ${item.lastname}`.trim() || item.name;
    const rank = ranks[index]!;
    let medal: RankingMedal | undefined;
    if (index === 0) {
      medal = 'gold';
    } else if (index === 1) {
      medal = 'silver';
    } else if (index === 2) {
      medal = 'bronze';
    }
    const row: RankingRow = {
      id: String(item.id),
      rank,
      name: fullName,
      points: item.points,
      medal,
      initials: initialsFromFullName(fullName),
    };
    if (assignMockAvatars) {
      row.avatarUrl = MOCK_AVATAR_POOL[index % MOCK_AVATAR_POOL.length];
    }
    return row;
  });
}
