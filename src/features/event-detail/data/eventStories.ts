/** WhatsApp-style stories: photos only; populate when a stories API exists. */

export type EventStorySlide = {
  id: string;
  imageUrl: string;
};

export type EventStoriesBundle = {
  authorName: string;
  authorAvatarUrl: string;
  slides: EventStorySlide[];
};

export function getEventStoriesBundle(_eventId: string): EventStoriesBundle | null {
  return null;
}
