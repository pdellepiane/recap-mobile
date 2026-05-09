import { useEventChallengePhotoCameraScreen } from '../hooks/useEventChallengePhotoCameraScreen';
import { images } from '@/src/assets/images';
import { EventDetailCameraCaptureSection } from '@/src/features/event-detail/presentation/components/camera';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo-challenge camera: capture with controls (flash, shutter, selfie, system gallery),
 * then sharp preview with “Add photo” per design, and upload to the event album.
 */
export function EventChallengePhotoCameraScreenPage({
  eventId,
  challengeId,
  challengeNumber,
}: Props) {
  const { t } = useTranslation();
  const cameraRef = useRef<InstanceType<typeof CameraView>>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const {
    goBack,
    cameraReady,
    onCameraReady,
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhotoUri,
    numberLabel,
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
  } = useEventChallengePhotoCameraScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  if (!permission) {
    return (
      <View style={[styles.root, styles.centered]}>
        <ActivityIndicator color={colors.neutral.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.permissionBody}>
          <Text style={styles.permissionText}>{t('challenges.cameraPermissionBody')}</Text>
          <Button
            title={t('challenges.allowCamera')}
            onPress={() => void requestPermission()}
            variant="active"
            accessibilityLabel={t('challenges.allowCamera')}
            style={styles.permissionBtn}
            textStyle={styles.permissionBtnLabel}
          />
          <Pressable onPress={goBack} style={styles.permissionSecondary}>
            <Text style={styles.permissionSecondaryLabel}>{t('challenges.permissionBack')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
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
          <Pressable
            onPress={showCamera ? showInfoAlert : showPreviewInfoAlert}
            style={({ pressed }) => [pressed && styles.pressed]}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t('common.information')}
          >
            <Image source={images.common.info} style={styles.infoIcon} resizeMode="contain" />
          </Pressable>
        }
        previewFooter={
          <Pressable
            onPress={() => void submitChallengePhoto()}
            style={({ pressed }) => [styles.addPhotoBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={t('challenges.addPhoto')}
          >
            <Text style={styles.addPhotoBtnText}>{t('challenges.addPhotoBtn')}</Text>
            <Ionicons name="arrow-forward" size={22} color={colors.background.primary} />
          </Pressable>
        }
        stageOverlay={
          showUploadingOverlay && selectedPhotoUri ? (
            <>
              <Image
                source={{ uri: selectedPhotoUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                blurRadius={Platform.OS === 'android' ? 18 : 35}
                accessibilityIgnoresInvertColors
              />
              <View style={styles.uploadScrim} />
              <View style={styles.uploadCenter} pointerEvents="none">
                <ActivityIndicator size="large" color={colors.states.active} />
                <Text style={styles.uploadLabel}>{t('challenges.uploading')}</Text>
              </View>
            </>
          ) : null
        }
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
        onCapture={async () => {
          if (!cameraRef.current || !beginCapture()) {
            return;
          }
          try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
            handleCaptureResult(photo?.uri);
          } catch {
            // no-op
          } finally {
            endCapture();
          }
        }}
        onOpenGallery={() => void openGallery()}
      />
      {Platform.OS === 'web' ? (
        <View style={styles.webNote} pointerEvents="none">
          <Text style={styles.webNoteText}>{t('challenges.webCameraLimited')}</Text>
        </View>
      ) : null}
    </View>
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
  permissionBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  permissionText: {
    color: colors.neutral.primary,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionBtn: {
    height: undefined,
    minHeight: 48,
    backgroundColor: colors.states.active,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionBtnLabel: {
    color: colors.background.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  permissionSecondary: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  permissionSecondaryLabel: {
    color: colors.neutral.tertiary,
    fontSize: 16,
  },
  infoIcon: {
    width: 27,
    height: 27,
    tintColor: colors.neutral.primary,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.states.active,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    minWidth: 200,
  },
  addPhotoBtnText: { color: colors.background.primary, fontSize: 17, fontWeight: '700' },
  pressed: { opacity: 0.85 },
  uploadScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.black35,
    zIndex: 3,
  },
  uploadCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    gap: 14,
  },
  uploadLabel: { color: colors.neutral.primary, fontSize: 17, fontWeight: '600' },
  webNote: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  webNoteText: {
    color: colors.overlay.white55,
    fontSize: 12,
    textAlign: 'center',
  },
});
