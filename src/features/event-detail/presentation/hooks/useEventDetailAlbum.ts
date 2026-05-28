import type { AlbumPhoto } from '../../data/eventAlbum';
import { takePendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import { EventDetailTab } from './eventDetailTabs';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { showShortUserMessage } from '@/src/ui';
import { useFocusEffect } from '@react-navigation/native';
import type { TFunction } from 'i18next';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useCallback, useEffect, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  activeTab: EventDetailTab;
  activeTabRef: MutableRefObject<EventDetailTab>;
  authorName: string | undefined;
  t: TFunction;
  setActiveTab: Dispatch<SetStateAction<EventDetailTab>>;
};

/**
 * Album tab: local pending photo injection, fetch on tab focus / tab enter, pull-refresh helper.
 */
export function useEventDetailAlbum({
  eventId,
  event,
  activeTab,
  activeTabRef,
  authorName,
  t,
  setActiveTab,
}: Params) {
  const mountedRef = useMountedRef();
  const refetchGenerationRef = useRef(0);
  const likeGenerationRef = useRef(0);
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);

  useEffect(() => {
    setAlbumPhotos([]);
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
      return undefined;
    }, [eventId, authorName, t, setActiveTab]),
  );

  /**
   * When returning to this screen (e.g. after camera upload), refresh album if Album tab is active.
   */
  useFocusEffect(
    useCallback(() => {
      if (activeTabRef.current !== EventDetailTab.Album || !eventId) {
        return undefined;
      }
      const controller = beginRequest();
      void (async () => {
        try {
          const photos = await eventRepository.fetchEventMedia(eventId, {
            signal: controller.signal,
          });
          if (!controller.signal.aborted) {
            setAlbumPhotos(photos);
          }
        } catch (e) {
          if (!isAbortError(e) && !controller.signal.aborted) {
            setAlbumPhotos([]);
          }
        } finally {
          endRequest(controller);
        }
      })();
      return () => {
        abortAll();
      };
    }, [abortAll, beginRequest, endRequest, eventId, activeTabRef]),
  );

  useEffect(() => {
    if (activeTab !== EventDetailTab.Album || !event?.id) {
      return;
    }
    const id = event.id;
    const controller = beginRequest();
    void (async () => {
      try {
        const photos = await eventRepository.fetchEventMedia(id, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setAlbumPhotos(photos);
        }
      } catch (e) {
        if (!isAbortError(e) && !controller.signal.aborted) {
          setAlbumPhotos([]);
        }
      } finally {
        endRequest(controller);
      }
    })();
    return () => {
      abortAll();
    };
  }, [abortAll, activeTab, beginRequest, endRequest, event?.id]);

  const refetchAlbum = useCallback(async () => {
    const generation = ++refetchGenerationRef.current;
    const controller = beginRequest();
    try {
      const nextAlbum = await eventRepository.fetchEventMedia(eventId, {
        signal: controller.signal,
      });
      if (!mountedRef.current || generation !== refetchGenerationRef.current) {
        return;
      }
      setAlbumPhotos(nextAlbum);
    } catch (e) {
      if (!isAbortError(e) && mountedRef.current && generation === refetchGenerationRef.current) {
        setAlbumPhotos([]);
      }
    } finally {
      endRequest(controller);
    }
  }, [beginRequest, endRequest, eventId, mountedRef]);

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
          photos.map((p) =>
            p.id === photoId ? { ...p, likes: updated.likes_count, likedByMe: updated.liked } : p,
          ),
        );
      })();
    },
    [eventId, mountedRef, t],
  );

  return { albumPhotos, refetchAlbum, onAlbumPhotoLike };
}
