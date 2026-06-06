import type { QuizCreateQuestionOption } from '../../hooks/useEventChallengeQuizCreateScreen';
import { EventChallengeQuizCreateAnswerInputRow } from './EventChallengeQuizCreateAnswerInputRow';
import { StyleSheet, View } from 'react-native';

type Props = {
  answerOptions: QuizCreateQuestionOption[];
  correctOptionId: string | null;
  slotLabels: string[];
  onAnswerPress: (option: QuizCreateQuestionOption) => void;
};

export function EventChallengeQuizCreateOptionsList({
  answerOptions,
  correctOptionId,
  slotLabels,
  onAnswerPress,
}: Props) {
  return (
    <View style={styles.list}>
      {answerOptions.map((opt, index) => (
        <EventChallengeQuizCreateAnswerInputRow
          key={opt.id}
          label={slotLabels[index] ?? slotLabels[0]}
          value={opt.text}
          isCorrect={Boolean(correctOptionId === opt.id && opt.text.trim().length > 0)}
          onPress={() => onAnswerPress(opt)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 4,
  },
});
