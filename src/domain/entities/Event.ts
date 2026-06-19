export type EventHost = {
  id: string;
  name: string;
  email?: string;
};

/** Matches event detail `guests.going` / `guests.not_going` (and home `will_attend`). */
export type EventGuestRsvp = 'going' | 'not_going';

export type EventGuest = {
  id: string;
  name: string;
  rsvp: EventGuestRsvp;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  /**
   * Merged venue + city for maps / share (`location`, `city` from API).
   * TODO(backend): Dedicated maps search string (or lat/lng) when this is not ideal for Google Maps.
   */
  location: string;
  /** API `city` — overview address card, línea 1. */
  city?: string;
  /** API `location` (nombre del lugar / dirección) — overview address card, línea 2. */
  venue?: string;
  coverImageUrl?: string;
  /** API `user_id` for the event owner/creator; `hosts` remains the organizer membership source. */
  ownerUserId?: string;
  /** True when organizer membership was resolved from detail API user ids. */
  organizerUserIdsResolved?: boolean;
  hosts?: EventHost[];
  guests?: EventGuest[];
  /** From GET /api/events/:id `show_guest_list` when present. */
  showGuestList?: boolean;
  shareUrl: string;
};
