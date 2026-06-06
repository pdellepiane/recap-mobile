import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui/colors';
import { Image as RNImage, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FloatingCameraFabProps = {
  onPress: () => void;
  /** Defaults to {@link common.openCamera}. */
  accessibilityLabel?: string;
  /** When false, the parent screen already applied bottom safe area. */
  respectBottomSafeArea?: boolean;
};

/**
 * Full-screen overlay (pointerEvents `box-none`) with a bottom-right camera FAB,
 * positioned using safe-area insets — reusable over scroll content on any screen.
 */
export function FloatingCameraFab({
  onPress,
  accessibilityLabel: accessibilityLabelProp,
  respectBottomSafeArea = true,
}: FloatingCameraFabProps) {
  const { t } = useTranslation();
  const accessibilityLabel = accessibilityLabelProp ?? t('common.openCamera');
  const insets = useSafeAreaInsets();
  const bottom = respectBottomSafeArea ? Math.max(insets.bottom, 16) + 8 : 24;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[styles.fab, { bottom }]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
      >
        <RNImage source={images.common.camera.icon} style={styles.fabIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 300,
    elevation: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.states.active,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    elevation: 25,
    shadowColor: colors.background.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabIcon: {
    width: 20,
    height: 20,
  },
});
