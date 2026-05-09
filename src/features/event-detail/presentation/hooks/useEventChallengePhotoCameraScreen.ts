import { setChallengePhotoCompletionPreview } from '../../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../../data/eventChallenges';
import { usePhotoCaptureFlow } from './usePhotoCaptureFlow';
import { useUploadEventPhoto } from './useUploadEventPhoto';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Encapsulates challenge-photo camera flow: labels, capture/gallery handlers and album upload.
 */
export function useEventChallengePhotoCameraScreen({
  eventId,
  challengeId,
  challengeNumber,
}: Params) {
  const { goBack, goToEventChallengePhotoCompleted } = useCoordinator();
  const { t } = useTranslation();
  const { isUploading, uploadPhoto } = useUploadEventPhoto({
    eventId,
  });
  const {
    cameraReady,
    onCameraReady,
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhoto,
    beginCapture,
    endCapture,
    handleCaptureResult,
    toggleFlash,
    openGallery,
    discardPreview,
    showCamera,
    showPreview,
    toggleFacing,
  } = usePhotoCaptureFlow({
    galleryPermissionTitle: t('challenges.galleryPermissionTitle'),
    galleryPermissionMessage: t('challenges.galleryPermissionMessage'),
  });
  const selectedPhotoUri = selectedPhoto?.uri ?? null;

  const { challengeTitle, numberLabel, resolvedNumber, photoPoints } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber ?? 1;
    return {
      challengeTitle: challenge?.title ?? t('challenges.photoIntroDefault'),
      numberLabel: t('challenges.challengeNumberLabel', { n }),
      resolvedNumber: n,
      photoPoints: challenge?.points ?? 0,
    };
  }, [eventId, challengeId, challengeNumber, t]);

  const instructionParagraphs = useMemo(
    () =>
      challengeTitle
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [challengeTitle],
  );

  const submitChallengePhoto = useCallback(async () => {
    if (!selectedPhotoUri) {
      return;
    }
    const uri = selectedPhotoUri;
    const ok = await uploadPhoto({
      type: 'photo',
      path: uri,
      eventChallengeAnswerPhotoId: 0,
    });
    if (!ok) {
      return;
    }
    discardPreview();
    setChallengePhotoCompletionPreview(uri);
    goToEventChallengePhotoCompleted(eventId, challengeId, resolvedNumber, photoPoints);
  }, [
    discardPreview,
    selectedPhotoUri,
    uploadPhoto,
    goToEventChallengePhotoCompleted,
    eventId,
    challengeId,
    resolvedNumber,
    photoPoints,
  ]);

  const showPreviewSharp = showPreview && !isUploading;
  const showUploadingOverlay = Boolean(selectedPhotoUri) && isUploading;

  const showInfoAlert = useCallback(() => {
    Alert.alert(t('challenges.photoInfoTitle'), t('challenges.photoInfoCameraBody'));
  }, [t]);

  const showPreviewInfoAlert = useCallback(() => {
    Alert.alert(t('challenges.photoInfoTitle'), t('challenges.photoInfoPreviewBody'));
  }, [t]);

  return {
    goBack,
    cameraReady,
    onCameraReady,
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhotoUri,
    isUploading,
    numberLabel,
    instructionParagraphs,
    beginCapture,
    endCapture,
    handleCaptureResult,
    toggleFlash,
    openGallery,
    discardPreview,
    submitChallengePhoto,
    showCamera,
    showPreviewSharp,
    showUploadingOverlay,
    showInfoAlert,
    showPreviewInfoAlert,
    toggleFacing,
  };
}
