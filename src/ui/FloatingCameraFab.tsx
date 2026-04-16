import { colors } from '@/src/ui/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FloatingCameraFabProps = {
  onPress: () => void;
  /** Defaults to “Abrir cámara”. */
  accessibilityLabel?: string;
};

/**
 * Full-screen overlay (pointerEvents `box-none`) with a bottom-right camera FAB,
 * positioned using safe-area insets — reusable over scroll content on any screen.
 */
export function FloatingCameraFab({
  onPress,
  accessibilityLabel = 'Abrir cámara',
}: FloatingCameraFabProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16) + 8;

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
        <Ionicons name="camera" size={28} color={colors.background.primary} />
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
});
