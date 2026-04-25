import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  leading: ReactNode;
  label: string;
};

export function EventChallengeQuizResultFeedbackRow({ leading, label }: Props) {
  return (
    <View style={[styles.resultAnswerRow, styles.resultAnswerRowFeedback]}>
      {leading}
      <Text style={[styles.resultAnswerText, styles.resultAnswerTextFlex]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultAnswerRow: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: colors.neutral.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultAnswerRowFeedback: { justifyContent: 'flex-start', paddingHorizontal: 16 },
  resultAnswerText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  resultAnswerTextFlex: { flex: 1, flexShrink: 1 },
});
