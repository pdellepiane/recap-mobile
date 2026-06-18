import type { AlbumPhoto } from '../../data/eventAlbum';
import { cacheEventAlbumPhotos, setCachedEventAlbumPhoto } from '../../data/eventAlbumPhotoCache';
import { takePendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import { EventDetailTab } from './eventDetailTabs';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { showShortUserMessage } from '@/src/ui';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useFocusEffect } from '@react-navigation/native';
import type { TFunction } from 'i18next';
import type { Dispatch, SetStateAction } from 'react';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const mountedRef = useMountedRef();
  const refetchGenerationRef = useRef(0);
  const loadMoreGenerationRef = useRef(0);
  const likeGenerationRef = useRef(0);
  const openedAlbumPhotoIdRef = useRef<string | null>(null);
  const albumPageRef = useRef(1);
  const albumHasMoreRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
  const [arePhotosLoaded, setArePhotosLoaded] = useState(false);
  const [albumHasMore, setAlbumHasMore] = useState(false);
  const [isLoadingMoreAlbum, setIsLoadingMoreAlbum] = useState(false);

  const applyAlbumResult = useCallback(
    (items: AlbumPhoto[], hasMore: boolean, currentPage: number, mode: 'replace' | 'append') => {
      albumPageRef.current = currentPage;
      albumHasMoreRef.current = hasMore;
      setAlbumHasMore(hasMore);
      setAlbumPhotos((current) => (mode === 'replace' ? items : mergeAlbumPhotos(current, items)));
    },
    [],
  );

  const loadAlbumPage = useCallback(
    async (
      page: number,
      mode: 'replace' | 'append',
      opts?: { signal?: AbortSignal; generation?: number; loadMoreGeneration?: number },
    ) => {
      const result = await eventRepository.fetchEventMedia(eventId, { page }, {
        signal: opts?.signal,
      });
      if (opts?.signal?.aborted) {
        return;
      }
      if (
        opts?.generation != null &&
        opts.generation !== refetchGenerationRef.current
      ) {
        return;
      }
      if (
        opts?.loadMoreGeneration != null &&
        opts.loadMoreGeneration !== loadMoreGenerationRef.current
      ) {
        return;
      }
      applyAlbumResult(result.items, result.hasMore, result.currentPage, mode);
      cacheEventAlbumPhotos(eventId, result.items);
    },
    [applyAlbumResult, eventId],
  );

  const loadInitialAlbum = useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      const generation = ++refetchGenerationRef.current;
      setArePhotosLoaded(false);
      try {
        await loadAlbumPage(1, 'replace', { signal: opts?.signal, generation });
      } catch (e) {
        if (!isAbortError(e) && !opts?.signal?.aborted && generation === refetchGenerationRef.current) {
          setAlbumPhotos([]);
          albumHasMoreRef.current = false;
          setAlbumHasMore(false);
        }
      } finally {
        if (!opts?.signal?.aborted && generation === refetchGenerationRef.current) {
          setArePhotosLoaded(true);
        }
      }
    },
    [loadAlbumPage],
  );

  useEffect(() => {
    setAlbumPhotos([]);
    setArePhotosLoaded(false);
    albumPageRef.current = 1;
    albumHasMoreRef.current = false;
    setAlbumHasMore(false);
    setIsLoadingMoreAlbum(false);
    isLoadingMoreRef.current = false;
  }, [eventId]);

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
      setAlbumPhotos((current) => [
        {
          id: `local-${eventId}-${pending.uri}`,
          uri: pending.uri,
          aspectRatio: width / height,
          authorShort: author,
          likes: 0,
        },
        ...current.filter((photo) => photo.uri !== pending.uri),
      ]);
      setActiveTab(EventDetailTab.Album);

      const controller = beginRequest();
      void loadInitialAlbum({ signal: controller.signal }).finally(() => {
        endRequest(controller);
      });
      return () => {
        abortAll();
      };
    }, [
      abortAll,
      authorName,
      beginRequest,
      endRequest,
      eventId,
      loadInitialAlbum,
      setActiveTab,
      t,
    ]),
  );

  useEffect(() => {
    if (activeTab !== EventDetailTab.Album || !event?.id) {
      return;
    }
    const controller = beginRequest();
    void loadInitialAlbum({ signal: controller.signal }).finally(() => {
      endRequest(controller);
    });
    return () => {
      abortAll();
    };
  }, [abortAll, activeTab, beginRequest, endRequest, event?.id, loadInitialAlbum]);

  const refetchAlbum = useCallback(async () => {
    const controller = beginRequest();
    try {
      await loadInitialAlbum({ signal: controller.signal });
    } finally {
      endRequest(controller);
    }
  }, [beginRequest, endRequest, loadInitialAlbum]);

  const loadMoreAlbum = useCallback(() => {
    if (!eventId || !albumHasMoreRef.current || isLoadingMoreRef.current) {
      return;
    }
    const loadMoreGeneration = ++loadMoreGenerationRef.current;
    isLoadingMoreRef.current = true;
    setIsLoadingMoreAlbum(true);
    const controller = beginRequest();
    const nextPage = albumPageRef.current + 1;
    void loadAlbumPage(nextPage, 'append', {
      signal: controller.signal,
      loadMoreGeneration,
    })
      .catch((e) => {
        if (!isAbortError(e) && loadMoreGeneration === loadMoreGenerationRef.current) {
          if (__DEV__) {
            console.error('[useEventDetailAlbum] load more failed', e);
          }
        }
      })
      .finally(() => {
        endRequest(controller);
        if (loadMoreGeneration === loadMoreGenerationRef.current) {
          isLoadingMoreRef.current = false;
          setIsLoadingMoreAlbum(false);
        }
      });
  }, [beginRequest, endRequest, eventId, loadAlbumPage]);

  const onAlbumPhotoLike = useCallback(
    (photoId: string) => {
      if (!eventId || photoId.startsWith('local-')) {
        return;
      }
      const likeId = ++likeGenerationRef.current;
      void (async () => {
        const updated = await eventRepository.postEventMediaLike(eventId, photoId);
        if (!mountedRef.current || likeId !== likeGenerationRef.current) {
          return;
        }
        if (!updated) {
          showShortUserMessage(t('eventDetail.albumLikeError'));
          return;
        }
        setAlbumPhotos((photos) =>
          photos.map((p) => {
            if (p.id !== photoId) {
              return p;
            }
            const next = { ...p, likes: updated.likes_count, likedByMe: updated.liked };
            setCachedEventAlbumPhoto(eventId, next);
            return next;
          }),
        );
      })();
    },
    [eventId, mountedRef, t],
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
      !arePhotosLoaded ||
      openedAlbumPhotoIdRef.current === mediaId
    ) {
      return;
    }
    openedAlbumPhotoIdRef.current = mediaId;
    goToEventAlbumPhotoModal(eventId, mediaId);
  }, [activeTab, arePhotosLoaded, eventId, goToEventAlbumPhotoModal, openAlbumPhotoId]);

  return {
    albumPhotos,
    arePhotosLoaded,
    albumHasMore,
    isLoadingMoreAlbum,
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
