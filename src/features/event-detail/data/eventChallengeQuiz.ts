import { getApiQuizOverride } from '@/src/features/events/data/eventChallengesQuizSeed';

export type EventChallengeQuiz = {
  challengeId: string;
  number: number;
  question: string;
  options: string[];
  /** Index of the correct option (0-based). */
  correctIndex: number;
  points: number;
};

/**
 * Quiz payload from GET /api/events/:id/challenges (parsed via {@link seedEventChallengeQuizzesFromApi}).
 */
export function getEventChallengeQuiz(challengeId: string): EventChallengeQuiz | null {
  return getApiQuizOverride(challengeId) ?? null;
}
