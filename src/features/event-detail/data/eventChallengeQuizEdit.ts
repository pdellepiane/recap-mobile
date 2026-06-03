import type { EventChallengeApiItem } from '@/src/core/api/types';
import type { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import { EventChallengeKind } from '@/src/features/event-detail/data/eventChallenges';
import type {
  QuizCreateAddedQuestion,
  QuizCreateQuestionOption,
} from '@/src/features/event-detail/presentation/hooks/useEventChallengeQuizCreateScreen';
import { getEventChallengeQuiz } from '@/src/features/event-detail/data/eventChallengeQuiz';

const OPTION_SLOTS = 4;

export type QuizEditSnapshot = {
  type: string;
  optionTexts: string[];
  correctIndex: number;
};

export function canUserEditQuizChallenge(
  challenge: Pick<EventChallenge, 'kind' | 'creatorHostId'>,
  userId: string | undefined,
): boolean {
  if (challenge.kind !== EventChallengeKind.Quiz || !userId || challenge.creatorHostId == null) {
    return false;
  }
  return String(challenge.creatorHostId) === userId;
}

export function buildQuizEditSnapshotFromApiItem(item: EventChallengeApiItem): QuizEditSnapshot {
  const quiz = getEventChallengeQuiz(String(item.id));
  const optionTexts =
    quiz?.options.map((label) => label.trim()).filter((label) => label.length > 0) ?? [];
  return {
    type: item.type,
    optionTexts,
    correctIndex: quiz?.correctIndex ?? 0,
  };
}

export function quizDraftQuestionFromRemoteChallenge(
  remoteChallengeId: string,
): QuizCreateAddedQuestion | null {
  const quiz = getEventChallengeQuiz(remoteChallengeId);
  if (!quiz) {
    return null;
  }
  const id = `edit-${remoteChallengeId}`;
  const answerOptions: QuizCreateQuestionOption[] = Array.from({ length: OPTION_SLOTS }, (_, i) => ({
    id: `${id}-opt-${i}`,
    text: quiz.options[i] ?? '',
  }));
  const correctOptionId =
    quiz.correctIndex >= 0 && quiz.correctIndex < answerOptions.length
      ? answerOptions[quiz.correctIndex].id
      : null;
  return {
    id,
    text: quiz.question,
    answerOptions,
    correctOptionId,
    remoteChallengeId,
  };
}

export function quizOptionsChangedForEdit(
  snapshot: QuizEditSnapshot,
  question: QuizCreateAddedQuestion,
): boolean {
  const filled = question.answerOptions
    .map((o) => o.text.trim())
    .filter((text) => text.length > 0);
  if (filled.length !== snapshot.optionTexts.length) {
    return true;
  }
  for (let i = 0; i < filled.length; i++) {
    if (filled[i] !== snapshot.optionTexts[i]) {
      return true;
    }
  }
  const correctIndex = question.answerOptions.findIndex((o) => o.id === question.correctOptionId);
  return correctIndex !== snapshot.correctIndex;
}
