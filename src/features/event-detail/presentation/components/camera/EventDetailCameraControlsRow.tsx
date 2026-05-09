import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { Pressable, Image as RNImage, StyleSheet, View } from 'react-native';

const SHUTTER_SIZE = 74;
const SHUTTER_INNER = 64;
const CONTROL_SIZE = 56;

type Props = {
  flash: 'off' | 'on' | 'auto';
  flashAvailable: boolean;
  cameraReady: boolean;
  capturing: boolean;
  flashOnLabel: string;
  flashOffLabel: string;
  takePictureLabel: string;
  switchCameraLabel: string;
  onToggleFlash: () => void;
  onToggleFacing: () => void;
  onCapture: () => void | Promise<void>;
};

export function EventDetailCameraControlsRow({
  flash,
  flashAvailable,
  cameraReady,
  capturing,
  flashOnLabel,
  flashOffLabel,
  takePictureLabel,
  switchCameraLabel,
  onToggleFlash,
  onToggleFacing,
  onCapture,
}: Props) {
  return (
    <View style={styles.cameraBottomRow} pointerEvents="box-none">
      <Pressable
        onPress={onToggleFlash}
        disabled={!flashAvailable}
        hitSlop={10}
        style={({ pressed }) => [
          styles.controlBtn,
          flash === 'on' && styles.controlBtnActive,
          !flashAvailable && styles.controlBtnDisabled,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={flash === 'on' ? flashOnLabel : flashOffLabel}
      >
        <RNImage
          source={images.common.camera.flash}
          style={[
            styles.controlIcon,
            flash === 'off' && styles.controlIconMuted,
            !flashAvailable && styles.controlIconUnavailable,
          ]}
          resizeMode="contain"
        />
      </Pressable>
      <Pressable
        onPress={() => void onCapture()}
        disabled={!cameraReady || capturing}
        hitSlop={12}
        style={({ pressed }) => [
          styles.shutterOuter,
          (!cameraReady || capturing) && styles.shutterDisabled,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={takePictureLabel}
      >
        <View style={styles.shutterInner} />
      </Pressable>
      <Pressable
        onPress={onToggleFacing}
        hitSlop={10}
        style={({ pressed }) => [styles.controlBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={switchCameraLabel}
      >
        <RNImage
          source={images.common.camera.switch}
          style={styles.controlIcon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraBottomRow: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 18,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlBtn: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: CONTROL_SIZE / 2,
    backgroundColor: colors.background.primaryOpacity5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    width: 28,
    height: 28,
  },
  controlIconMuted: {
    opacity: 0.52,
  },
  controlIconUnavailable: {
    opacity: 0.35,
  },
  controlBtnActive: {
    backgroundColor: colors.background.primaryOpacity5,
  },
  controlBtnDisabled: {
    opacity: 0.7,
  },
  shutterOuter: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE / 2,
    borderColor: colors.states.active,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  shutterInner: {
    width: SHUTTER_INNER,
    height: SHUTTER_INNER,
    borderRadius: SHUTTER_INNER / 2,
    backgroundColor: colors.states.active,
  },
  shutterDisabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
  },
});
