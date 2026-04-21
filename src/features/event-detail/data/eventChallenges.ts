/** Challenges shown on the event detail Challenges tab. */

export type EventChallengeKind = 'quiz' | 'photo';

export type EventChallenge = {
  id: string;
  number: number;
  kind: EventChallengeKind;
  title: string;
  /** Points when completed (local mock). */
  points?: number;
  /** Quiz prompt from API (optional). */
  question?: string;
  /** When the API returns `current_guest_answer`, guest-completed points for UI. */
  remoteCompletedPoints?: number;
};

const CHALLENGES_BY_EVENT: Record<string, EventChallenge[]> = {
  'evt-live-1': [
    { id: 'r1', number: 1, kind: 'quiz', title: '¿Dónde será la luna de miel?' },
    {
      id: 'r2',
      number: 2,
      kind: 'photo',
      title: 'Tómate una foto\nselfie con los papás\nde la novia',
      points: 10,
    },
    { id: 'r3', number: 3, kind: 'quiz', title: '¿Dónde será la luna de miel?' },
    {
      id: 'r4',
      number: 4,
      kind: 'photo',
      title: 'Tómate una foto\nselfie con los papás\nde la novia',
      points: 10,
    },
    { id: 'r5', number: 5, kind: 'quiz', title: '¿Quién llorará primero en la ceremonia?' },
    {
      id: 'r6',
      number: 6,
      kind: 'photo',
      title: 'Tómate una foto\ncon un grupo de amigos\nen la pista de baile',
      points: 10,
    },
  ],
};

type ChallengesCacheEntry = {
  list: EventChallenge[];
  fromRemote: boolean;
};

const challengesCache: Record<string, ChallengesCacheEntry | undefined> = {};

/** Called after a successful GET /api/events/:id/challenges (or mock) so tab + flows share the same list. */
export function cacheEventChallengesFromRemote(eventId: string, list: EventChallenge[]): void {
  challengesCache[eventId] = { list, fromRemote: true };
}

/** Static list for mock transport / legacy ids (not from API). */
export function getStaticFallbackChallenges(eventId: string): EventChallenge[] {
  return CHALLENGES_BY_EVENT[eventId] ?? CHALLENGES_BY_EVENT['evt-live-1'] ?? [];
}

export function getEventChallenges(eventId: string): EventChallenge[] {
  const entry = challengesCache[eventId];
  if (entry?.fromRemote) {
    return entry.list;
  }
  return CHALLENGES_BY_EVENT[eventId] ?? [];
}
