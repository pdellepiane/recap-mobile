import { setPendingEventAlbumPhoto } from '../../data/pendingEventAlbumPhoto';
import {
  EventDetailCameraControlsRow,
  EventDetailCameraGalleryButton,
  EventDetailCameraHeader,
  EventDetailCameraPermissionView,
  EventDetailCameraPreviewFooter,
} from '../components/camera';
import { usePhotoCaptureFlow } from '../hooks/usePhotoCaptureFlow';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAMERA_RADIUS = 28;

type Props = {
  eventId: string;
  eventTitle?: string;
};

export function EventDetailCameraScreenPage({ eventId, eventTitle }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
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
    beginCapture,
    endCapture,
    toggleFlash,
    toggleFacing,
    handleCaptureResult,
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

  const handleAddPhoto = useCallback(() => {
    if (!selectedPhoto) {
      return;
    }
    setPendingEventAlbumPhoto(eventId, selectedPhoto);
    router.back();
  }, [eventId, router, selectedPhoto]);

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
        <View style={styles.cameraCard}>
          {showCamera ? (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={facing}
              flash={flashForCamera}
              mode="picture"
              active
              onCameraReady={onCameraReady}
            />
          ) : null}

          {showPreview && selectedPhoto ? (
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : null}

          <EventDetailCameraHeader
            showCamera={showCamera}
            eventTitle={eventTitle}
            onClose={closeScreen}
            onDiscardPreview={discardPreview}
            closeLabel={t('common.close')}
            discardLabel={t('challenges.discardRetake')}
            fallbackTitle={t('eventDetail.cameraTitleFallback')}
          />

          {showCamera ? (
            <EventDetailCameraControlsRow
              flash={flash}
              cameraReady={cameraReady}
              capturing={capturing}
              flashOnLabel={t('common.flashOn')}
              flashOffLabel={t('common.flashOff')}
              takePictureLabel={t('common.takePicture')}
              switchCameraLabel={t('common.switchCamera')}
              onToggleFlash={toggleFlash}
              onToggleFacing={toggleFacing}
              onCapture={async () => {
                if (!cameraRef.current || !beginCapture()) {
                  return;
                }
                try {
                  const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
                  handleCaptureResult(photo);
                } catch {
                  // no-op
                } finally {
                  endCapture();
                }
              }}
            />
          ) : null}
        </View>

        {showCamera ? (
          <EventDetailCameraGalleryButton
            openPhotoGalleryLabel={t('common.openPhotoGallery')}
            onOpenGallery={() => void openGallery()}
          />
        ) : null}

        {showPreview ? (
          <EventDetailCameraPreviewFooter
            addPhotoLabel={t('eventDetail.addPhotoToAlbum')}
            addPhotoText={t('challenges.addPhotoBtn')}
            onAddPhoto={handleAddPhoto}
          />
        ) : null}
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
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  cameraCard: {
    flex: 1,
    borderRadius: CAMERA_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
});
