import {
  scaledChallengeSize,
  useChallengeFlowScale,
} from '../../utils/challengeFlowLayout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const LIME = colors.accent[500];

type Props = {
  label: string;
  value: string;
  /** When the slot has text and is the question’s correct option. */
  isCorrect?: boolean;
  onPress: () => void;
};

/**
 * Answer slot: empty = dashed border + lime placeholder + “+”; filled = solid white
 * border + centered value; correct filled row shows a white checkmark on the right.
 */
export function EventChallengeQuizCreateAnswerInputRow({
  label,
  value,
  isCorrect = false,
  onPress,
}: Props) {
  const scale = useChallengeFlowScale();
  const layout = useMemo(
    () => ({
      minHeight: Math.max(44, scaledChallengeSize(52, scale)),
      paddingVertical: scaledChallengeSize(14, scale),
      paddingHorizontal: scaledChallengeSize(12, scale),
      marginBottom: scaledChallengeSize(10, scale),
      sideGutter: scaledChallengeSize(28, scale),
      fontSize: scaledChallengeSize(15, scale),
      lineHeight: scaledChallengeSize(22, scale),
      iconSize: scaledChallengeSize(24, scale),
      checkSize: scaledChallengeSize(22, scale),
    }),
    [scale],
  );

  const hasValue = value.trim().length > 0;
  const display = hasValue ? value.trim() : label;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          minHeight: layout.minHeight,
          paddingVertical: layout.paddingVertical,
          paddingHorizontal: layout.paddingHorizontal,
          marginBottom: layout.marginBottom,
        },
        hasValue ? styles.rowFilled : styles.rowEmpty,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={hasValue ? display : label}
      accessibilityState={{ selected: Boolean(hasValue && isCorrect) }}
    >
      <View style={[styles.sideSlot, { width: layout.sideGutter }]} />
      <Text
        style={[
          styles.rowText,
          {
            fontSize: layout.fontSize,
            lineHeight: layout.lineHeight,
          },
          hasValue ? styles.rowTextFilled : styles.rowTextPlaceholder,
        ]}
        numberOfLines={2}
      >
        {display}
      </Text>
      <View style={[styles.sideSlot, { width: layout.sideGutter }]}>
        {!hasValue ? (
          <Ionicons name="add" size={layout.iconSize} color={LIME} />
        ) : isCorrect ? (
          <Ionicons name="checkmark" size={layout.checkSize} color={colors.neutral.primary} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#323232',
  },
  rowEmpty: {
    ...Platform.select({
      ios: {
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.28)',
      },
      default: {
        borderColor: 'rgba(255, 255, 255, 0.22)',
      },
    }),
  },
  rowFilled: {
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.92)',
  },
  pressed: {
    opacity: 0.88,
  },
  sideSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  rowTextFilled: {
    color: colors.neutral.primary,
  },
  rowTextPlaceholder: {
    color: LIME,
  },
});
