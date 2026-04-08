import { getEventChallengeQuiz } from '../data/eventChallengeQuiz';
import {
  recordEventChallengeCompletion,
  recordGlobalChallengeCompletion,
} from '../data/eventChallengesCompletionStore';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Owns quiz interaction/result state and related navigation handlers.
 */
export function useEventChallengeQuizScreen({ eventId, challengeId, challengeNumber }: Params) {
  const insets = useSafeAreaInsets();
  const { goBack, goToEventDetailTabWithCompletedChallenge, goToEventChallengesCompleted } =
    useCoordinator();
  const quiz = useMemo(
    () => getEventChallengeQuiz(challengeId, challengeNumber),
    [challengeId, challengeNumber],
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const canFinish = selectedIndex !== null;
  const isCorrect = selectedIndex !== null && selectedIndex === quiz.correctIndex;
  const selectedLabel = selectedIndex !== null ? (quiz.options[selectedIndex] ?? '') : '';
  const correctLabel = quiz.options[quiz.correctIndex] ?? '';
  const pointsEarned = isCorrect ? quiz.points : 0;
  const resultHeaderBottomApprox = insets.top + 6 + 44;
  const resultCircleMarginTop = Math.max(0, 185 - resultHeaderBottomApprox);
  const contentTopInset = insets.top + 36;

  const markCompletion = () => {
    recordGlobalChallengeCompletion(challengeId, pointsEarned);
    if (!eventId) {
      return;
    }
    recordEventChallengeCompletion(eventId, challengeId, pointsEarned);
  };

  const closeResult = () => {
    if (eventId) {
      markCompletion();
      goToEventChallengesCompleted(eventId, challengeId, pointsEarned);
      return;
    }
    goBack();
  };

  const openRanking = () => {
    if (eventId) {
      markCompletion();
      goToEventDetailTabWithCompletedChallenge(eventId, 'ranking', challengeId, pointsEarned);
      return;
    }
    goBack();
  };

  const toggleOption = (idx: number) => {
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  };

  const finalize = () => {
    if (!canFinish) {
      return;
    }
    setShowResult(true);
  };

  return {
    goBack,
    quiz,
    selectedIndex,
    showResult,
    canFinish,
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
  };
}
