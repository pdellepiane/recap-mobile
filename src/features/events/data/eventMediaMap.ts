import { resolveApiAssetUrl } from '@/src/core/api/resolveApiAssetUrl';
import type { EventMediaApiItem } from '@/src/core/api/types';
import type { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import i18n from '@/src/i18n/i18n';

/** Coerce API `likes_count` (number or numeric string) to a non-negative integer. */
export function normalizeMediaLikesCount(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw));
  }
  if (typeof raw === 'string') {
    const n = Number(raw.trim());
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  }
  return 0;
}

/** Maps GET /api/events/:id/media rows to album grid items (newest first). */
export function mapEventMediaApiToAlbumPhotos(items: EventMediaApiItem[]): AlbumPhoto[] {
  return [...items]
    .filter((r) => (r.type ?? '').trim().toLowerCase() === 'photo')
    .filter((r) => r.path?.trim())
    .sort((a, b) => {
      const ta = Date.parse(a.created_at ?? '');
      const tb = Date.parse(b.created_at ?? '');
      if (!Number.isFinite(ta) && !Number.isFinite(tb)) {
        return 0;
      }
      if (!Number.isFinite(ta)) {
        return 1;
      }
      if (!Number.isFinite(tb)) {
        return -1;
      }
      return tb - ta;
    })
    .map((r) => ({
      id: String(r.id),
      uri: resolveApiAssetUrl(r.path),
      aspectRatio: 1,
      authorShort: i18n.t('challenges.photoLabel'),
      authorAvatarUrl: undefined,
      likes: normalizeMediaLikesCount(r.likes_count),
      ...(r.liked_by_me === true ? { likedByMe: true } : {}),
    }));
}
