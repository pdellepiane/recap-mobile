import { EventChallengeQuizCompletedView } from '../components/quiz/EventChallengeQuizCompletedView';
import { EventChallengeQuizUnavailableView } from '../components/quiz/EventChallengeQuizUnavailableView';
import { EventChallengeQuizView } from '../components/quiz/EventChallengeQuizView';
import { useEventChallengeQuizScreen } from '../hooks/useEventChallengeQuizScreen';

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
      <EventChallengeQuizCompletedView
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
    <EventChallengeQuizView
      quiz={quiz}
      selectedIndex={selectedIndex}
      canFinish={canFinish}
      isSubmitting={isSubmitting}
      onToggleOption={toggleOption}
      onFinalize={finalize}
    />
  );
}
