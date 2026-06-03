import { EventChallengeQuizQuestionView } from '../components/quiz/EventChallengeQuizQuestionView';
import { EventChallengeQuizScreenFooter } from '../components/quiz/EventChallengeQuizScreenFooter';
import { EventChallengeQuizUnavailableView } from '../components/quiz/EventChallengeQuizUnavailableView';
import { EventChallengeFlowBackHeader } from '../components/shared/EventChallengeFlowBackHeader';
import { useEventChallengeQuizScreen } from '../hooks/useEventChallengeQuizScreen';
import { EventChallengeQuizCompletedScreenPage } from './EventChallengeQuizCompletedScreenPage';
import { colors } from '@/src/ui';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

export function EventChallengeQuizScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const {
    quiz,
    selectedIndex,
    showResult,
    canFinish,
    isSubmitting,
    isCorrect,
    selectedLabel,
    correctLabel,
    pointsEarned,
    resultCircleMarginTop,
    contentTopInset,
    closeResult,
    openRanking,
    toggleOption,
    finalize,
  } = useEventChallengeQuizScreen({ eventId, challengeId, challengeNumber });

  if (!quiz) {
    return <EventChallengeQuizUnavailableView contentTopInset={contentTopInset} />;
  }

  if (showResult) {
    return (
      <EventChallengeQuizCompletedScreenPage
        quizNumber={quiz.number}
        question={quiz.question}
        isCorrect={isCorrect}
        selectedLabel={selectedLabel}
        correctLabel={correctLabel}
        pointsEarned={pointsEarned}
        resultCircleMarginTop={resultCircleMarginTop}
        onClose={closeResult}
        onOpenRanking={openRanking}
      />
    );
  }

  return (
    <View style={styles.root}>
      <EventChallengeFlowBackHeader />

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <EventChallengeQuizQuestionView
          quiz={quiz}
          selectedIndex={selectedIndex}
          onToggleOption={toggleOption}
        />
      </ScrollView>

      <EventChallengeQuizScreenFooter
        canFinish={canFinish}
        loading={isSubmitting}
        onPress={() => {
          void finalize();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
