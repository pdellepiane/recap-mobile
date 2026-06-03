/** WhatsApp-style stories from GET /api/events/:id/media (photo rows). */

export type EventStorySlide = {
  id: string;
  imageUrl: string;
};

export type EventStoriesBundle = {
  authorName: string;
  authorAvatarUrl: string;
  slides: EventStorySlide[];
};

export function buildEventStoriesBundle(
  slides: EventStorySlide[],
  author: { name: string; avatarUrl?: string },
): EventStoriesBundle | null {
  if (slides.length === 0) {
    return null;
  }
  return {
    authorName: author.name,
    authorAvatarUrl: author.avatarUrl ?? '',
    slides,
  };
}
