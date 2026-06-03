import { getEventChallengeQuiz } from '../../data/eventChallengeQuiz';
import { getEventChallenges } from '../../data/eventChallenges';
import {
  recordEventChallengeCompletion,
  recordGlobalChallengeCompletion,
} from '../../data/eventChallengesCompletionStore';
import { emitEventChallengesListRefresh } from '../../data/eventChallengesListRefresh';
import { emitEventDetailTabSwitch } from '../../data/eventDetailTabSwitch';
import { EventDetailTab } from './eventDetailTabs';
import { eventRepository } from '@/src/core/di/container';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { t } = useTranslation();
  const quiz = useMemo(() => getEventChallengeQuiz(challengeId), [challengeId]);
  const existingAnswerPoints = useMemo(() => {
    const challenge = getEventChallenges(eventId).find((row) => row.id === challengeId);
    return challenge?.remoteCompletedPoints;
  }, [eventId, challengeId]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    if (existingAnswerPoints !== undefined) {
      setPointsEarned(existingAnswerPoints);
      setShowResult(true);
    }
  }, [existingAnswerPoints]);

  const canFinish =
    existingAnswerPoints === undefined &&
    quiz !== null &&
    selectedIndex !== null &&
    !isSubmitting;
  const isCorrect =
    quiz !== null && selectedIndex !== null && pointsEarned > 0;
  const selectedLabel =
    quiz !== null && selectedIndex !== null ? (quiz.options[selectedIndex] ?? '') : '';
  const correctLabel = quiz?.options[quiz.correctIndex] ?? '';
  const resultHeaderBottomApprox = insets.top + 6 + 44;
  const resultCircleMarginTop = Math.max(0, 185 - resultHeaderBottomApprox);
  const contentTopInset = insets.top + 36;

  const markCompletion = useCallback(() => {
    recordGlobalChallengeCompletion(challengeId, pointsEarned);
    if (!eventId) {
      return;
    }
    recordEventChallengeCompletion(eventId, challengeId, pointsEarned);
  }, [challengeId, eventId, pointsEarned]);

  const closeResult = useCallback(() => {
    if (eventId) {
      markCompletion();
      emitEventChallengesListRefresh(eventId);
    }
    goBack();
  }, [eventId, goBack, markCompletion]);

  const openRanking = useCallback(() => {
    if (eventId) {
      markCompletion();
      emitEventChallengesListRefresh(eventId);
      emitEventDetailTabSwitch(eventId, EventDetailTab.Ranking);
    }
    goBack();
  }, [eventId, goBack, markCompletion]);

  const toggleOption = useCallback((idx: number) => {
    if (isSubmitting || existingAnswerPoints !== undefined) {
      return;
    }
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  }, [existingAnswerPoints, isSubmitting]);

  const finalize = useCallback(async () => {
    if (existingAnswerPoints !== undefined || !quiz || selectedIndex === null || isSubmitting) {
      return;
    }

    const optionId = quiz.optionIds[selectedIndex];
    if (optionId == null) {
      showShortUserMessage(t('quiz.submitError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await eventRepository.submitEventChallengeAnswer(eventId, challengeId, {
        event_challenge_option_id: optionId,
      });
      if (!result) {
        showShortUserMessage(t('quiz.submitError'));
        return;
      }
      setPointsEarned(result.points);
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [challengeId, eventId, existingAnswerPoints, isSubmitting, quiz, selectedIndex, t]);

  return {
    goBack,
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
  };
};
