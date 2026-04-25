import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { EventChallengeQuizResultFeedbackRow } from './EventChallengeQuizResultFeedbackRow';

type Props = {
  question: string;
  selectedLabel: string;
};

export function EventChallengeQuizResultCorrectCard({ question, selectedLabel }: Props) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultQuestion}>{question}</Text>
      <EventChallengeQuizResultFeedbackRow
        leading={<Ionicons name="checkmark" size={24} color={colors.states.active} />}
        label={selectedLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 18,
  },
  resultQuestion: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
});
