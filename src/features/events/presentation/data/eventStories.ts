/** WhatsApp-style stories: photos only; mock bundles per demo event id. */

export type EventStorySlide = {
  id: string;
  imageUrl: string;
};

export type EventStoriesBundle = {
  authorName: string;
  authorAvatarUrl: string;
  slides: EventStorySlide[];
};

const STORIES_EVT_LIVE_1: EventStoriesBundle = {
  authorName: 'Mariel Santos',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&q=80',
  slides: [
    {
      id: 'm1',
      imageUrl:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 'm2',
      imageUrl:
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 'm3',
      imageUrl:
        'https://images.unsplash.com/photo-1606800052052-a08c714e61e2?w=1080&auto=format&fit=crop&q=85',
    },
  ],
};

/** “Hoy” host row: {@link MOCK_HOME_HOST_EVENTS} id `11009` (`brunch-equipo-recap`). */
const STORIES_11009_BRUNCH: EventStoriesBundle = {
  authorName: 'Equipo Recap',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&q=80',
  slides: [
    {
      id: 'b1',
      imageUrl:
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 'b2',
      imageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 'b3',
      imageUrl:
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1080&auto=format&fit=crop&q=85',
    },
  ],
};

const STORIES_EVT_LIVE_2: EventStoriesBundle = {
  authorName: 'Camila Ríos',
  authorAvatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&q=80',
  slides: [
    {
      id: 's1',
      imageUrl:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 's2',
      imageUrl:
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1080&auto=format&fit=crop&q=85',
    },
    {
      id: 's3',
      imageUrl:
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1080&auto=format&fit=crop&q=85',
    },
  ],
};

/**
 * Mock stories keyed by domain event id.
 * `11001` is the live wedding on the home mock feed / banner (`boda-mariel-jorge`).
 */
const STORIES_BY_EVENT_ID: Record<string, EventStoriesBundle> = {
  'evt-live-1': STORIES_EVT_LIVE_1,
  /** Home mock host event: {@link MOCK_HOME_BANNERS} `EventLive` + {@link MOCK_HOME_HOST_EVENTS}. */
  '11001': STORIES_EVT_LIVE_1,
  /** Home mock “Hoy” host row: {@link MOCK_HOME_HOST_EVENTS} brunch equipo Recap. */
  '11009': STORIES_11009_BRUNCH,
  'evt-live-2': STORIES_EVT_LIVE_2,
};

export function getEventStoriesBundle(eventId: string): EventStoriesBundle | null {
  return STORIES_BY_EVENT_ID[eventId] ?? null;
}
