import { HomeBannerType, type HomeBannerItem, type HomeEventItem } from '@/src/core/api/types';
import {
  GUESTS_ANNIVERSARY_11002,
  GUESTS_BABY_SHOWER_12001,
  GUESTS_BAUTIZO_11007,
  GUESTS_CENA_11004,
  GUESTS_CUMPLE_11006,
  GUESTS_DESPEDIDA_11003,
  GUESTS_GRAD_12002,
  GUESTS_RETIRO_11008,
  GUESTS_TODAY_11009,
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

/** Lima calendar “today” at 19:00 -05:00 so one mock host row always matches el día actual. */
function mockHostEventDatetimeTodayLima(): string {
  const limaDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return `${limaDateStr}T19:00:00-05:00`;
}

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
 * Six distinct URLs for `event_finished` banner collage (`guest_images`, max 6 shown):
 * one group shot, then five different individual portraits.
 */
export const MOCK_BANNER_FINISHED_GUEST_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=240&h=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&auto=format&fit=crop&q=80',
];

/**
 * API-shaped “Mis eventos” rows (Spanish copy, Lima-area venues).
 */
export const MOCK_HOME_HOST_EVENTS: HomeEventItem[] = [
  {
    id: 11009,
    slug: 'brunch-equipo-recap',
    name: 'Brunch equipo Recap',
    type: 'Corporativo',
    datetime: mockHostEventDatetimeTodayLima(),
    with_time: 1,
    stage: 'Hoy',
    city: 'Miraflores',
    location: 'Hotel Belmond — terraza',
    cover: COVER_DINNER,
    guests: GUESTS_TODAY_11009,
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
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
    id: 0,
    banner_type: HomeBannerType.NoEvent,
    slug: 'promo-primer-evento',
    name: 'Crea tu primer evento',
    type: 'Promo',
    datetime: '',
    with_time: 0,
    cover: '',
    guest_images: [],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 12001,
    banner_type: HomeBannerType.EventToStart,
    slug: 'baby-shower-valentina',
    name: 'Boda de Pepsi&Coca',
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
    id: 11001,
    banner_type: HomeBannerType.EventLive,
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
    id: 11002,
    banner_type: HomeBannerType.EventFinished,
    slug: 'aniversario-lucia-martin',
    name: 'Aniversario Lucía & Martín',
    type: 'Aniversario',
    datetime: '2026-09-20T19:30:00-05:00',
    with_time: 1,
    cover: COVER_GARDEN,
    guest_images: [...MOCK_BANNER_FINISHED_GUEST_IMAGES],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 12002,
    banner_type: HomeBannerType.EventToStart,
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
    banner_type: HomeBannerType.EventFinished,
    slug: 'despedida-soltera-andrea',
    name: 'Despedida de soltera — Andrea',
    type: 'Fiesta',
    datetime: '2025-11-30T22:00:00-05:00',
    with_time: 1,
    cover: COVER_NIGHT,
    guest_images: [...MOCK_BANNER_FINISHED_GUEST_IMAGES],
    timezone: 'America/Lima',
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
  },
  {
    id: 11006,
    banner_type: HomeBannerType.EventToStart,
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
    MOCK_HOME_HOST_EVENTS.find((e) => e.id === n) ?? MOCK_HOME_GUEST_EVENTS.find((e) => e.id === n)
  );
}
