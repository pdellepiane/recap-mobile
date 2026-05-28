import { EventChallengePostBody } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import {
  normalizeChallengePromptText,
  usedChallengePromptKeySet,
} from '@/src/features/events/data/eventChallengesMap';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Params = {
  eventId: string;
};

const OPTION_SLOTS = 4;

/** Single answer option (host fills text in editor; `id` is stable per slot). */
export type QuizCreateQuestionOption = {
  id: string;
  text: string;
};

/**
 * One quiz question kept in memory until the flow ends (then sent with options + correct id).
 */
export type QuizCreateAddedQuestion = {
  id: string;
  text: string;
  answerOptions: QuizCreateQuestionOption[];
  correctOptionId: string | null;
  consumedSuggestion?: QuizCreateQuestionSuggestion;
};

export type QuizCreateQuestionSuggestion = {
  id: string;
  question: string;
};

function newQuestionId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyOptionsForQuestion(questionId: string): QuizCreateQuestionOption[] {
  return Array.from({ length: OPTION_SLOTS }, (_, i) => ({
    id: `${questionId}-opt-${i}`,
    text: '',
  }));
}

/** Non-empty answer slots (for host UI summaries). */
export function countFilledAnswerOptions(q: QuizCreateAddedQuestion): number {
  return q.answerOptions.filter((o) => o.text.trim().length > 0).length;
}

export function questionHasValidAnswers(q: QuizCreateAddedQuestion): boolean {
  const nonEmpty = q.answerOptions.filter((o) => o.text.trim().length > 0);
  if (nonEmpty.length < 2) {
    return false;
  }
  if (!q.correctOptionId) {
    return false;
  }
  const correct = q.answerOptions.find((o) => o.id === q.correctOptionId);
  return Boolean(correct?.text.trim().length);
}

function buildQuestion(
  text: string,
  consumedSuggestion?: QuizCreateQuestionSuggestion,
): QuizCreateAddedQuestion {
  const id = newQuestionId();
  return {
    id,
    text,
    answerOptions: emptyOptionsForQuestion(id),
    correctOptionId: null,
    ...(consumedSuggestion ? { consumedSuggestion } : {}),
  };
}

function buildQuizChallengeBody(
  q: QuizCreateAddedQuestion,
  position: number,
): EventChallengePostBody | null {
  if (!questionHasValidAnswers(q)) {
    return null;
  }
  const sourceOptions = q.answerOptions
    .map((opt, index) => ({
      id: opt.id,
      option: opt.text.trim(),
      /** API: each option `position` must be ≥ 1 (1-based order). */
      position: index + 1,
      points: 0,
    }))
    .filter((opt) => opt.option.length > 0)
    .slice(0, 4);
  if (sourceOptions.length < 2) {
    return null;
  }
  const correctIndex = sourceOptions.findIndex((opt) => opt.id === q.correctOptionId);
  if (correctIndex < 0) {
    return null;
  }
  return {
    type: 'question',
    title: q.text.trim(),
    question: q.text.trim(),
    points: 10,
    position,
    is_active: true,
    options: sourceOptions.map(({ option, position: optionPosition, points }) => ({
      option,
      position: optionPosition,
      points,
    })),
    correct_option_index: correctIndex,
  };
}

