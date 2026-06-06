import { EventChallengeQuizCompletedView } from '../components/quiz/EventChallengeQuizCompletedView';
import { EventChallengeQuizUnavailableView } from '../components/quiz/EventChallengeQuizUnavailableView';
import { EventChallengeQuizView } from '../components/quiz/EventChallengeQuizView';
import { useEventChallengeQuizScreen } from '../hooks/useEventChallengeQuizScreen';
import { useTranslation } from '@/src/i18n';

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
    onCloseResult,
    onOpenRanking,
    onToggleOption,
    onFinish,
  } = useEventChallengeQuizScreen({ eventId, challengeId, challengeNumber });
  const { t } = useTranslation();

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
        onClose={onCloseResult}
        onOpenRanking={onOpenRanking}
      />
    );
  }

  return (
    <EventChallengeQuizView
      kicker={t('challenges.challengeNumberLabel', { n: quiz.number })}
      question={quiz.question}
      answerOptions={quiz.options}
      selectedIndex={selectedIndex}
      canFinish={canFinish}
      isSubmitting={isSubmitting}
      onToggleOption={onToggleOption}
      onFinish={onFinish}
    />
  );
}
