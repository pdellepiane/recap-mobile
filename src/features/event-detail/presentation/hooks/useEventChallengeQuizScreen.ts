import { getEventChallengeQuiz } from '../../data/eventChallengeQuiz';
import {
  recordEventChallengeCompletion,
  recordGlobalChallengeCompletion,
} from '../../data/eventChallengesCompletionStore';
import { emitEventChallengesListRefresh } from '../../data/eventChallengesListRefresh';
import { emitEventDetailTabSwitch } from '../../data/eventDetailTabSwitch';
import { EventDetailTab } from './eventDetailTabs';
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
export function useEventChallengeQuizScreen({ eventId, challengeId }: Params) {
  const insets = useSafeAreaInsets();
  const { goBack } = useCoordinator();
  const quiz = useMemo(() => getEventChallengeQuiz(challengeId), [challengeId]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const canFinish = quiz !== null && selectedIndex !== null;
  const isCorrect = quiz !== null && selectedIndex !== null && selectedIndex === quiz.correctIndex;
  const selectedLabel =
    quiz !== null && selectedIndex !== null ? (quiz.options[selectedIndex] ?? '') : '';
  const correctLabel = quiz?.options[quiz.correctIndex] ?? '';
  const pointsEarned = isCorrect ? (quiz?.points ?? 0) : 0;
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
      emitEventChallengesListRefresh(eventId);
    }
    goBack();
  };

  const openRanking = () => {
    if (eventId) {
      markCompletion();
      emitEventChallengesListRefresh(eventId);
      emitEventDetailTabSwitch(eventId, EventDetailTab.Ranking);
    }
    goBack();
  };

  const toggleOption = (idx: number) => {
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  };

  const finalize = () => {
    if (!canFinish || !quiz) {
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
