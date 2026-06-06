import { useQuizCreateDraft } from '../context/QuizCreateDraftContext';
import { resolveEditRemoteChallengeId } from '../utils/quizCreateRouteParams';
import {
  questionHasValidAnswers,
  type QuizCreateQuestionOption,
} from './useEventChallengeQuizCreateScreen';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo, useState } from 'react';

type Params = {
  questionId: string;
  remoteChallengeId?: string;
};

/** Edit answer options + correct choice for one draft quiz question, then finish the challenge. */
export function useEventChallengeQuizCreateQuestionScreen({
  questionId,
  remoteChallengeId,
}: Params) {
  const { goBack } = useCoordinator();
  const {
    addedQuestions,
    listedQuestions,
    deleteQuestion,
    restoreConsumedQuestionSuggestion,
    setAnswerOptionText,
    setCorrectOptionId,
    submit,
    isEditMode,
    editHydrating,
    isSubmitting,
  } = useQuizCreateDraft();

  const question = useMemo(
    () =>
      listedQuestions.find((q) => q.id === questionId) ??
      addedQuestions.find((q) => q.id === questionId),
    [addedQuestions, listedQuestions, questionId],
  );

  const [editingOption, setEditingOption] = useState<QuizCreateQuestionOption | null>(null);

  const onAnswerPress = useCallback((opt: QuizCreateQuestionOption) => {
    setEditingOption(opt);
  }, []);

  const onCloseModal = useCallback(() => {
    setEditingOption(null);
  }, []);

  const onTrash = useCallback(() => {
    if (!question) {
      return;
    }
    const toRestore = question.consumedSuggestion;
    deleteQuestion(question.id);
    if (toRestore) {
      restoreConsumedQuestionSuggestion(toRestore);
    }
    goBack();
  }, [deleteQuestion, goBack, question, restoreConsumedQuestionSuggestion]);

  const canFinish = question ? questionHasValidAnswers(question) : false;

  const onFinish = useCallback(async () => {
    if (!canFinish || editHydrating || isSubmitting) {
      return;
    }
    await submit();
  }, [canFinish, editHydrating, isSubmitting, submit]);

  const onSaveAnswerEdit = useCallback(
    (text: string, isCorrect: boolean) => {
      if (!question || !editingOption) {
        return;
      }
      const oid = editingOption.id;
      setAnswerOptionText(question.id, oid, text);
      if (isCorrect) {
        setCorrectOptionId(question.id, oid);
      } else if (question.correctOptionId === oid) {
        setCorrectOptionId(question.id, null);
      }
    },
    [editingOption, question, setAnswerOptionText, setCorrectOptionId],
  );

  const modalInitialCorrect =
    editingOption != null && question != null && question.correctOptionId === editingOption.id;

  const isEditModeUi =
    isEditMode ||
    Boolean(
      resolveEditRemoteChallengeId({
        challengeId: remoteChallengeId,
        questionId,
      }),
    );

  return {
    question,
    goBack,
    editingOption,
    onAnswerPress,
    onCloseModal,
    onTrash: isEditModeUi ? undefined : onTrash,
    canFinish,
    onFinish,
    onSaveAnswerEdit,
    modalInitialCorrect,
    isEditMode: isEditModeUi,
    editHydrating,
    isSubmitting,
  };
}
