import type {
  QuizCreateAddedQuestion,
  QuizCreateQuestionOption,
} from '@/src/features/event-detail/presentation/hooks/useEventChallengeQuizCreateScreen';
import { getEventChallengeQuiz } from '@/src/features/event-detail/data/eventChallengeQuiz';

const OPTION_SLOTS = 4;

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
