import { setChallengePhotoCompletionPreview } from '../../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../../data/eventChallenges';
import { usePhotoCaptureFlow } from './usePhotoCaptureFlow';
import { useUploadEventPhoto } from './useUploadEventPhoto';
import { eventRepository } from '@/src/core/di/container';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Encapsulates challenge-photo camera flow: labels, capture/gallery handlers and answer submission.
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

  const { challengeTitle, numberLabel, resolvedNumber, photoPointsFallback, isAlreadyAnswered } =
    useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber ?? 1;
    return {
      challengeTitle: challenge?.title ?? t('challenges.photoIntroDefault'),
      numberLabel: t('challenges.challengeNumberLabel', { n }),
      resolvedNumber: n,
      photoPointsFallback: challenge?.points ?? 0,
      isAlreadyAnswered: challenge?.remoteCompletedPoints !== undefined,
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
    if (!selectedPhotoUri || isAlreadyAnswered) {
      return;
    }

    const upload = await uploadPhoto({
      fileUri: selectedPhotoUri,
    });
    if (!upload.ok || !upload.path) {
      showShortUserMessage(t('challenges.answerSubmitError'));
      return;
    }

    const answer = await eventRepository.submitEventChallengeAnswer(eventId, challengeId, {
      photos: [upload.path],
    });
    if (!answer) {
      showShortUserMessage(t('challenges.answerSubmitError'));
      return;
    }

    discardPreview();
    setChallengePhotoCompletionPreview(selectedPhotoUri);
    goToEventChallengePhotoCompleted(
      eventId,
      challengeId,
      resolvedNumber,
      answer.points ?? photoPointsFallback,
    );
  }, [
    challengeId,
    discardPreview,
    eventId,
    goToEventChallengePhotoCompleted,
    isAlreadyAnswered,
    photoPointsFallback,
    resolvedNumber,
    selectedPhotoUri,
    t,
    uploadPhoto,
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
};
