import { useQuizCreateDraft } from '../context/QuizCreateDraftContext';
import {
  questionHasValidAnswers,
  type QuizCreateQuestionOption,
} from './useEventChallengeQuizCreateScreen';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo, useState } from 'react';

type Params = {
  questionId: string;
};

/** Edit answer options + correct choice for one draft quiz question, then finish the challenge. */
export function useEventChallengeQuizCreateQuestionScreen({ questionId }: Params) {
  const { goBack } = useCoordinator();
  const {
    addedQuestions,
    deleteQuestion,
    restoreConsumedQuestionSuggestion,
    setAnswerOptionText,
    setCorrectOptionId,
    submit,
  } = useQuizCreateDraft();

  const question = useMemo(
    () => addedQuestions.find((q) => q.id === questionId),
    [addedQuestions, questionId],
  );

  const [editingOption, setEditingOption] = useState<QuizCreateQuestionOption | null>(null);

  const openSlot = useCallback((opt: QuizCreateQuestionOption) => {
    setEditingOption(opt);
  }, []);

  const closeModal = useCallback(() => {
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
    if (!canFinish) {
      return;
    }
    await submit();
  }, [canFinish, submit]);

  const saveAnswerEdit = useCallback(
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

  return {
    question,
    goBack,
    editingOption,
    openSlot,
    closeModal,
    onTrash,
    canFinish,
    onFinish,
    saveAnswerEdit,
    modalInitialCorrect,
  };
}
