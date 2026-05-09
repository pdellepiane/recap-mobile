import { EventMediaPostBody } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import { useCallback, useState } from 'react';

type Params = {
  eventId: string;
};

type UploadPhotoParams = {
  type: string;
  path: string;
  eventChallengeAnswerPhotoId?: number;
};

/**
 * Uploads event media and provides user feedback for success/failure.
 */
export function useUploadEventPhoto({ eventId }: Params) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = useCallback(
    async ({ type, path, eventChallengeAnswerPhotoId }: UploadPhotoParams): Promise<boolean> => {
      if (!eventId || !path || isUploading) {
        return false;
      }
      setIsUploading(true);
      try {
        const payload: EventMediaPostBody = {
          type,
          path,
        };
        if (eventChallengeAnswerPhotoId) {
          payload.event_challenge_answer_photo_id = eventChallengeAnswerPhotoId;
        }
        const ok = await eventRepository.uploadEventMedia(eventId, payload);
        return ok;
      } catch {
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [eventId, isUploading],
  );

  return { isUploading, uploadPhoto };
}
