import { useCoordinator } from '../navigation/useCoordinator';
import { colors } from './colors';
import { images } from '@/src/assets/images';
import analytics from '@/src/core/analytics';
import type { ImageStyle } from 'react-native';
import { Image, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type BackButtonProps = {
  style?: StyleProp<ViewStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
  /** When set, called instead of the default coordinator `goBack`. */
  onPress?: () => void;
  iconStyle?: StyleProp<ImageStyle>;
};

export function BackButton({
  style,
  hitSlop = 12,
  accessibilityLabel,
  onPress: onPressProp,
  iconStyle,
}: BackButtonProps) {
  const { goBack } = useCoordinator();
  const resolvedLabel = accessibilityLabel?.trim() || 'Back';
  const onPress = () => {
    void analytics.trackAction('tap_back_button', {
      what: resolvedLabel,
      why: 'user_press',
      component: 'BackButton',
    });
    (onPressProp ?? goBack)();
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed, style]}
      onPress={onPress}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={resolvedLabel}
    >
      <Image
        source={images.common.back}
        style={[styles.backIcon, iconStyle]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonPressed: {
    opacity: 0.82,
  },
  backIcon: {
    width: 18,
    height: 30,
  },
});
