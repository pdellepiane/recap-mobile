/** challengeId → points earned on completion (in-memory mock, per event). */
type CompletionMap = Record<string, number>;

const byEventId: Record<string, CompletionMap> = {};
const globalByChallengeId: CompletionMap = {};

/** Records completion without relying on `eventId` (robust fallback across routes). */
export function recordGlobalChallengeCompletion(challengeId: string, points: number) {
  globalByChallengeId[challengeId] = points;
}

/**
 * Stores a completed challenge result for an event (accumulates without clearing other challenges).
 */
export function recordEventChallengeCompletion(
  eventId: string,
  challengeId: string,
  points: number,
) {
  if (!eventId) {
    recordGlobalChallengeCompletion(challengeId, points);
    return;
  }
  if (!byEventId[eventId]) {
    byEventId[eventId] = {};
  }
  byEventId[eventId][challengeId] = points;
  globalByChallengeId[challengeId] = points;
}

/**
 * Copy of the completion map for React state.
 * Merges per-event completions with a global fallback by challengeId (more robust across routes).
 */
export function getEventChallengesCompletionSnapshot(eventId: string): CompletionMap {
  return { ...globalByChallengeId, ...(byEventId[eventId] ?? {}) };
}
