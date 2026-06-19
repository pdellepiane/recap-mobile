import type { AlbumPhoto } from '../../data/eventAlbum';
import {
  getCachedEventAlbumPhoto,
  setCachedEventAlbumPhoto,
} from '../../data/eventAlbumPhotoCache';
import { eventRepository } from '@/src/core/di/container';
import type { FetchEventMediaResult } from '@/src/features/events/data/repositories/EventRepository';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useCallback } from 'react';

type Params = {
  eventId: string;
  mediaId: string;
};

function albumPhotoQueryKey(eventId: string, mediaId: string) {
  return ['event', eventId, 'albumPhoto', mediaId] as const;
}

function eventAlbumQueryKey(eventId: string) {
  return ['event', eventId, 'album'] as const;
}

function applyAlbumPhotoLike(
  photo: AlbumPhoto | null | undefined,
  eventId: string,
  updated: { liked: boolean; likes_count: number },
): AlbumPhoto | null | undefined {
  if (!photo) {
    return photo;
  }
  const next = { ...photo, likes: updated.likes_count, likedByMe: updated.liked };
  setCachedEventAlbumPhoto(eventId, next);
  return next;
}

export function useEventAlbumPhotoScreen({ eventId, mediaId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const queryClient = useQueryClient();
  const photoQueryKey = albumPhotoQueryKey(eventId, mediaId);
  const photoQuery = useQuery({
    queryKey: photoQueryKey,
    queryFn: async ({ signal }) => {
      const loaded = await eventRepository.fetchEventMediaById(eventId, mediaId, { signal });
      if (loaded) {
        setCachedEventAlbumPhoto(eventId, loaded);
      }
      return loaded;
    },
    initialData: () => getCachedEventAlbumPhoto(eventId, mediaId),
  });
  const photo = photoQuery.data ?? null;
  const likeMutation = useMutation({
    mutationFn: (photoId: string) => eventRepository.postEventMediaLike(eventId, photoId),
    onSuccess: (updated, photoId) => {
      if (!updated) {
        showShortUserMessage(t('eventDetail.albumLikeError'));
        return;
      }
      queryClient.setQueryData<AlbumPhoto | null | undefined>(photoQueryKey, (current) =>
        applyAlbumPhotoLike(current, eventId, updated),
      );
      queryClient.setQueryData<InfiniteData<FetchEventMediaResult, number>>(
        eventAlbumQueryKey(eventId),
        (data) => {
          if (!data) {
            return data;
          }
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === photoId
                  ? {
                      ...item,
                      likes: updated.likes_count,
                      likedByMe: updated.liked,
                    }
                  : item,
              ),
            })),
          };
        },
      );
    },
  });
  const { mutate: likePhoto } = likeMutation;

  const onLikePress = useCallback(() => {
    if (!photo || photo.id.startsWith('local-')) {
      return;
    }
    likePhoto(photo.id);
  }, [likePhoto, photo]);

  return {
    photo,
    isLoading: photoQuery.isPending && !photo,
    goBack,
    onLikePress,
  };
}
