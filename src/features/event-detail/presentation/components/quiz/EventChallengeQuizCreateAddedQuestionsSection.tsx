import type { QuizCreateAddedQuestion } from '../../hooks/useEventChallengeQuizCreateScreen';
import {
  resolveQuizCreateQuestionPosition,
} from '../../hooks/useEventChallengeQuizCreateScreen';
import { EventChallengeQuizCreateAddedQuestionCard } from './EventChallengeQuizCreateAddedQuestionCard';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  questions: QuizCreateAddedQuestion[];
  onPressChallenge: (questionId: string) => void;
};

export function EventChallengeQuizCreateAddedQuestionsSection({
  questions,
  onPressChallenge,
}: Props) {
  const { t } = useTranslation();

  if (questions.length === 0) {
    return null;
  }

  return (
    <View style={styles.addedBlock}>
      <Text style={styles.sectionHeading}>{t('eventDetail.createQuizAddedHeading')}</Text>
      {questions.map((q) => (
        <EventChallengeQuizCreateAddedQuestionCard
          key={q.id}
          question={q}
          position={resolveQuizCreateQuestionPosition(q, questions)}
          onPress={onPressChallenge}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  addedBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    color: colors.neutral.lightest,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    marginBottom: 12,
  },
});
