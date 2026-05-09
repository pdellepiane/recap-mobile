import type { EventDetailGuestsPayload } from './eventGuestsPayload';

/**
 * Event lifecycle / presentation discriminator. **Backend** (GET /api/home/banners `banner_type`):
 * {@link EventType.EventToStart}, {@link EventType.EventLive}, {@link EventType.EventFinished},
 * {@link EventType.NoEvent}. **Client-only** (never sent by API): {@link EventType.EventToStartToday}.
 */
export enum EventType {
  EventToStart = 'event_to_start',
  /** Same calendar day as the event, before start time — derived in app (e.g. home carousel). */
  EventToStartToday = 'event_to_start_today',
  EventLive = 'event_live',
  EventFinished = 'event_finished',
  NoEvent = 'no_event',
}

/** Row from GET /api/home/banners (slider cards; `banner_type` drives layout). */
export type HomeBannerItem = {
  id: number;
  banner_type: EventType;
  slug: string;
  name: string;
  type: string;
  datetime: string;
  with_time: number;
  cover: string;
  /** Relative or absolute image paths for the facepile (e.g. `uploads/events/12/photos/guest-1.jpg`). */
  guest_images: string[];
  hosts: string;
  /** Omitted on older banner payloads. */
  guests?: EventDetailGuestsPayload;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type HomeBannersListResponse = {
  data: HomeBannerItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};
