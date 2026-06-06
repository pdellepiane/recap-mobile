import { colors } from './colors';
import { images } from '@/src/assets/images';
import analytics from '@/src/core/analytics';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet } from 'react-native';

type CloseButtonProps = {
  onPress: () => void;
  /** Localized label (e.g. `t('common.close')` or discard copy when the X means discard). */
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  hitSlop?: number;
};

/**
 * Circular / sheet-style close control using the shared camera close asset.
 * Pass layout and chrome (size, position, background) via `style`.
 */
export function CloseButton({
  onPress,
  accessibilityLabel,
  style,
  iconStyle,
  hitSlop,
}: CloseButtonProps) {
  const handlePress = () => {
    void analytics.trackAction('tap_close_button', {
      what: accessibilityLabel,
      why: 'user_press',
      component: 'CloseButton',
    });
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={hitSlop}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={images.common.camera.close}
        style={[styles.icon, iconStyle]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
  },
  pressed: {
    opacity: 0.88,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
