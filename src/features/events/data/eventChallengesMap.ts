import type { EventChallengeApiItem } from '@/src/core/api/types';
import {
  EventChallengeKind,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';
import { i18n } from '@/src/i18n';

export function mapChallengeApiTypeToKind(type: string | null | undefined): EventChallengeKind {
  const t = String(type ?? '')
    .trim()
    .toLowerCase();
  /** API: `picture` (legacy `photo`). */
  if (t.includes('picture') || t === 'photo') {
    return EventChallengeKind.Photo;
  }
  return EventChallengeKind.Quiz;
}

function parseGuestAnswerPoints(
  answer: NonNullable<EventChallengeApiItem['current_guest_answer']>,
): number {
  if (answer.points == null || answer.points === '') {
    return 0;
  }
  const n = typeof answer.points === 'number' ? answer.points : Number(answer.points);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

/** Points earned from POST answer or GET challenges when `current_guest_answer` is set. */
export function parseChallengeAnswerEarnedPoints(
  item: EventChallengeApiItem | null | undefined,
): number {
  const answer = item?.current_guest_answer;
  if (!answer) {
    return 0;
  }
  return parseGuestAnswerPoints(answer);
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
  const title = titleRaw || questionRaw || i18n.t('quiz.fallbackQuestionTitle');
  return {
    id: String(item.id),
    number: position > 0 ? position : 0,
    kind: mapChallengeApiTypeToKind(item.type),
    title,
    question: questionRaw || undefined,
    points: typeof item.points === 'number' ? item.points : undefined,
    responsesCount: pickResponsesCount(item),
    remoteCompletedPoints:
      item.current_guest_answer != null
        ? parseGuestAnswerPoints(item.current_guest_answer)
        : undefined,
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

/** Collapse whitespace for deduping suggestion text vs existing challenges. */
export function normalizeChallengePromptText(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Keys for prompts already used on the event (title + question when distinct). */
export function usedChallengePromptKeySet(challenges: readonly EventChallenge[]): Set<string> {
  const keys = new Set<string>();
  for (const c of challenges) {
    const t = normalizeChallengePromptText(c.title ?? '');
    if (t.length > 0) {
      keys.add(t);
    }
    const qRaw = c.question?.trim() ?? '';
    if (qRaw.length > 0) {
      const q = normalizeChallengePromptText(qRaw);
      if (q.length > 0) {
        keys.add(q);
      }
    }
  }
  return keys;
}
