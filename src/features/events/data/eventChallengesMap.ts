import type { EventChallengeApiItem } from '@/src/core/api/types';
import {
  EventChallengeKind,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';

export function mapChallengeApiTypeToKind(type: string | null | undefined): EventChallengeKind {
  const t = String(type ?? '')
    .trim()
    .toLowerCase();
  if (t.includes('picture')) {
    return EventChallengeKind.Photo;
  }
  return EventChallengeKind.Quiz;
}

function parseGuestAnswerPoints(
  answer: EventChallengeApiItem['current_guest_answer'],
): number | undefined {
  if (!answer || answer.points == null || answer.points === '') {
    return undefined;
  }
  const n = typeof answer.points === 'number' ? answer.points : Number(answer.points);
  return Number.isFinite(n) ? n : undefined;
}

function pickResponsesCount(item: EventChallengeApiItem): number | undefined {
  const n =
    typeof item.responses_count === 'number'
      ? item.responses_count
      : typeof item.answers_count === 'number'
        ? item.answers_count
        : undefined;
  return n !== undefined && Number.isFinite(n) ? Math.max(0, Math.floor(n)) : undefined;
}

export function mapEventChallengeApiItemToPresentation(
  item: EventChallengeApiItem,
): EventChallenge {
  const position = typeof item.position === 'number' && item.position > 0 ? item.position : 0;
  const titleRaw = item.title?.trim();
  const questionRaw = item.question?.trim();
  const title = titleRaw || questionRaw || 'Challenge';
  return {
    id: String(item.id),
    number: position > 0 ? position : 0,
    kind: mapChallengeApiTypeToKind(item.type),
    title,
    question: questionRaw || undefined,
    points: typeof item.points === 'number' ? item.points : undefined,
    responsesCount: pickResponsesCount(item),
    remoteCompletedPoints: parseGuestAnswerPoints(item.current_guest_answer),
  };
}

export function normalizeChallengesFromApi(items: EventChallengeApiItem[]): EventChallenge[] {
  return [...items]
    .filter((x) => x != null && x.is_active !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item, index) => {
      const mapped = mapEventChallengeApiItemToPresentation(item);
      if (mapped.number === 0) {
        return { ...mapped, number: index + 1 };
      }
      return mapped;
    });
}
