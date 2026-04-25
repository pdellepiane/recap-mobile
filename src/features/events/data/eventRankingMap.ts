import type { EventRankingApiItem } from '@/src/core/api/types';
import type { RankingMedal, RankingRow } from '@/src/features/event-detail/data/eventRanking';

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

/**
 * Maps GET /api/events/:id/ranking `data[]` into {@link RankingRow} for the detail tab.
 * Preserves **backend array order** (no client-side sort). Position is 1-based index in that order.
 */
export function mapRankingApiItemsToRows(items: EventRankingApiItem[]): RankingRow[] {
  if (items.length === 0) {
    return [];
  }

  return items.map((item, index) => {
    const fullName = `${item.name} ${item.lastname}`.trim() || item.name;
    const rank = index + 1;
    let medal: RankingMedal | undefined;
    if (rank === 1) {
      medal = 'gold';
    } else if (rank === 2) {
      medal = 'silver';
    } else if (rank === 3) {
      medal = 'bronze';
    }
    return {
      id: String(item.id),
      rank,
      name: fullName,
      points: item.points,
      medal,
      initials: initialsFromFullName(fullName),
    };
  });
}
