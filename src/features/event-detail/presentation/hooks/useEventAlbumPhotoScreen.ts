import type { AlbumPhoto } from '../../data/eventAlbum';
import {
  getCachedEventAlbumPhoto,
  setCachedEventAlbumPhoto,
} from '../../data/eventAlbumPhotoCache';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useCallback, useEffect, useState } from 'react';

type Params = {
  eventId: string;
  mediaId: string;
};

export function useEventAlbumPhotoScreen({ eventId, mediaId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [photo, setPhoto] = useState<AlbumPhoto | null>(() =>
    getCachedEventAlbumPhoto(eventId, mediaId),
  );
  const [isLoading, setIsLoading] = useState(() => photo == null);

  useEffect(() => {
    const cached = getCachedEventAlbumPhoto(eventId, mediaId);
    console.log('cached', cached);
    if (cached) {
      setPhoto(cached);
      setIsLoading(false);
      return undefined;
    }

    const controller = beginRequest();
    setIsLoading(true);
    void (async () => {
      try {
        const loaded = await eventRepository.fetchEventMediaById(eventId, mediaId, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) {
          return;
        }
        if (loaded) {
          setCachedEventAlbumPhoto(eventId, loaded);
        }
        setPhoto(loaded);
      } catch (e) {
        if (!isAbortError(e) && !controller.signal.aborted) {
          setPhoto(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
        endRequest(controller);
      }
    })();

    return () => {
      abortAll();
    };
  }, [abortAll, beginRequest, endRequest, eventId, mediaId]);

  const onLikePress = useCallback(() => {
    if (!photo || photo.id.startsWith('local-')) {
      return;
    }
    void (async () => {
      const updated = await eventRepository.postEventMediaLike(eventId, photo.id);
      if (!updated) {
        showShortUserMessage(t('eventDetail.albumLikeError'));
        return;
      }
      setPhoto((current) => {
        if (!current) {
          return current;
        }
        const next = {
          ...current,
          likes: updated.likes_count,
          likedByMe: updated.liked,
        };
        setCachedEventAlbumPhoto(eventId, next);
        return next;
      });
    })();
  }, [eventId, photo, t]);

  return {
    photo,
    isLoading,
    goBack,
    onLikePress,
  };
}
