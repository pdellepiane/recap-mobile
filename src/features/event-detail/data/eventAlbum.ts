/** Album photos on the event detail Álbum tab (from GET /api/events/:id/media). */

export type AlbumPhoto = {
  id: string;
  uri: string;
  /** Width / height ratio for the image `aspectRatio` in RN. */
  aspectRatio: number;
  /** Truncated display name (e.g. "Em…"). */
  authorShort: string;
  authorAvatarUrl?: string;
  likes: number;
};
