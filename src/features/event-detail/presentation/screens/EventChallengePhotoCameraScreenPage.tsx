import { useEventChallengePhotoCameraScreen } from '../hooks/useEventChallengePhotoCameraScreen';
import {
  EventDetailCameraCaptureSection,
  EventDetailCameraInfoButton,
  EventDetailCameraLoadingView,
  EventDetailCameraPermissionView,
  EventDetailCameraPreviewFooter,
} from '@/src/features/event-detail/presentation/components/camera';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

export function EventChallengePhotoCameraScreenPage({
  eventId,
  challengeId,
  challengeNumber,
}: Props) {
  const { t } = useTranslation();
  const {
    cameraRef,
    permission,
    requestPermission,
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
    capturePhoto,
    toggleFlash,
    openGallery,
    discardPreview,
    submitChallengePhoto,
    showCamera,
    showPreviewSharp,
    showInfoAlert,
    showPreviewInfoAlert,
    toggleFacing,
  } = useEventChallengePhotoCameraScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  if (!permission) {
    return <EventDetailCameraLoadingView />;
  }

  if (!permission.granted) {
    return (
      <EventDetailCameraPermissionView
        bodyText={t('challenges.cameraPermissionBody')}
        allowText={t('challenges.allowCamera')}
        backText={t('challenges.permissionBack')}
        onAllow={() => void requestPermission()}
        onBack={goBack}
      />
    );
  }

  return (
    <View style={styles.root}>
      <EventDetailCameraCaptureSection
        cameraRef={cameraRef}
        showCamera={showCamera}
        showPreview={showPreviewSharp}
        selectedPhotoUri={selectedPhotoUri ?? undefined}
        facing={facing}
        flashForCamera={flashForCamera}
        flash={flash}
        cameraReady={cameraReady}
        onCameraReady={onCameraReady}
        capturing={capturing}
        headerTitle={numberLabel}
        headerRight={
          <EventDetailCameraInfoButton
            onPress={showCamera ? showInfoAlert : showPreviewInfoAlert}
            accessibilityLabel={t('common.information')}
          />
        }
        previewFooter={
          <EventDetailCameraPreviewFooter
            addPhotoLabel={t('challenges.addPhoto')}
            addPhotoText={t('challenges.addPhotoBtn')}
            uploadingText={t('challenges.uploading')}
            loading={isUploading}
            onAddPhoto={() => void submitChallengePhoto()}
          />
        }
        isUploading={isUploading}
        uploadingLabel={t('challenges.uploading')}
        eventTitle={numberLabel}
        closeLabel={t('common.close')}
        discardLabel={t('challenges.discardRetake')}
        fallbackTitle={numberLabel}
        flashOnLabel={t('common.flashOn')}
        flashOffLabel={t('common.flashOff')}
        takePictureLabel={t('common.takePicture')}
        switchCameraLabel={t('common.switchCamera')}
        openPhotoGalleryLabel={t('common.openPhotoGallery')}
        onClose={goBack}
        onDiscardPreview={discardPreview}
        onToggleFlash={toggleFlash}
        onToggleFacing={toggleFacing}
        onCapture={() => void capturePhoto(cameraRef)}
        onOpenGallery={openGallery}
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