export function useEventChallengeQuizCreateScreen({ eventId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [addedQuestions, setAddedQuestions] = useState<QuizCreateAddedQuestion[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState<QuizCreateQuestionSuggestion[]>(
    [],
  );

  const addedQuestionsRef = useRef(addedQuestions);
  addedQuestionsRef.current = addedQuestions;

  useFocusEffect(
    useCallback(() => {
      if (!eventId) {
        return undefined;
      }
      const controller = new AbortController();
      void (async () => {
        try {
          const [remote, existing] = await Promise.all([
            eventRepository.fetchEventChallengeQuestionSuggestions({
              signal: controller.signal,
            }),
            eventRepository.fetchEventChallenges(eventId, { signal: controller.signal }),
          ]);
          if (controller.signal.aborted) {
            return;
          }
          const used = usedChallengePromptKeySet(existing);
          for (const row of addedQuestionsRef.current) {
            const k = normalizeChallengePromptText(row.text);
            if (k.length > 0) {
              used.add(k);
            }
          }
          const next = remote.filter((s) => !used.has(normalizeChallengePromptText(s.question)));
          setAvailableSuggestions(next);
        } catch (e) {
          if (!isAbortError(e)) {
            setAvailableSuggestions([]);
          }
        }
      })();
      return () => {
        controller.abort();
      };
    }, [eventId]),
  );

  const openComposer = useCallback(() => {
    setComposerOpen(true);
    setDraft('');
  }, []);

  const resetComposerIdle = useCallback(() => {
    setComposerOpen(false);
    setDraft('');
    Keyboard.dismiss();
  }, []);

  const commitDraftQuestion = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setAddedQuestions((prev) => [buildQuestion(text), ...prev]);
    resetComposerIdle();
  }, [draft, resetComposerIdle]);

  const addQuestionFromSuggestion = useCallback(
    (suggestion: QuizCreateQuestionSuggestion) => {
      const trimmed = suggestion.question.trim();
      if (!trimmed) {
        return;
      }
      setAddedQuestions((prev) => [buildQuestion(trimmed, suggestion), ...prev]);
      setAvailableSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id));
      resetComposerIdle();
    },
    [resetComposerIdle],
  );

  /** Drop a draft question only. Call {@link restoreConsumedQuestionSuggestion} when discarding a row that came from suggestions. */
  const deleteQuestion = useCallback((questionId: string) => {
    setAddedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  const restoreConsumedQuestionSuggestion = useCallback(
    (suggestion: QuizCreateQuestionSuggestion) => {
      setAvailableSuggestions((prev) =>
        prev.some((item) => item.id === suggestion.id) ? prev : [suggestion, ...prev],
      );
    },
    [],
  );

  const setAnswerOptionText = useCallback((questionId: string, optionId: string, text: string) => {
    setAddedQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) {
          return q;
        }
        return {
          ...q,
          answerOptions: q.answerOptions.map((o) => (o.id === optionId ? { ...o, text } : o)),
        };
      }),
    );
  }, []);

  /** Latest switch turned ON wins: only one `correctOptionId` at a time. */
  const setCorrectOptionId = useCallback((questionId: string, optionId: string | null) => {
    setAddedQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, correctOptionId: optionId } : q)),
    );
  }, []);

  const canContinue =
    addedQuestions.length > 0 &&
    addedQuestions.every((question) => questionHasValidAnswers(question));

  const quizCreatePayload = useMemo(
    () => ({ eventId, questions: addedQuestions }),
    [eventId, addedQuestions],
  );

  const submit = useCallback(async () => {
    if (!eventId || !canContinue) {
      return;
    }
    const payloads = addedQuestions
      .map((q, index) => buildQuizChallengeBody(q, index + 1))
      .filter((item): item is EventChallengePostBody => item != null);
    if (payloads.length === 0) {
      showShortUserMessage(t('eventDetail.createQuizCreateInvalid'));
      return;
    }
    const ok = await eventRepository.createEventChallengesSequential(eventId, payloads);
    if (!ok) {
      showShortUserMessage(t('eventDetail.createQuizCreateError'));
      return;
    }
    showShortUserMessage(t('eventDetail.createQuizCreateSuccess'));
    goBack();
  }, [addedQuestions, canContinue, eventId, goBack, t]);

  return {
    eventId,
    composerOpen,
    draft,
    setDraft,
    addedQuestions,
    availableSuggestions,
    openComposer,
    resetComposerIdle,
    commitDraftQuestion,
    addQuestionFromSuggestion,
    deleteQuestion,
    restoreConsumedQuestionSuggestion,
    setAnswerOptionText,
    setCorrectOptionId,
    quizCreatePayload,
    canContinue,
    submit,
    goBack,
  };
}

export type QuizCreateDraftContextValue = ReturnType<typeof useEventChallengeQuizCreateScreen>;
