import { EventDetailCameraControlsRow } from './EventDetailCameraControlsRow';
import { EventDetailCameraGalleryButton } from './EventDetailCameraGalleryButton';
import { EventDetailCameraHeader } from './EventDetailCameraHeader';
import { EventDetailCameraUploadOverlay } from './EventDetailCameraUploadOverlay';
import { colors } from '@/src/ui';
import { CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import type { ReactNode, RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAMERA_RADIUS = 28;

type Props = {
  cameraRef: RefObject<InstanceType<typeof CameraView> | null>;
  showCamera: boolean;
  showPreview: boolean;
  selectedPhotoUri?: string;
  facing: 'front' | 'back';
  flashForCamera: 'off' | 'on' | 'auto';
  flash: 'off' | 'on' | 'auto';
  cameraReady: boolean;
  capturing: boolean;
  eventTitle?: string;
  headerTitle?: string;
  /** Optional right-side content in the header row (e.g. info button). */
  headerRight?: ReactNode;
  /** Optional overlay rendered over live camera mode (e.g. instructions). */
  cameraOverlay?: ReactNode;
  /** Optional content rendered over preview mode. */
  previewOverlay?: ReactNode;
  /** Optional preview footer pinned to bottom-right inside camera card. */
  previewFooter?: ReactNode;
  /** When true and `selectedPhotoUri` is set, shows the default upload scrim (unless `stageOverlay` is passed). */
  isUploading?: boolean;
  uploadingLabel?: string;
  /** Optional full-card overlay rendered last instead of the default upload overlay. */
  stageOverlay?: ReactNode;
  closeLabel: string;
  discardLabel: string;
  fallbackTitle: string;
  flashOnLabel: string;
  flashOffLabel: string;
  takePictureLabel: string;
  switchCameraLabel: string;
  openPhotoGalleryLabel: string;
  onCameraReady: () => void;
  onClose: () => void;
  onDiscardPreview: () => void;
  onToggleFlash: () => void;
  onToggleFacing: () => void;
  onCapture: () => void;
  onOpenGallery: () => void;
};

export function EventDetailCameraCaptureSection({
  cameraRef,
  showCamera,
  showPreview,
  selectedPhotoUri,
  facing,
  flashForCamera,
  flash,
  cameraReady,
  capturing,
  eventTitle,
  headerTitle,
  headerRight,
  cameraOverlay,
  previewOverlay,
  previewFooter,
  isUploading = false,
  uploadingLabel,
  stageOverlay,
  closeLabel,
  discardLabel,
  fallbackTitle,
  flashOnLabel,
  flashOffLabel,
  takePictureLabel,
  switchCameraLabel,
  openPhotoGalleryLabel,
  onCameraReady,
  onClose,
  onDiscardPreview,
  onToggleFlash,
  onToggleFacing,
  onCapture,
  onOpenGallery,
}: Props) {
  const resolvedStageOverlay =
    stageOverlay ??
    (isUploading && selectedPhotoUri && uploadingLabel ? (
      <EventDetailCameraUploadOverlay
        photoUri={selectedPhotoUri}
        uploadingLabel={uploadingLabel}
      />
    ) : null);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.cameraCard}>
        {showCamera && (
          <CameraView
            ref={cameraRef}
            style={styles.cameraFrame}
            facing={facing}
            flash={flashForCamera}
            enableTorch={facing === 'back' && flash === 'on'}
            mode="picture"
            active
            onCameraReady={onCameraReady}
          />
        )}

        {showPreview && selectedPhotoUri ? (
          <Image source={{ uri: selectedPhotoUri }} style={styles.cameraFrame} contentFit="cover" />
        ) : null}

        <EventDetailCameraHeader
          showCamera={showCamera}
          eventTitle={headerTitle ?? eventTitle}
          onClose={onClose}
          onDiscardPreview={onDiscardPreview}
          closeLabel={closeLabel}
          discardLabel={discardLabel}
          fallbackTitle={fallbackTitle}
        />
        {headerRight ? <View style={styles.headerRightSlot}>{headerRight}</View> : null}

        {showCamera && cameraOverlay ? (
          <View style={styles.cameraOverlaySlot} pointerEvents="box-none">
            {cameraOverlay}
          </View>
        ) : null}

        {showPreview && previewOverlay ? (
          <View style={styles.previewOverlaySlot} pointerEvents="box-none">
            {previewOverlay}
          </View>
        ) : null}

        {showPreview && previewFooter ? (
          <View style={styles.previewFooterSlot} pointerEvents="box-none">
            {previewFooter}
          </View>
        ) : null}

        {showCamera && (
          <EventDetailCameraControlsRow
            flash={flash}
            flashAvailable={facing === 'back'}
            cameraReady={cameraReady}
            capturing={capturing}
            flashOnLabel={flashOnLabel}
            flashOffLabel={flashOffLabel}
            takePictureLabel={takePictureLabel}
            switchCameraLabel={switchCameraLabel}
            onToggleFlash={onToggleFlash}
            onToggleFacing={onToggleFacing}
            onCapture={onCapture}
          />
        )}

        {resolvedStageOverlay ? (
          <View style={styles.stageOverlaySlot} pointerEvents="box-none">
            {resolvedStageOverlay}
          </View>
        ) : null}
      </View>

      {showCamera && (
        <EventDetailCameraGalleryButton
          openPhotoGalleryLabel={openPhotoGalleryLabel}
          onOpenGallery={onOpenGallery}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  cameraCard: {
    flex: 1,
    borderRadius: CAMERA_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  cameraFrame: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRightSlot: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 4,
  },
  cameraOverlaySlot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  previewOverlaySlot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  previewFooterSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    zIndex: 4,
    alignItems: 'flex-end',
    paddingHorizontal: 18,
  },
  stageOverlaySlot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
});
