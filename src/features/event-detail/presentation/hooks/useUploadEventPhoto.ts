import { eventRepository } from '@/src/core/di/container';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { useCallback, useRef, useState } from 'react';

type Params = {
  eventId: string;
};

type UploadPhotoParams = {
  fileUri: string;
  mimeType?: string;
  fileName?: string;
  eventChallengeAnswerPhotoId?: number;
};

export type UploadEventPhotoResult = {
  ok: boolean;
  path?: string;
};

/**
 * Uploads event media (multipart/form-data) and provides upload state.
 */
export function useUploadEventPhoto({ eventId }: Params) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadingRef = useRef(false);
  const mountedRef = useMountedRef();

  const uploadPhoto = useCallback(
    async ({
      fileUri,
      mimeType,
      fileName,
      eventChallengeAnswerPhotoId,
    }: UploadPhotoParams): Promise<UploadEventPhotoResult> => {
      if (!eventId || !fileUri.trim() || uploadingRef.current) {
        return { ok: false };
      }
      uploadingRef.current = true;
      setIsUploading(true);
      try {
        return await eventRepository.uploadEventMedia(eventId, {
          fileUri,
          mimeType,
          fileName,
          event_challenge_answer_photo_id: eventChallengeAnswerPhotoId,
        });
      } finally {
        uploadingRef.current = false;
        if (mountedRef.current) {
          setIsUploading(false);
        }
      }
    },
    [eventId, mountedRef],
  );

  return { isUploading, uploadPhoto };
}
