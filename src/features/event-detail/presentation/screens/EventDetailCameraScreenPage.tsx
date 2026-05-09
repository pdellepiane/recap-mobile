import {
  EventDetailCameraCaptureSection,
  EventDetailCameraPermissionView,
  EventDetailCameraPreviewFooter,
} from '../components/camera';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { usePhotoCaptureFlow } from '../hooks/usePhotoCaptureFlow';
import { useUploadEventPhoto } from '../hooks/useUploadEventPhoto';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
  eventTitle?: string;
};

export function EventDetailCameraScreenPage({ eventId, eventTitle }: Props) {
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
    const ok = await uploadPhoto({
      type: 'photo',
      path: selectedPhoto.uri,
      eventChallengeAnswerPhotoId: 0,
    });
    if (ok) {
      router.back();
    }
  }, [router, selectedPhoto, uploadPhoto]);

  if (isEventDetailLoading) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={colors.neutral.primary} />
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={colors.neutral.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <EventDetailCameraPermissionView
        bodyText={t('eventDetail.cameraPermissionBody')}
        allowText={t('challenges.allowCamera')}
        backText={t('challenges.permissionBack')}
        onAllow={() => void requestPermission()}
        onBack={closeScreen}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.shell}>
        <EventDetailCameraCaptureSection
          cameraRef={cameraRef}
          showCamera={showCamera}
          showPreview={showPreview}
          selectedPhotoUri={selectedPhoto?.uri}
          facing={facing}
          flashForCamera={flashForCamera}
          flash={flash}
          cameraReady={cameraReady}
          capturing={capturing}
          eventTitle={eventTitle}
          closeLabel={t('common.close')}
          discardLabel={t('challenges.discardRetake')}
          fallbackTitle={t('eventDetail.cameraTitleFallback')}
          flashOnLabel={t('common.flashOn')}
          flashOffLabel={t('common.flashOff')}
          takePictureLabel={t('common.takePicture')}
          switchCameraLabel={t('common.switchCamera')}
          openPhotoGalleryLabel={t('common.openPhotoGallery')}
          onCameraReady={onCameraReady}
          onClose={closeScreen}
          onDiscardPreview={discardPreview}
          onToggleFlash={toggleFlash}
          onToggleFacing={toggleFacing}
          onCapture={() => void capturePhoto(cameraRef)}
          onOpenGallery={() => void openGallery()}
        />

        {showPreview && (
          <EventDetailCameraPreviewFooter
            addPhotoLabel={t('eventDetail.addPhotoToAlbum')}
            addPhotoText={t('challenges.addPhotoBtn')}
            uploadingText={t('challenges.uploading')}
            loading={isUploading}
            onAddPhoto={() => void handleAddPhoto()}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shell: {
    flex: 1,
  },
});
