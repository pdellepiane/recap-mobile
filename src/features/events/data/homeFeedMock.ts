import type { HomeBannerItem, HomeEventItem } from '@/src/core/api/types';
import {
  GUESTS_ANNIVERSARY_11002,
  GUESTS_BABY_SHOWER_12001,
  GUESTS_BAUTIZO_11007,
  GUESTS_CENA_11004,
  GUESTS_CUMPLE_11006,
  GUESTS_DESPEDIDA_11003,
  GUESTS_GRAD_12002,
  GUESTS_RETIRO_11008,
  GUESTS_WEDDING_11001,
  GUESTS_WORKSHOP_11005,
} from '@/src/features/events/data/homeFeedMockGuests';

/**
 * When `EXPO_PUBLIC_MOCK_HOME_FEED` is `true`, `1`, or `yes`, {@link EventRepository}
 * returns the payloads below instead of calling the home API — useful when your account
 * has no events yet but you need realistic copy and remote images on the home screen.
 */
export function isMockHomeFeedEnabled(): boolean {
  const v = process.env.EXPO_PUBLIC_MOCK_HOME_FEED?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

const MOCK_TS = '2026-01-15T12:00:00.000000Z';

/** Remote covers (Unsplash) so {@link Image.getSize} and carousel layout work like production. */
const COVER_WEDDING =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=85';
const COVER_GARDEN =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=85';
const COVER_BABY =
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&auto=format&fit=crop&q=85';
const COVER_GRAD =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=85';
const COVER_NIGHT =
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=85';
const COVER_DINNER =
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&auto=format&fit=crop&q=85';
const COVER_MEETING =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=85';
const COVER_KIDS_PARTY =
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&auto=format&fit=crop&q=85';
const COVER_CHAPEL =
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=85';
const COVER_WELLNESS =
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=85';

/**
 * API-shaped “Mis eventos” rows (Spanish copy, Lima-area venues).
 */
export const MOCK_HOME_HOST_EVENTS: HomeEventItem[] = [
  {
    id: 11001,
    slug: 'boda-mariel-jorge',
    name: 'Boda Mariel & Jorge',
    type: 'Boda',
    datetime: '2026-06-14T16:00:00-05:00',
    with_time: 1,
    stage: 'En curso',
    city: 'Cieneguilla',
    location: 'Hacienda Los Ficus',
    cover: COVER_WEDDING,
    guests: GUESTS_WEDDING_11001,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11002,
    slug: 'aniversario-lucia-martin',
    name: 'Aniversario Lucía & Martín',
    type: 'Aniversario',
    datetime: '2026-09-20T19:30:00-05:00',
    with_time: 1,
    stage: 'Por comenzar',
    city: 'San Isidro',
    location: 'Restaurant Cosme, av. Pardo',
    cover: COVER_GARDEN,
    guests: GUESTS_ANNIVERSARY_11002,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11003,
    slug: 'despedida-soltera-andrea',
    name: 'Despedida de soltera — Andrea',
    type: 'Fiesta',
    datetime: '2025-11-30T22:00:00-05:00',
    with_time: 1,
    stage: 'Finalizado',
    city: 'Barranco',
    location: 'Casona Muña',
    cover: COVER_NIGHT,
    guests: GUESTS_DESPEDIDA_11003,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11004,
    slug: 'cena-anual-socios',
    name: 'Cena anual de socios',
    type: 'Corporativo',
    datetime: '2026-02-14T20:00:00-05:00',
    with_time: 1,
    stage: 'Finalizado',
    city: 'San Borja',
    location: 'Club de la Unión',
    cover: COVER_DINNER,
    guests: GUESTS_CENA_11004,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11005,
    slug: 'workshop-fotografia-movil',
    name: 'Workshop fotografía móvil',
    type: 'Taller',
    datetime: '2026-03-22T10:00:00-05:00',
    with_time: 1,
    stage: 'Finalizado',
    city: 'Barranco',
    location: 'Centro Cultural PUCP',
    cover: COVER_MEETING,
    guests: GUESTS_WORKSHOP_11005,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11006,
    slug: 'cumple-bruno-8',
    name: 'Cumple Bruno · 8 años',
    type: 'Cumpleaños',
    datetime: '2026-05-10T15:00:00-05:00',
    with_time: 1,
    stage: 'Por comenzar',
    city: 'La Molina',
    location: 'Casa club Los Próceres',
    cover: COVER_KIDS_PARTY,
    guests: GUESTS_CUMPLE_11006,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11007,
    slug: 'bautizo-mellizos',
    name: 'Bautizo de los mellizos',
    type: 'Ceremonia',
    datetime: '2026-07-26T09:30:00-05:00',
    with_time: 1,
    stage: 'Confirmado',
    city: 'Magdalena',
    location: 'Parroquia Santa María Reyna',
    cover: COVER_CHAPEL,
    guests: GUESTS_BAUTIZO_11007,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11008,
    slug: 'retiro-bienestar-q3',
    name: 'Retiro bienestar — Q3',
    type: 'Retiro',
    datetime: '2026-10-03T08:00:00-05:00',
    with_time: 1,
    stage: 'Inscripciones abiertas',
    city: 'Asia',
    location: 'Hotel Las Palmas',
    cover: COVER_WELLNESS,
    guests: GUESTS_RETIRO_11008,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
];

/**
 * API-shaped “Planes” (invited / guest) rows.
 */
export const MOCK_HOME_GUEST_EVENTS: HomeEventItem[] = [
  {
    id: 12001,
    slug: 'baby-shower-valentina',
    name: 'Baby shower de Valentina',
    type: 'Baby shower',
    datetime: '2026-04-18T11:00:00-05:00',
    with_time: 1,
    stage: 'Confirmado',
    city: 'Miraflores',
    location: 'Salón La Piazza',
    cover: COVER_BABY,
    guests: GUESTS_BABY_SHOWER_12001,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 12002,
    slug: 'graduacion-medicina-ucsur',
    name: 'Graduación Medicina — promo 2021',
    type: 'Ceremonia',
    datetime: '2026-07-21T17:00:00-05:00',
    with_time: 1,
    stage: 'Invitación aceptada',
    city: 'Surco',
    location: 'Campus UPC — auditorio principal',
    cover: COVER_GRAD,
    guests: GUESTS_GRAD_12002,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
];

/**
 * Slider cards: `id` matches a host or guest event so taps resolve in {@link EventRepository.getEventById}.
 */
export const MOCK_HOME_BANNERS: HomeBannerItem[] = [
  {
    id: 11001,
    banner_type: 'event_live',
    slug: 'boda-mariel-jorge',
    name: 'Boda Mariel & Jorge',
    type: 'Boda',
    datetime: '2026-06-14T16:00:00-05:00',
    with_time: 1,
    cover: COVER_WEDDING,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 12001,
    banner_type: 'event_to_start',
    slug: 'baby-shower-valentina',
    name: 'Baby shower de Valentina',
    type: 'Baby shower',
    datetime: '2026-04-18T11:00:00-05:00',
    with_time: 1,
    cover: COVER_BABY,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11002,
    banner_type: 'event_finished',
    slug: 'aniversario-lucia-martin',
    name: 'Aniversario Lucía & Martín',
    type: 'Aniversario',
    datetime: '2026-09-20T19:30:00-05:00',
    with_time: 1,
    cover: COVER_GARDEN,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 12002,
    banner_type: 'event_to_start',
    slug: 'graduacion-medicina-ucsur',
    name: 'Graduación Medicina — promo 2021',
    type: 'Ceremonia',
    datetime: '2026-07-21T17:00:00-05:00',
    with_time: 1,
    cover: COVER_GRAD,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11003,
    banner_type: 'event_finished',
    slug: 'despedida-soltera-andrea',
    name: 'Despedida de soltera — Andrea',
    type: 'Fiesta',
    datetime: '2025-11-30T22:00:00-05:00',
    with_time: 1,
    cover: COVER_NIGHT,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11006,
    banner_type: 'event_to_start',
    slug: 'cumple-bruno-8',
    name: 'Cumple Bruno · 8 años',
    type: 'Cumpleaños',
    datetime: '2026-05-10T15:00:00-05:00',
    with_time: 1,
    cover: COVER_KIDS_PARTY,
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
];

export function getMockHomeEventApiById(eventId: string): HomeEventItem | undefined {
  const n = Number(eventId);
  if (!Number.isFinite(n)) {
    return undefined;
  }
  return (
    MOCK_HOME_HOST_EVENTS.find((e) => e.id === n) ??
    MOCK_HOME_GUEST_EVENTS.find((e) => e.id === n)
  );
}
