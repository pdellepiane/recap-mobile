import type { EventChallengeApiItem } from '@/src/core/api/types';
import type { EventChallengeQuiz } from '@/src/features/event-detail/data/eventChallengeQuiz';
import { mapChallengeApiTypeToKind } from '@/src/features/home/data/eventChallengesMap';

const apiQuizOverrides = new Map<string, EventChallengeQuiz>();

export function clearEventChallengeQuizApiSeeds(): void {
  apiQuizOverrides.clear();
}

export function getApiQuizOverride(challengeId: string): EventChallengeQuiz | undefined {
  return apiQuizOverrides.get(challengeId);
}

type ParsedOptions = {
  labels: string[];
  correctIndex: number;
};

function parseChallengeOptionsJson(raw: string | null | undefined): ParsedOptions | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const v = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(v) || v.length === 0) {
      return null;
    }
    if (typeof v[0] === 'string') {
      return { labels: v.map((x) => String(x)), correctIndex: 0 };
    }
    const labels: string[] = [];
    let correctIndex = 0;
    v.forEach((opt: unknown, i: number) => {
      if (opt && typeof opt === 'object') {
        const o = opt as { text?: string; label?: string; is_correct?: boolean };
        labels.push(String(o.text ?? o.label ?? ''));
        if (o.is_correct === true) {
          correctIndex = i;
        }
      } else {
        labels.push(String(opt));
      }
    });
    return { labels, correctIndex };
  } catch {
    return null;
  }
}

function buildQuizFromApiItem(item: EventChallengeApiItem): EventChallengeQuiz | null {
  if (mapChallengeApiTypeToKind(item.type) !== 'quiz') {
    return null;
  }
  const parsed = parseChallengeOptionsJson(item.options);
  const labels =
    parsed && parsed.labels.length > 0
      ? parsed.labels
      : ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'];
  const position = typeof item.position === 'number' && item.position > 0 ? item.position : 1;
  return {
    challengeId: String(item.id),
    number: position,
    question: item.question?.trim() || item.title?.trim() || 'Challenge',
    options: labels,
    correctIndex: parsed?.correctIndex ?? 0,
    points: typeof item.points === 'number' ? item.points : 10,
  };
}

/**
 * Replaces API-sourced quiz payloads used by {@link getEventChallengeQuiz} for the current event load.
 */
export function seedEventChallengeQuizzesFromApi(items: EventChallengeApiItem[]): void {
  clearEventChallengeQuizApiSeeds();
  for (const item of items) {
    if (item.is_active === false) {
      continue;
    }
    const quiz = buildQuizFromApiItem(item);
    if (quiz) {
      apiQuizOverrides.set(quiz.challengeId, quiz);
    }
  }
}
