import { EventDetailTab } from '../../../../navigation/eventDetailTabs';
import type { AlbumPhoto } from '../../data/eventAlbum';
import { cacheEventAlbumPhotos, setCachedEventAlbumPhoto } from '../../data/eventAlbumPhotoCache';
import { takePendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import type { FetchEventMediaResult } from '@/src/features/events/data/repositories/EventRepository';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useFocusEffect } from '@react-navigation/native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  activeTab: EventDetailTab;
  authorName: string | undefined;
  t: TFunction;
  setActiveTab: Dispatch<SetStateAction<EventDetailTab>>;
  openAlbumPhotoId?: string;
};

function mergeAlbumPhotos(current: AlbumPhoto[], incoming: AlbumPhoto[]): AlbumPhoto[] {
  if (incoming.length === 0) {
    return current;
  }
  const seen = new Set(current.map((photo) => photo.id));
  const next = [...current];
  for (const photo of incoming) {
    if (!seen.has(photo.id)) {
      next.push(photo);
      seen.add(photo.id);
    }
  }
  return next;
}

function eventAlbumQueryKey(eventId: string) {
  return ['event', eventId, 'album'] as const;
}

function flattenAlbumPages(
  data: InfiniteData<FetchEventMediaResult, unknown> | undefined,
): AlbumPhoto[] {
  return (
    data?.pages.reduce<AlbumPhoto[]>(
      (current, page) => mergeAlbumPhotos(current, page.items),
      [],
    ) ?? []
  );
}

function applyAlbumPhotoLike(
  data: InfiniteData<FetchEventMediaResult, unknown> | undefined,
  eventId: string,
  photoId: string,
  updated: { liked: boolean; likes_count: number },
): InfiniteData<FetchEventMediaResult, unknown> | undefined {
  if (!data) {
    return data;
  }
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((photo) => {
        if (photo.id !== photoId) {
          return photo;
        }
        const next = { ...photo, likes: updated.likes_count, likedByMe: updated.liked };
        setCachedEventAlbumPhoto(eventId, next);
        return next;
      }),
    })),
  };
}

/**
 * Album tab: local pending photo injection, paginated fetch, infinite scroll, pull-refresh.
 */
