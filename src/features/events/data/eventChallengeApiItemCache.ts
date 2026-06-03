import type { EventChallengeApiItem } from '@/src/core/api/types';

const byChallengeId = new Map<string, EventChallengeApiItem>();

/** Latest GET /challenges rows keyed by challenge id (refreshed on each fetch). */
export function cacheEventChallengeApiItems(items: EventChallengeApiItem[]): void {
  byChallengeId.clear();
  for (const item of items) {
    byChallengeId.set(String(item.id), item);
  }
}

export function getCachedEventChallengeApiItem(
  challengeId: string,
): EventChallengeApiItem | undefined {
  return byChallengeId.get(challengeId);
}
