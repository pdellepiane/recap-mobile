import { useQuizCreateDraft } from '../context/QuizCreateDraftContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useRef } from 'react';
import type { TextInput } from 'react-native';

type Params = {
  eventId: string;
};

export function useEventChallengeQuizCreateScreenPage({ eventId }: Params) {
  const { goToEventChallengeQuizCreateQuestion } = useCoordinator();
  const inputRef = useRef<TextInput>(null);
  const quizDraft = useQuizCreateDraft();

  const { composerOpen, draft } = quizDraft;

  const onPressChallenge = useCallback(
    (questionId: string) => {
      goToEventChallengeQuizCreateQuestion(eventId, questionId);
    },
    [eventId, goToEventChallengeQuizCreateQuestion],
  );

  useEffect(() => {
    if (!composerOpen) {
      return;
    }
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [composerOpen]);

  const canCommitDraft = draft.trim().length > 0;

  return {
    inputRef,
    onPressChallenge,
    canCommitDraft,
    ...quizDraft,
  };
}
