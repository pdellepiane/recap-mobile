import type { EventChallengeApiItem } from '@/src/core/api/types';
import type {
  EventChallenge,
  EventChallengeKind,
} from '@/src/features/event-detail/data/eventChallenges';

export function mapChallengeApiTypeToKind(type: string): EventChallengeKind {
  const t = type.trim().toLowerCase();
  if (t.includes('photo') || t.includes('image') || t === 'foto') {
    return 'photo';
  }
  return 'quiz';
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

export function mapEventChallengeApiItemToPresentation(
  item: EventChallengeApiItem,
): EventChallenge {
  const position = typeof item.position === 'number' && item.position > 0 ? item.position : 0;
  return {
    id: String(item.id),
    number: position > 0 ? position : 0,
    kind: mapChallengeApiTypeToKind(item.type),
    title: item.title?.trim() || item.question?.trim() || 'Challenge',
    points: typeof item.points === 'number' ? item.points : undefined,
    question: item.question?.trim() || undefined,
    remoteCompletedPoints: parseGuestAnswerPoints(item.current_guest_answer),
  };
}

export function normalizeChallengesFromApi(items: EventChallengeApiItem[]): EventChallenge[] {
  return [...items]
    .filter((x) => x.is_active !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item, index) => {
      const mapped = mapEventChallengeApiItemToPresentation(item);
      if (mapped.number === 0) {
        return { ...mapped, number: index + 1 };
      }
      return mapped;
    });
}
