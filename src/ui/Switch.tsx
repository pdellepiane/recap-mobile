import { colors } from './colors';
import { fontFamilies } from './typography';
import analytics from '@/src/core/analytics';
import {
  Switch as RNSwitch,
  StyleSheet,
  Text,
  View,
  type SwitchProps as RNSwitchProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

export type SwitchProps = RNSwitchProps & {
  /** When set, renders a row: label (left) + switch (right). */
  label?: string;
  labelStyle?: TextStyle;
  rowStyle?: ViewStyle;
};

const defaultTrack = {
  false: colors.neutral.secondary,
  true: colors.accent[700],
} as const;

/**
 * App switch with shared track/thumb defaults. Pass {@link SwitchProps.label} for a
 * labeled row (e.g. settings or quiz “correct answer”).
 */
export function Switch({
  label,
  labelStyle,
  rowStyle,
  trackColor,
  thumbColor,
  ios_backgroundColor,
  onValueChange,
  accessibilityLabel,
  ...rest
}: SwitchProps) {
  const track = {
    false: trackColor?.false ?? defaultTrack.false,
    true: trackColor?.true ?? defaultTrack.true,
  };

  const handleValueChange = (value: boolean) => {
    void analytics.trackAction('toggle_switch', {
      what: accessibilityLabel ?? label ?? 'switch',
      why: 'user_toggle',
      component: 'Switch',
      value,
    });
    onValueChange?.(value);
  };

  const control = (
    <RNSwitch
      trackColor={track}
      thumbColor={thumbColor ?? colors.neutral.primary}
      ios_backgroundColor={ios_backgroundColor ?? colors.neutral.secondary}
      onValueChange={handleValueChange}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    />
  );

  if (label == null || label === '') {
    return control;
  }

  return (
    <View style={[styles.row, rowStyle]} accessibilityRole="none">
      <Text style={[styles.label, labelStyle]} numberOfLines={2}>
        {label}
      </Text>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingRight: 12,
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
});
