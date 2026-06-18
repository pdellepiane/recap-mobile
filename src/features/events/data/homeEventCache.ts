import type { Event as DomainEvent } from '@/src/domain/entities';

const cache = new Map<string, DomainEvent>();

/** Stores events from the last home feed load so detail can render instantly. */
export function seedHomeEventCache(events: DomainEvent[]): void {
  for (const e of events) {
    cache.set(e.id, e);
  }
}

export function getCachedHomeEvent(eventId: string): DomainEvent | undefined {
  return cache.get(eventId);
}
