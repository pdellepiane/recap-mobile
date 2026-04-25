import { EventChallengePhotoCameraStage } from '../components/EventChallengePhotoCameraStage';
import { useEventChallengePhotoCameraScreen } from '../hooks/useEventChallengePhotoCameraScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_BG = colors.background.primary;
const ACCENT_LIME = colors.states.active;

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo-challenge camera: capture with controls (flash, shutter, selfie, system gallery),
 * then sharp preview with “Add photo” per design, and simulated upload.
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
          <Pressable onPress={() => void requestPermission()} style={styles.permissionBtn}>
            <Text style={styles.permissionBtnLabel}>{t('challenges.allowCamera')}</Text>
          </Pressable>
          <Pressable onPress={goBack} style={styles.permissionSecondary}>
            <Text style={styles.permissionSecondaryLabel}>{t('challenges.permissionBack')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <EventChallengePhotoCameraStage
        bottomInset={0}
        cameraRef={cameraRef}
        goBack={goBack}
        cameraReady={cameraReady}
        onCameraReady={onCameraReady}
        facing={facing}
        flash={flash}
        flashForCamera={flashForCamera}
        capturing={capturing}
        selectedPhotoUri={selectedPhotoUri}
        numberLabel={numberLabel}
        instructionParagraphs={instructionParagraphs}
        beginCapture={beginCapture}
        endCapture={endCapture}
        handleCaptureResult={handleCaptureResult}
        toggleFlash={toggleFlash}
        openGallery={openGallery}
        discardPreview={discardPreview}
        runUploadSimulation={runUploadSimulation}
        showCamera={showCamera}
        showPreviewSharp={showPreviewSharp}
        showUploadingOverlay={showUploadingOverlay}
        showInfoAlert={showInfoAlert}
        showPreviewInfoAlert={showPreviewInfoAlert}
        toggleFacing={toggleFacing}
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
    backgroundColor: SCREEN_BG,
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
    backgroundColor: ACCENT_LIME,
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
