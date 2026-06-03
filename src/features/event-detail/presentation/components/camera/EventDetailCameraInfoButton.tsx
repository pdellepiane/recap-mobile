import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { Image, Pressable, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
};

export function EventDetailCameraInfoButton({ onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Image source={images.common.info} style={styles.icon} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 27,
    height: 27,
    tintColor: colors.neutral.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
