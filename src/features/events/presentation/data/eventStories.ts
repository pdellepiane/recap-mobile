/** WhatsApp-style stories: photos only, mock for a live event. */

export type EventStorySlide = {
  id: string;
  imageUrl: string;
};

export type EventStoriesBundle = {
  authorName: string;
  authorAvatarUrl: string;
  slides: EventStorySlide[];
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

/** Only `evt-live-2` has mock stories in the demo data. */
export function getEventStoriesBundle(eventId: string): EventStoriesBundle | null {
  if (eventId === 'evt-live-2') {
    return STORIES_EVT_LIVE_2;
  }
  return null;
}
