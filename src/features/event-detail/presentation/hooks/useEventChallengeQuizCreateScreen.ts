import { EventChallengePostBody } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import { isAbortError } from '@/src/core/http/isAbortError';
import { quizDraftQuestionFromRemoteChallenge } from '@/src/features/event-detail/data/eventChallengeQuizEdit';
import {
  EventChallengeKind,
  getEventChallenges,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';
import { subscribeEventChallengesListRefresh } from '@/src/features/event-detail/data/eventChallengesListRefresh';
import {
  firstRouteParam,
  resolveEditRemoteChallengeId,
} from '@/src/features/event-detail/presentation/utils/quizCreateRouteParams';
import { getCachedEventChallengeApiItem } from '@/src/features/events/data/eventChallengeApiItemCache';
import {
  normalizeChallengePromptText,
  usedChallengePromptKeySet,
} from '@/src/features/events/data/eventChallengesMap';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage, showSuccessToastAfterNavigation } from '@/src/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Params = {
  eventId: string;
  editRemoteChallengeId?: string;
};

type QuizEditMeta = {
  remoteChallengeId: string;
  position: number;
  points: number;
  isActive: boolean;
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
  /** Set when the question already exists on the API (listed from GET /challenges). */
  remoteChallengeId?: string;
};

/** Challenge row loaded from GET /challenges or local id `edit-{remoteId}`. */
export function isPublishedQuizQuestion(q: QuizCreateAddedQuestion): boolean {
  return Boolean(q.remoteChallengeId) || q.id.startsWith('edit-');
}

function challengeCreatedAtMs(createdAt: string | undefined): number {
  const trimmed = createdAt?.trim();
  if (!trimmed) {
    return 0;
  }
  const ms = Date.parse(trimmed);
  return Number.isFinite(ms) ? ms : 0;
}

function remoteQuizQuestionsFromEventChallenges(
  challenges: EventChallenge[],
): QuizCreateAddedQuestion[] {
  return challenges
    .filter((c) => c.kind === EventChallengeKind.Quiz)
    .sort((a, b) => challengeCreatedAtMs(b.createdAt) - challengeCreatedAtMs(a.createdAt))
    .map((c) => quizDraftQuestionFromRemoteChallenge(c.id))
    .filter((q): q is QuizCreateAddedQuestion => q != null);
}

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

export function buildQuizChallengeBody(
  q: QuizCreateAddedQuestion,
  position: number,
  overrides?: { points?: number; is_active?: boolean },
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
    points: overrides?.points ?? 10,
    position,
    is_active: overrides?.is_active ?? true,
    options: sourceOptions.map(({ option, position: optionPosition, points }) => ({
      option,
      position: optionPosition,
      points,
    })),
    correct_option_index: correctIndex,
  };
}

