import type { QuizCreateQuestionOption } from '../../hooks/useEventChallengeQuizCreateScreen';
import { EventChallengeQuizCreateOptionsList } from './EventChallengeQuizCreateOptionsList';
import { EventChallengeQuizQuestionCardFrame } from './EventChallengeQuizQuestionCardFrame';
import { StyleSheet, View } from 'react-native';

type Props = {
  kicker: string;
  question: string;
  answerOptions: QuizCreateQuestionOption[];
  correctOptionId: string | null;
  slotLabels: string[];
  onAnswerPress: (option: QuizCreateQuestionOption) => void;
};

export function EventChallengeQuizCreateBodyView({
  kicker,
  question,
  answerOptions,
  correctOptionId,
  slotLabels,
  onAnswerPress,
}: Props) {
  return (
    <View style={styles.body}>
      <EventChallengeQuizQuestionCardFrame kicker={kicker} question={question}>
        <EventChallengeQuizCreateOptionsList
          slotLabels={slotLabels}
          answerOptions={answerOptions}
          correctOptionId={correctOptionId}
          onAnswerPress={onAnswerPress}
        />
      </EventChallengeQuizQuestionCardFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {},
});
