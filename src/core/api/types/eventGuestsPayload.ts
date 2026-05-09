import type { HomeEventGuestItem } from './homeEvents';

/**
 * Nested `guests` on GET /api/home/banners items and GET /api/events/:id.
 * `going` / `not_going` may contain `null` placeholders; prefer `going_count` / `not_going_count` for totals.
 */
export type EventDetailGuestsPayload = {
  going: (HomeEventGuestItem | null)[];
  not_going: (HomeEventGuestItem | null)[];
  going_count: number;
  not_going_count: number;
};
