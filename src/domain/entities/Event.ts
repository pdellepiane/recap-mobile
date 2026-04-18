export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  /** Cover image for home cards and hero (optional). */
  coverImageUrl?: string;
  /** From GET /api/home/* `slug` when the event comes from home lists. */
  slug?: string;
  /** `guests.length` from the home event payload. */
  guestCount?: number;
  /** Guests with `has_responded !== 0`. */
  guestsRespondedCount?: number;
  /** Guests with `will_attend !== 0`. */
  guestsAttendingCount?: number;
  /** Home list / detail — lifecycle label (e.g. En curso, Por comenzar). */
  stage?: string;
  /** GET /api/events/:id — host line copy. */
  hostsLine?: string;
  /** First guest names from home list for carousel facepile (up to 3). */
  previewGuestNames?: string[];
  /** GET /api/events/:id — guest summary line from API. */
  guestsLine?: string;
  /** GET /api/events/:id — subtype / extra label. */
  typeDetail?: string;
};
