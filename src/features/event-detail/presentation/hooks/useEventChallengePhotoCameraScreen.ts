import { setChallengePhotoCompletionPreview } from '../../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../../data/eventChallenges';
import { usePhotoCaptureFlow } from './usePhotoCaptureFlow';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

const UPLOAD_SIMULATION_MS = 2000;

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Encapsulates challenge-photo camera flow: labels, capture/gallery handlers and upload simulation.
 */
export function useEventChallengePhotoCameraScreen({
  eventId,
  challengeId,
  challengeNumber,
}: Params) {
  const { goBack, goToEventChallengePhotoCompleted } = useCoordinator();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
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
    const n = challenge?.number ?? challengeNumber ?? 2;
    return {
      challengeTitle: challenge?.title ?? t('challenges.photoIntroDefault'),
      numberLabel: t('challenges.challengeNumberLabel', { n }),
      resolvedNumber: n,
      photoPoints: challenge?.points ?? 10,
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

  const runUploadSimulation = useCallback(async () => {
    if (!selectedPhotoUri) {
      return;
    }
    const uri = selectedPhotoUri;
    setIsUploading(true);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, UPLOAD_SIMULATION_MS);
    });
    setIsUploading(false);
    discardPreview();
    setChallengePhotoCompletionPreview(uri);
    goToEventChallengePhotoCompleted(eventId, challengeId, resolvedNumber, photoPoints);
  }, [
    discardPreview,
    selectedPhotoUri,
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
    runUploadSimulation,
    showCamera,
    showPreviewSharp,
    showUploadingOverlay,
    showInfoAlert,
    showPreviewInfoAlert,
    toggleFacing,
  };
}
