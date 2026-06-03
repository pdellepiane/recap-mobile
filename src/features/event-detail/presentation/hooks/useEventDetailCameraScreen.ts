import { setPendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import { showEventMediaUploadErrorAlert } from '../../data/eventMediaUploadErrorMessage';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { usePhotoCaptureFlow } from './usePhotoCaptureFlow';
import { useUploadEventPhoto } from './useUploadEventPhoto';
import { useTranslation } from '@/src/i18n';
import { showSuccessToast } from '@/src/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';

type Params = {
  eventId: string;
};

/**
 * Event album camera: permissions, capture/preview state, upload, and navigation.
 */
export function useEventDetailCameraScreen({ eventId }: Params) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoading: isEventDetailLoading } = useEventDetailRoute();
  const cameraRef = useRef<InstanceType<typeof CameraView>>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const {
    cameraReady,
    onCameraReady,
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhoto,
    toggleFlash,
    toggleFacing,
    capturePhoto,
    openGallery,
    discardPreview,
    showCamera,
    showPreview,
  } = usePhotoCaptureFlow({
    galleryPermissionTitle: t('eventDetail.galleryPermissionTitle'),
    galleryPermissionMessage: t('eventDetail.galleryPermissionMessage'),
  });

  const closeScreen = useCallback(() => {
    router.back();
  }, [router]);

  const { isUploading, uploadPhoto } = useUploadEventPhoto({
    eventId,
  });

  const handleAddPhoto = useCallback(async () => {
    if (!selectedPhoto) {
      return;
    }
    try {
      const upload = await uploadPhoto({
        fileUri: selectedPhoto.uri,
      });
      if (upload.ok) {
        setPendingEventAlbumPhoto(eventId, {
          uri: selectedPhoto.uri,
          width: selectedPhoto.width,
          height: selectedPhoto.height,
        });
        showSuccessToast(t('eventDetail.photoUploadSuccess'));
        router.back();
        return;
      }
      showEventMediaUploadErrorAlert(null, t);
    } catch (e) {
      showEventMediaUploadErrorAlert(e, t);
    }
  }, [eventId, router, selectedPhoto, t, uploadPhoto]);

  return {
    cameraRef,
    permission,
    requestPermission,
    isEventDetailLoading,
    cameraReady,
    onCameraReady,
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhoto,
    toggleFlash,
    toggleFacing,
    capturePhoto,
    openGallery,
    discardPreview,
    showCamera,
    showPreview,
    closeScreen,
    isUploading,
    handleAddPhoto,
  };
}
