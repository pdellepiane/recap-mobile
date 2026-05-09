import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const LIME = colors.accent[500];
const SIDE_GUTTER = 28;

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
  const hasValue = value.trim().length > 0;
  const display = hasValue ? value.trim() : label;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasValue ? styles.rowFilled : styles.rowEmpty,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={hasValue ? display : label}
      accessibilityState={{ selected: Boolean(hasValue && isCorrect) }}
    >
      <View style={styles.sideSlot} />
      <Text
        style={[styles.rowText, hasValue ? styles.rowTextFilled : styles.rowTextPlaceholder]}
        numberOfLines={2}
      >
        {display}
      </Text>
      <View style={styles.sideSlot}>
        {!hasValue ? (
          <Ionicons name="add" size={24} color={LIME} />
        ) : isCorrect ? (
          <Ionicons name="checkmark" size={22} color={colors.neutral.primary} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#323232',
    marginBottom: 10,
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
    width: SIDE_GUTTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
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
