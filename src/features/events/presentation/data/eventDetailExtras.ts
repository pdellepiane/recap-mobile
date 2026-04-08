import type { Event } from '@/src/domain/entities';
import type { ImageSourcePropType } from 'react-native';

export type EventDetailExtras = {
  venueArea: string;
  /** Address or venue name for Google Maps search. */
  mapsSearchQuery?: string;
  creatorsLine: string;
  guestsConfirmed: number;
  guestsPending: number;
  confirmedGuests: { id: string; name: string }[];
  /** Local hero image; falls back to the event `coverImageUrl` when missing. */
  heroImage?: number;
  /** Circular photo over the hero (couple / group), local asset. */
  profileImage: number;
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

const EXTRAS: Record<string, EventDetailExtras> = {
  'evt-live-1': {
    venueArea: 'Barranco',
    mapsSearchQuery: 'Convención de Gala Plutón, Barranco, Lima, Perú',
    creatorsLine: 'Mariel Santos y Jorge Panduro',
    guestsConfirmed: 20,
    guestsPending: 32,
    confirmedGuests: [{ id: 'g1', name: 'Marco Fernandez' }],
    heroImage: require('../../../../../assets/images/event-detail/hero-boda-mariel-jorge.png'),
    profileImage: require('../../../../../assets/images/event-detail/avatar-boda-mariel-jorge.png'),
  },
  'evt-live-2': {
    venueArea: 'Santiago de Surco',
    mapsSearchQuery: 'Jardín Los Olivos, Lima, Perú',
    creatorsLine: 'Camila Ríos y Andrés Mendoza',
    guestsConfirmed: 48,
    guestsPending: 12,
    confirmedGuests: [
      { id: 'g1', name: 'Marco Fernandez' },
      { id: 'g2', name: 'Lucía Vargas' },
    ],
    profileImage: require('../../../../../assets/images/event-detail/avatar-boda-mariel-jorge.png'),
    isLiveExecution: true,
    reactionImages: [
      require('../../../../../assets/images/event-detail/reactions/1-party.png'),
      require('../../../../../assets/images/event-detail/reactions/2-sad.png'),
      require('../../../../../assets/images/event-detail/reactions/3-fun.png'),
      require('../../../../../assets/images/event-detail/reactions/4-hearts.png'),
    ],
    hideCountdownInDetail: true,
  },
};

/**
 * Extra UI data for the event detail screen (two-line venue, guests, local hero, etc.).
 */
export function getEventDetailExtras(eventId: string): EventDetailExtras | null {
  return EXTRAS[eventId] ?? null;
}

/** Title shown on detail (mock aligned to design). */
export function displayTitleForEvent(event: Event): string {
  if (event.id === 'evt-live-1') {
    return 'Boda Mariel & Jorge';
  }
  if (event.id === 'evt-live-2') {
    return 'Boda Camila & Andrés';
  }
  return event.title;
}

/** Long description on the detail screen. */
export function displayDescriptionForEvent(event: Event): string {
  if (event.id === 'evt-live-1') {
    return 'Es el momento más especial del día, donde dos personas se unen en amor y compromiso frente a sus seres queridos!';
  }
  if (event.id === 'evt-live-2') {
    return 'El evento ya comenzó: disfruta cada momento con los novios, participa en los challenges y comparte el álbum en vivo. ¡Gracias por ser parte de este día!';
  }
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
