import type { AlbumPhoto } from './eventAlbum';

function cacheKey(eventId: string, mediaId: string): string {
  return `${eventId}:${mediaId}`;
}

const albumPhotoCache = new Map<string, AlbumPhoto>();

export function cacheEventAlbumPhotos(eventId: string, photos: readonly AlbumPhoto[]): void {
  for (const photo of photos) {
    if (photo.id.startsWith('local-')) {
      continue;
    }
    albumPhotoCache.set(cacheKey(eventId, photo.id), photo);
  }
}

export function getCachedEventAlbumPhoto(eventId: string, mediaId: string): AlbumPhoto | null {
  return albumPhotoCache.get(cacheKey(eventId, mediaId)) ?? null;
}

export function setCachedEventAlbumPhoto(eventId: string, photo: AlbumPhoto): void {
  albumPhotoCache.set(cacheKey(eventId, photo.id), photo);
}
