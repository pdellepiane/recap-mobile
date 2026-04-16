import type { Event as DomainEvent } from '@/src/domain/entities';

const cache = new Map<string, DomainEvent>();
let hostedEventIdSet = new Set<string>();

/** Stores events from the last home feed load so detail can render instantly. */
export function seedHomeEventCache(
  events: DomainEvent[],
  options?: { hostedEventIds?: readonly string[] },
): void {
  for (const e of events) {
    cache.set(e.id, e);
  }
  if (options?.hostedEventIds !== undefined) {
    hostedEventIdSet = new Set(options.hostedEventIds);
  }
}

export function getCachedHomeEvent(eventId: string): DomainEvent | undefined {
  return cache.get(eventId);
}

/** True when `eventId` was in the last GET /api/home/host-events payload (cached on home load). */
export function isEventHostedFromHomeFeed(eventId: string): boolean {
  return hostedEventIdSet.has(eventId);
}
