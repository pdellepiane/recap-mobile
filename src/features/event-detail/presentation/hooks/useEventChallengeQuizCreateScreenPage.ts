import { useQuizCreateDraft } from '../context/QuizCreateDraftContext';
import { resolveEditRemoteChallengeId } from '../utils/quizCreateRouteParams';
import { questionHasValidAnswers } from './useEventChallengeQuizCreateScreen';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import type { TextInput } from 'react-native';

type Params = {
  eventId: string;
};

export function useEventChallengeQuizCreateScreenPage({ eventId }: Params) {
  const { t } = useTranslation();
  const { goToEventChallengeQuizCreateQuestion, goToEventChallengeQuizEdit } = useCoordinator();
  const inputRef = useRef<TextInput>(null);
  const quizDraft = useQuizCreateDraft();

  const { composerOpen, draft, listedQuestions, canContinue, submit, isEditMode } = quizDraft;

  const onPressChallenge = useCallback(
    (questionId: string) => {
      const remoteId = resolveEditRemoteChallengeId({ questionId });
      if (remoteId) {
        goToEventChallengeQuizEdit(eventId, remoteId);
        return;
      }

      const question = listedQuestions.find((q) => q.id === questionId);
      if (!question) {
        return;
      }

      if (!questionHasValidAnswers(question)) {
        goToEventChallengeQuizCreateQuestion(eventId, questionId);
        return;
      }

      const openEditor = () => {
        goToEventChallengeQuizCreateQuestion(eventId, questionId);
      };

      const finishChallenge = () => {
        if (!canContinue) {
          showShortUserMessage(t('eventDetail.createQuizCreateInvalid'));
          return;
        }
        void submit();
      };

      if (isEditMode) {
        openEditor();
        return;
      }

      const buttons: {
        text: string;
        style?: 'cancel' | 'default' | 'destructive';
        onPress?: () => void;
      }[] = [
        { text: t('common.close'), style: 'cancel' },
        { text: t('eventDetail.createQuizEditOptions'), onPress: openEditor },
      ];
      if (canContinue) {
        buttons.push({ text: t('eventDetail.createQuizFinishChallenge'), onPress: finishChallenge });
      }

      Alert.alert(
        t('eventDetail.createQuizAddedPressTitle'),
        t('eventDetail.createQuizAddedPressMessage'),
        buttons,
      );
    },
    [
      listedQuestions,
      canContinue,
      eventId,
      goToEventChallengeQuizCreateQuestion,
      goToEventChallengeQuizEdit,
      isEditMode,
      submit,
      t,
    ],
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