export function useEventDetailAlbum({
  eventId,
  event,
  activeTab,
  authorName,
  t,
  setActiveTab,
  openAlbumPhotoId,
}: Params) {
  const { goToEventAlbumPhotoModal } = useCoordinator();
  const queryClient = useQueryClient();
  const openedAlbumPhotoIdRef = useRef<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<AlbumPhoto | null>(null);
  const [pendingPhotoSyncStartedAt, setPendingPhotoSyncStartedAt] = useState(0);
  const albumQueryKey = useMemo(() => eventAlbumQueryKey(eventId), [eventId]);
  const albumQuery = useInfiniteQuery({
    queryKey: albumQueryKey,
    queryFn: ({ pageParam, signal }) =>
      eventRepository.fetchEventMedia(eventId, { page: pageParam }, { signal }),
    initialPageParam: 1,
    enabled: activeTab === EventDetailTab.Album && Boolean(event?.id),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.currentPage + 1 : undefined),
  });
  const {
    data,
    dataUpdatedAt,
    fetchNextPage,
    hasNextPage,
    isFetched,
    isFetching,
    isFetchingNextPage,
    isPending,
    refetch,
  } = albumQuery;
  const remoteAlbumPhotos = useMemo(() => flattenAlbumPages(data), [data]);
  const albumPhotos = useMemo(() => {
    if (!pendingPhoto) {
      return remoteAlbumPhotos;
    }
    return [pendingPhoto, ...remoteAlbumPhotos.filter((photo) => photo.uri !== pendingPhoto.uri)];
  }, [pendingPhoto, remoteAlbumPhotos]);
  const likeMutation = useMutation({
    mutationFn: (photoId: string) => eventRepository.postEventMediaLike(eventId, photoId),
    onSuccess: (updated, photoId) => {
      if (!updated) {
        showShortUserMessage(t('eventDetail.albumLikeError'));
        return;
      }
      queryClient.setQueryData<InfiniteData<FetchEventMediaResult, unknown>>(
        albumQueryKey,
        (data) => applyAlbumPhotoLike(data, eventId, photoId, updated),
      );
    },
  });
  const { mutate: likePhoto } = likeMutation;

  useEffect(() => {
    setPendingPhoto(null);
    setPendingPhotoSyncStartedAt(0);
  }, [eventId]);

  useEffect(() => {
    cacheEventAlbumPhotos(eventId, remoteAlbumPhotos);
  }, [eventId, remoteAlbumPhotos]);

  useEffect(() => {
    if (
      !pendingPhoto ||
      pendingPhotoSyncStartedAt === 0 ||
      dataUpdatedAt < pendingPhotoSyncStartedAt
    ) {
      return;
    }
    setPendingPhoto(null);
    setPendingPhotoSyncStartedAt(0);
  }, [dataUpdatedAt, pendingPhoto, pendingPhotoSyncStartedAt]);

  useFocusEffect(
    useCallback(() => {
      if (!eventId) {
        return undefined;
      }
      const pending = takePendingEventAlbumPhoto(eventId);
      if (!pending?.uri) {
        return undefined;
      }
      const width = pending.width && pending.width > 0 ? pending.width : 1;
      const height = pending.height && pending.height > 0 ? pending.height : 1;
      const author = authorName?.trim() || t('eventDetail.cameraAuthorFallback');
      setPendingPhoto({
        id: `local-${eventId}-${pending.uri}`,
        uri: pending.uri,
        aspectRatio: width / height,
        authorShort: author,
        likes: 0,
      });
      setPendingPhotoSyncStartedAt(Date.now());
      setActiveTab(EventDetailTab.Album);
      void queryClient.invalidateQueries({ queryKey: albumQueryKey });
      return undefined;
    }, [albumQueryKey, authorName, eventId, queryClient, setActiveTab, t]),
  );

  const refetchAlbum = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMoreAlbum = useCallback(() => {
    if (!eventId || !hasNextPage || isFetchingNextPage || isFetching) {
      return;
    }
    void fetchNextPage();
  }, [eventId, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  const onAlbumPhotoLike = useCallback(
    (photoId: string) => {
      if (!eventId || photoId.startsWith('local-')) {
        return;
      }
      likePhoto(photoId);
    },
    [eventId, likePhoto],
  );

  const onAlbumPhotoPress = useCallback(
    (photoId: string) => {
      if (!eventId || photoId.startsWith('local-')) {
        return;
      }
      goToEventAlbumPhotoModal(eventId, photoId);
    },
    [eventId, goToEventAlbumPhotoModal],
  );

  useEffect(() => {
    openedAlbumPhotoIdRef.current = null;
  }, [eventId, openAlbumPhotoId]);

  useEffect(() => {
    const mediaId = openAlbumPhotoId?.trim();
    if (
      !mediaId ||
      activeTab !== EventDetailTab.Album ||
      (!isFetched && isPending) ||
      openedAlbumPhotoIdRef.current === mediaId
    ) {
      return;
    }
    openedAlbumPhotoIdRef.current = mediaId;
    goToEventAlbumPhotoModal(eventId, mediaId);
  }, [activeTab, eventId, goToEventAlbumPhotoModal, isFetched, isPending, openAlbumPhotoId]);

  return {
    albumPhotos,
    arePhotosLoaded: isFetched || !isPending,
    albumHasMore: Boolean(hasNextPage),
    isLoadingMoreAlbum: isFetchingNextPage,
    refetchAlbum,
    loadMoreAlbum,
    onAlbumPhotoLike,
    onAlbumPhotoPress,
    handlers: {
      onAlbumPhotoLike,
      onAlbumPhotoPress,
      onAlbumLoadMore: loadMoreAlbum,
    },
  };
}
