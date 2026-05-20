import { colors } from './colors';
import { fontFamilies } from './typography';
import analytics from '@/src/core/analytics';
import type { ReactNode, Ref } from 'react';
import type { Insets } from 'react-native';
import {
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  Image as RNImage,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type BaseButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'accent' | 'active' | 'ghost' | 'brand';
  size?: 'sm' | 'md';
  accessibilityLabel?: string;
  rightIconSource?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  /** Ref on an inner wrapper `View` (e.g. for `measureInWindow`). Implies `collapsable={false}` on that view. */
  contentRef?: Ref<View>;
  contentWrapperStyle?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets;
};

export type ButtonProps = BaseButtonProps &
  (
    | { title: string; children?: undefined }
    | { title?: string; children: ReactNode; accessibilityLabel: string }
  );

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  style,
  textStyle,
  variant = 'accent',
  size = 'md',
  accessibilityLabel,
  rightIconSource,
  rightIconStyle,
  children,
  contentRef,
  contentWrapperStyle,
  hitSlop,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const hasChildren = children != null;
  const resolvedTitle = hasChildren ? (title ?? '') : (title as string);
  const displayText = loading && loadingText ? loadingText : resolvedTitle;
  const normalizedA11yLabel = accessibilityLabel?.trim();
  const normalizedDisplayText = displayText?.trim();
  const a11yLabel = normalizedA11yLabel ?? (!hasChildren ? normalizedDisplayText : undefined);
  const trackedLabel = a11yLabel ?? normalizedDisplayText ?? 'unlabeled_button';
  const labelSource = a11yLabel
    ? normalizedA11yLabel
      ? 'accessibility_label'
      : 'title'
    : 'fallback';

  const handlePress = () => {
    void analytics.trackAction('tap_button', {
      what: trackedLabel,
      why: 'user_press',
      component: 'Button',
      variant,
      size,
      disabled: isDisabled,
      has_accessibility_label: Boolean(a11yLabel),
      label_source: labelSource,
    });
    onPress();
  };

  return (
    <Pressable
      hitSlop={hitSlop}
      style={({ pressed }) => [
        !hasChildren && styles.button,
        !hasChildren && size === 'sm' && styles.buttonSmall,
        !hasChildren && variant === 'active' && styles.buttonActive,
        !hasChildren && variant === 'ghost' && styles.buttonGhost,
        !hasChildren && variant === 'brand' && styles.buttonBrand,
        hasChildren && styles.customRoot,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      {hasChildren ? (
        contentRef != null ? (
          <View
            ref={contentRef}
            collapsable={false}
            style={[styles.contentFill, contentWrapperStyle]}
          >
            {children}
          </View>
        ) : (
          children
        )
      ) : (
        <View style={styles.contentRow}>
          <Text
            style={[
              styles.buttonText,
              variant === 'active' && styles.buttonTextActive,
              variant === 'ghost' && styles.buttonTextGhost,
              variant === 'brand' && styles.buttonTextBrand,
              textStyle,
            ]}
          >
            {displayText}
          </Text>
          {rightIconSource ? (
            <RNImage
              source={rightIconSource}
              style={[styles.rightIcon, rightIconStyle]}
              resizeMode="contain"
            />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  customRoot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentFill: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.accent[500],
    borderRadius: 16,
    paddingVertical: 16,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonSmall: {
    height: 52,
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonActive: {
    backgroundColor: colors.states.active,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    height: undefined,
    paddingVertical: 12,
  },
  buttonBrand: {
    backgroundColor: colors.brand[500],
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.background.primary,
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    lineHeight: 18,
  },
  buttonTextActive: {
    color: colors.background.primary,
  },
  buttonTextGhost: {
    color: colors.neutral.tertiary,
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonTextBrand: {
    color: colors.neutral.primary,
  },
  rightIcon: {
    width: 15,
    height: 15,
  },
});
