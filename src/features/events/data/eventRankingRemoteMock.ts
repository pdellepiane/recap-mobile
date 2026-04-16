import type { EventRankingApiItem } from '@/src/core/api/types';
import type { RankingRow } from '@/src/features/events/presentation/data/eventRanking';
import { mapRankingApiItemsToRows } from '@/src/features/events/data/eventRankingMap';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildMockRankingItems(eventId: string): EventRankingApiItem[] {
  const seed = eventId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const count = 6;
  return Array.from({ length: count }, (_, i) => {
    const basePoints = 140 - i * 12 + (seed % 7);
    return {
      id: 80000 + seed + i,
      name: ['María', 'Lucía', 'Diego', 'Ana', 'Carlos', 'Valentina'][i % 6] ?? 'Invitado',
      lastname: ['García', 'Ríos', 'Flores', 'Núñez', 'Paredes', 'Quispe'][i % 6] ?? 'Pérez',
      points: Math.max(0, basePoints - i * 3),
    };
  });
}

/**
 * Delayed mock leaderboard (deterministic per `eventId`) with mock avatars enabled.
 */
export async function fetchMockEventRankingRemote(eventId: string): Promise<RankingRow[]> {
  await delay(380);
  const items = buildMockRankingItems(eventId);
  return mapRankingApiItemsToRows(items, { assignMockAvatars: true });
}
