import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import type { RefObject } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PREVIEW_RADIUS = 24;

type EventChallengePhotoCameraStageProps = {
  bottomInset: number;
  cameraRef: RefObject<CameraView | null>;
  goBack: () => void;
  cameraReady: boolean;
  onCameraReady: () => void;
  facing: 'front' | 'back';
  flash: 'on' | 'off' | 'auto';
  flashForCamera: 'off' | 'on' | 'auto';
  capturing: boolean;
  selectedPhotoUri: string | null;
  numberLabel: string;
  instructionParagraphs: string[];
  beginCapture: () => boolean;
  endCapture: () => void;
  handleCaptureResult: (uri?: string) => void;
  toggleFlash: () => void;
  openGallery: () => Promise<void>;
  discardPreview: () => void;
  runUploadSimulation: () => Promise<void>;
  showCamera: boolean;
  showPreviewSharp: boolean;
  showUploadingOverlay: boolean;
  showInfoAlert: () => void;
  showPreviewInfoAlert: () => void;
  toggleFacing: () => void;
};

export function EventChallengePhotoCameraStage({
  bottomInset,
  cameraRef,
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
}: EventChallengePhotoCameraStageProps) {
  return (
    <View style={[styles.root, { paddingBottom: bottomInset }]}>
      <SafeAreaView edges={['top']} style={styles.topSafe}>
        <View style={styles.previewColumn}>
          <View style={styles.previewClip}>
            {showCamera ? (
              <>
                <CameraView
                  ref={cameraRef}
                  style={StyleSheet.absoluteFill}
                  facing={facing}
                  flash={flashForCamera}
                  mode="picture"
                  active
                  onCameraReady={onCameraReady}
                />

                <View style={styles.previewOverlay} pointerEvents="box-none">
                  <View style={styles.topBar} pointerEvents="box-none">
                    <Pressable
                      onPress={goBack}
                      style={({ pressed }) => [styles.topBarCircleBtn, pressed && styles.pressed]}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Cerrar"
                    >
                      <Ionicons name="close" size={26} color={colors.neutral.primary} />
                    </Pressable>
                    <Text style={styles.topTitle}>{numberLabel}</Text>
                    <Pressable
                      onPress={showInfoAlert}
                      style={({ pressed }) => [styles.topBarCircleBtn, pressed && styles.pressed]}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Información"
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color={colors.neutral.primary}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.instructionColumn} pointerEvents="none">
                    <View style={styles.instructionBlock}>
                      {instructionParagraphs.map((line, i) => (
                        <Text
                          key={`${String(i)}-${line}`}
                          style={[
                            styles.instruction,
                            i < instructionParagraphs.length - 1 && styles.instructionSpacing,
                          ]}
                        >
                          {line}
                        </Text>
                      ))}
                    </View>
                  </View>

                  <View style={styles.shutterRow} pointerEvents="box-none">
                    <Pressable
                      onPress={toggleFlash}
                      style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={flash === 'on' ? 'Apagar flash' : 'Encender flash'}
                    >
                      <Ionicons
                        name={flash === 'on' ? 'flash' : 'flash-off'}
                        size={22}
                        color={colors.neutral.primary}
                      />
                    </Pressable>
                    <Pressable
                      onPress={async () => {
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
                      disabled={!cameraReady || capturing}
                      hitSlop={12}
                      style={({ pressed }) => [
                        styles.shutterOuter,
                        (!cameraReady || capturing) && styles.shutterDisabled,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Hacer foto"
                    >
                      <View style={styles.shutterInner} />
                    </Pressable>
                    <Pressable
                      onPress={toggleFacing}
                      style={({ pressed }) => [styles.sideControl, pressed && styles.pressed]}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Cambiar cámara"
                    >
                      <Ionicons
                        name="camera-reverse-outline"
                        size={22}
                        color={colors.neutral.primary}
                      />
                    </Pressable>
                  </View>
                </View>
              </>
            ) : null}

            {showPreviewSharp && selectedPhotoUri ? (
              <>
                <Image
                  source={{ uri: selectedPhotoUri }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
                <View style={styles.previewPhotoOverlay} pointerEvents="box-none">
                  <View style={styles.topBar} pointerEvents="box-none">
                    <Pressable
                      onPress={discardPreview}
                      style={({ pressed }) => [styles.topBarCircleBtn, pressed && styles.pressed]}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Descartar y volver a la cámara"
                    >
                      <Ionicons name="close" size={26} color={colors.neutral.primary} />
                    </Pressable>
                    <Text style={styles.topTitle}>{numberLabel}</Text>
                    <Pressable
                      onPress={showPreviewInfoAlert}
                      style={({ pressed }) => [styles.topBarCircleBtn, pressed && styles.pressed]}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Información"
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={24}
                        color={colors.neutral.primary}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.previewPhotoFooter} pointerEvents="box-none">
                    <Pressable
                      onPress={() => void runUploadSimulation()}
                      style={({ pressed }) => [styles.addPhotoBtn, pressed && styles.pressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Agregar foto al evento"
                    >
                      <Text style={styles.addPhotoBtnText}>Agregar foto</Text>
                      <Ionicons name="arrow-forward" size={22} color={colors.background.primary} />
                    </Pressable>
                  </View>
                </View>
              </>
            ) : null}

            {showUploadingOverlay && selectedPhotoUri ? (
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
                  <Text style={styles.uploadLabel}>Subiendo foto…</Text>
                </View>
              </>
            ) : null}
          </View>

          {showCamera ? (
            <View style={styles.bottomBar}>
              <Pressable
                onPress={() => void openGallery()}
                style={({ pressed }) => [styles.galleryBtn, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Abrir galería de fotos"
              >
                <Ionicons name="images-outline" size={26} color={colors.neutral.primary} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topSafe: { flex: 1 },
  previewColumn: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  previewClip: {
    flex: 1,
    borderRadius: PREVIEW_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
  },
  previewOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', zIndex: 2 },
  previewPhotoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  previewPhotoFooter: { paddingHorizontal: 16, paddingBottom: 24, alignItems: 'flex-end' },
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
  instructionColumn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  topBarCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlay.blackControl72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { color: colors.neutral.primary, fontSize: 17, fontWeight: '600' },
  instructionBlock: { marginTop: -250, paddingHorizontal: 16, maxWidth: 320 },
  instruction: {
    color: colors.neutral.primary,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 30,
  },
  instructionSpacing: { marginBottom: 10 },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 28,
    paddingHorizontal: 12,
    zIndex: 4,
  },
  sideControl: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.overlay.blackControl72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.states.active },
  shutterDisabled: { opacity: 0.45 },
  bottomBar: {
    height: 64,
    marginTop: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: PREVIEW_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  galleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.overlay.gray90,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});
