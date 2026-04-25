import type { Event } from '@/src/domain/entities';
import { images } from '@/src/assets/images';
import type { ImageSourcePropType } from 'react-native';

/** Default four reaction chips (left×2, right×2) for event detail hero when extras omit `reactionImages`. */
export const DEFAULT_LIVE_REACTION_IMAGES = [
  images.eventDetail.reactions.party,
  images.eventDetail.reactions.sad,
  images.eventDetail.reactions.fun,
  images.eventDetail.reactions.hearts,
] as const satisfies readonly [
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
];

export type EventDetailExtras = {
  venueArea: string;
  /** Address or venue name for Google Maps search. */
  mapsSearchQuery?: string;
  /** Same role as GET /api/events/:id `hosts` when not provided by the API. */
  hostsLine: string;
  guestsConfirmed: number;
  guestsPending: number;
  confirmedGuests: { id: string; name: string }[];
  /** Local hero image; falls back to the event `coverImageUrl` when missing. */
  heroImage?: number;
  /** Event already started: UI with emojis around the avatar, etc. */
  isLiveExecution?: boolean;
  /**
   * Four reaction assets around the avatar (fixed order: left×2, right×2), only when `isLiveExecution`.
   */
  reactionImages?: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  /** Hide countdown on Detail tab (event in progress). */
  hideCountdownInDetail?: boolean;
};

/**
 * Optional UI-only data for the event detail screen (two-line venue, guests, local hero, etc.).
 */
export function getEventDetailExtras(_eventId: string): EventDetailExtras | null {
  return null;
}

/** Title shown on detail. */
export function displayTitleForEvent(event: Event): string {
  return event.title;
}

/** Long description on the detail screen. */
export function displayDescriptionForEvent(event: Event): string {
  return event.description;
}

/** Google Maps search URL (web, for WebView or browser). */
export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}

/** Maps query text: event extras or location + area combined. */
export function getMapsSearchQueryForEvent(eventId: string, event: Event | null): string | null {
  const extras = getEventDetailExtras(eventId);
  const fromExtras = extras?.mapsSearchQuery?.trim();
  if (fromExtras) {
    return fromExtras;
  }
  const loc = event?.location?.trim();
  if (!loc) {
    return null;
  }
  const area = extras?.venueArea?.trim();
  return area ? `${loc}, ${area}` : loc;
}
