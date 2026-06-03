/** Challenges shown on the event detail Challenges tab. */

export enum EventChallengeKind {
  Quiz = 'quiz',
  Photo = 'photo',
}

export type EventChallenge = {
  id: string;
  number: number;
  kind: EventChallengeKind;
  /** Short label from API (`title`). */
  title: string;
  /** Prompt on the card (API `question`); falls back to `title` in UI when empty. */
  question?: string;
  points?: number;
  /** Guest submissions count when API sends it (`responses_count` / `answers_count`). */
  responsesCount?: number;
  /** Host user id that created the challenge (`event_host_id` from API). */
  creatorHostId?: number;
  /** When GET challenges includes `current_guest_answer`, guest-earned points from that answer. */
  remoteCompletedPoints?: number;
};

type ChallengesCacheEntry = {
  list: EventChallenge[];
  fromRemote: boolean;
};

const challengesCache: Record<string, ChallengesCacheEntry | undefined> = {};

/** Called after a successful GET /api/events/:id/challenges so tab + flows share the same list. */
export function cacheEventChallengesFromRemote(eventId: string, list: EventChallenge[]): void {
  challengesCache[eventId] = { list, fromRemote: true };
}

export function getEventChallenges(eventId: string): EventChallenge[] {
  const entry = challengesCache[eventId];
  if (entry?.fromRemote) {
    return entry.list;
  }
  return [];
}
