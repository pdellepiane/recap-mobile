import {
  EventDetailCameraCaptureSection,
  EventDetailCameraLoadingView,
  EventDetailCameraPermissionView,
  EventDetailCameraPreviewFooter,
} from '../components/camera';
import { useEventDetailCameraScreen } from '../hooks/useEventDetailCameraScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  eventTitle?: string;
};

export function EventDetailCameraScreenPage({ eventId, eventTitle }: Props) {
  const { t } = useTranslation();
  const {
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
  } = useEventDetailCameraScreen({ eventId });

  if (isEventDetailLoading || !permission) {
    return <EventDetailCameraLoadingView />;
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
    <View style={styles.root}>
      <EventDetailCameraCaptureSection
        cameraRef={cameraRef}
        showCamera={showCamera}
        showPreview={showPreview && !isUploading}
        selectedPhotoUri={selectedPhoto?.uri}
        isUploading={isUploading}
        uploadingLabel={t('challenges.uploading')}
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
        onOpenGallery={openGallery}
        previewFooter={
          <EventDetailCameraPreviewFooter
            addPhotoLabel={t('eventDetail.addPhotoToAlbum')}
            addPhotoText={t('challenges.addPhotoBtn')}
            uploadingText={t('challenges.uploading')}
            loading={isUploading}
            onAddPhoto={handleAddPhoto}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