export function useEventChallengeQuizCreateScreen({ eventId, editRemoteChallengeId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const routeParams = useGlobalSearchParams<{
    challengeId?: string | string[];
    questionId?: string | string[];
  }>();
  const resolvedEditRemoteChallengeId = useMemo(
    () =>
      resolveEditRemoteChallengeId({
        challengeId: editRemoteChallengeId ?? firstRouteParam(routeParams.challengeId),
        questionId: firstRouteParam(routeParams.questionId),
      }),
    [editRemoteChallengeId, routeParams.challengeId, routeParams.questionId],
  );
  const isEditMode = Boolean(resolvedEditRemoteChallengeId);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [addedQuestions, setAddedQuestions] = useState<QuizCreateAddedQuestion[]>([]);
  const [remoteQuizQuestions, setRemoteQuizQuestions] = useState<QuizCreateAddedQuestion[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState<QuizCreateQuestionSuggestion[]>(
    [],
  );
  const [editMeta, setEditMeta] = useState<QuizEditMeta | null>(null);
  const [editHydrating, setEditHydrating] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addedQuestionsRef = useRef(addedQuestions);
  addedQuestionsRef.current = addedQuestions;

  const pendingLocalQuestions = useMemo(
    () => addedQuestions.filter((q) => !isPublishedQuizQuestion(q)),
    [addedQuestions],
  );

  const listedQuestions = useMemo(() => {
    if (isEditMode) {
      return addedQuestions;
    }
    const remoteKeys = new Set(
      remoteQuizQuestions.map((q) => normalizeChallengePromptText(q.text)),
    );
    const localDrafts = pendingLocalQuestions.filter(
      (q) => !remoteKeys.has(normalizeChallengePromptText(q.text)),
    );
    return [...localDrafts, ...remoteQuizQuestions];
  }, [addedQuestions, isEditMode, pendingLocalQuestions, remoteQuizQuestions]);

  const syncRemoteQuizQuestions = useCallback((challenges: EventChallenge[]) => {
    setRemoteQuizQuestions(remoteQuizQuestionsFromEventChallenges(challenges));
  }, []);

  useEffect(() => {
    const remoteId = resolvedEditRemoteChallengeId;
    if (!eventId || !remoteId) {
      setEditHydrating(false);
      return;
    }
    let cancelled = false;
    setEditHydrating(true);
    void (async () => {
      let item = getCachedEventChallengeApiItem(remoteId);
      if (!item) {
        await eventRepository.fetchEventChallenges(eventId);
        item = getCachedEventChallengeApiItem(remoteId);
      }
      if (cancelled) {
        return;
      }
      const draftQuestion = quizDraftQuestionFromRemoteChallenge(remoteId);
      if (!item || !draftQuestion) {
        setEditHydrating(false);
        showShortUserMessage(t('eventDetail.createQuizUpdateLoadError'));
        goBack();
        return;
      }
      setAddedQuestions([draftQuestion]);
      setEditMeta({
        remoteChallengeId: remoteId,
        position: typeof item.position === 'number' && item.position > 0 ? item.position : 1,
        points: typeof item.points === 'number' ? item.points : 10,
        isActive: item.is_active !== false,
      });
      setEditHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedEditRemoteChallengeId, eventId, goBack, t]);

  useFocusEffect(
    useCallback(() => {
      if (!eventId || isEditMode) {
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
          syncRemoteQuizQuestions(existing);
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
    }, [eventId, syncRemoteQuizQuestions]),
  );

  useEffect(() => {
    if (!eventId || isEditMode) {
      return undefined;
    }
    return subscribeEventChallengesListRefresh(eventId, () => {
      syncRemoteQuizQuestions(getEventChallenges(eventId));
    });
  }, [eventId, isEditMode, syncRemoteQuizQuestions]);

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

  const canContinue = isEditMode
    ? addedQuestions.length === 1 && questionHasValidAnswers(addedQuestions[0]!)
    : pendingLocalQuestions.length > 0 &&
      pendingLocalQuestions.every((question) => questionHasValidAnswers(question));

  const quizCreatePayload = useMemo(
    () => ({ eventId, questions: addedQuestions }),
    [eventId, addedQuestions],
  );

  const submit = useCallback(async () => {
    if (!eventId || !canContinue || editHydrating || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && editMeta) {
        const q = addedQuestions[0];
        if (!q) {
          return;
        }
        const body = buildQuizChallengeBody(q, editMeta.position, {
          points: editMeta.points,
          is_active: editMeta.isActive,
        });
        if (!body) {
          showShortUserMessage(t('eventDetail.createQuizCreateInvalid'));
          return;
        }
        const ok = await eventRepository.updateEventChallenge(
          eventId,
          editMeta.remoteChallengeId,
          body,
        );
        if (!ok) {
          showShortUserMessage(t('eventDetail.createQuizUpdateError'));
          return;
        }
        goBack();
        showSuccessToastAfterNavigation(t('eventDetail.createQuizUpdateSuccess'));
        return;
      }
      const payloads = pendingLocalQuestions
        .map((q, index) => buildQuizChallengeBody(q, remoteQuizQuestions.length + index + 1))
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
      goBack();
      showSuccessToastAfterNavigation(t('eventDetail.createQuizCreateSuccess'));
      void eventRepository.fetchEventChallenges(eventId).then((refreshed) => {
        setAddedQuestions((prev) => prev.filter((q) => isPublishedQuizQuestion(q)));
        syncRemoteQuizQuestions(refreshed);
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    addedQuestions,
    pendingLocalQuestions,
    remoteQuizQuestions.length,
    canContinue,
    editHydrating,
    editMeta,
    eventId,
    goBack,
    isEditMode,
    isSubmitting,
    syncRemoteQuizQuestions,
    t,
  ]);

  return {
    eventId,
    isEditMode,
    editHydrating,
    isSubmitting,
    composerOpen,
    draft,
    setDraft,
    addedQuestions,
    listedQuestions,
    pendingLocalQuestions,
    remoteQuizQuestions,
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
