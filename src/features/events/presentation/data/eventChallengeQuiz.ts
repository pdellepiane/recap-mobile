export type EventChallengeQuiz = {
  challengeId: string;
  number: number;
  question: string;
  options: string[];
  /** Index of the correct option (0-based). */
  correctIndex: number;
  points: number;
};

const DEFAULT_OPTIONS = ['Japón', 'Italia', 'Maldivas', 'Islandia'];

const QUIZ_BY_CHALLENGE_ID: Record<string, EventChallengeQuiz> = {
  r1: {
    challengeId: 'r1',
    number: 1,
    question: '¿Dónde será la luna de miel?',
    options: DEFAULT_OPTIONS,
    correctIndex: 2,
    points: 10,
  },
  r3: {
    challengeId: 'r3',
    number: 3,
    question: '¿Dónde será la luna de miel?',
    options: DEFAULT_OPTIONS,
    correctIndex: 2,
    points: 10,
  },
  r5: {
    challengeId: 'r5',
    number: 5,
    question: '¿Quién llorará primero en la ceremonia?',
    options: ['La novia', 'El novio', 'La mamá de la novia', 'El padrino'],
    correctIndex: 0,
    points: 10,
  },
};

export function getEventChallengeQuiz(
  challengeId: string,
  fallbackNumber?: number,
): EventChallengeQuiz {
  const found = QUIZ_BY_CHALLENGE_ID[challengeId];
  if (found) {
    return found;
  }
  return {
    challengeId,
    number: fallbackNumber ?? 1,
    question: 'Challenge',
    options: DEFAULT_OPTIONS,
    correctIndex: 0,
    points: 10,
  };
}
