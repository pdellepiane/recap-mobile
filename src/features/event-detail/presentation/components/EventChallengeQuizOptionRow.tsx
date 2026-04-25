import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const QUIZ = {
  optionSurface: '#323232',
  borderSubtle: 'rgba(255, 255, 255, 0.22)',
  radioDim: 'rgba(255, 255, 255, 0.38)',
  radioFill: 'rgba(179, 179, 179, 1)',
} as const;

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function EventChallengeQuizOptionRow({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionRow,
        selected ? styles.optionRowSelected : styles.optionRowIdle,
        pressed && styles.pressed,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Text style={styles.optionText} numberOfLines={3}>
        {label}
      </Text>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: QUIZ.optionSurface,
  },
  optionRowIdle: {
    borderWidth: 1,
    borderColor: QUIZ.borderSubtle,
  },
  optionRowSelected: {
    borderWidth: 2,
    borderColor: colors.neutral.primary,
  },
  optionText: {
    flex: 1,
    marginRight: 12,
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: QUIZ.radioDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderWidth: 2,
    borderColor: colors.neutral.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: QUIZ.radioFill,
  },
  pressed: {
    opacity: 0.88,
  },
});
