/** When challenges are created remotely, listeners sync local list from cache (see {@link EventRepository.createEventChallenge}). */

type Listener = () => void;

const listenersByEventId = new Map<string, Set<Listener>>();

export function subscribeEventChallengesListRefresh(
  eventId: string,
  listener: Listener,
): () => void {
  let set = listenersByEventId.get(eventId);
  if (!set) {
    set = new Set();
    listenersByEventId.set(eventId, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) {
      listenersByEventId.delete(eventId);
    }
  };
}

export function emitEventChallengesListRefresh(eventId: string): void {
  const set = listenersByEventId.get(eventId);
  if (!set) {
    return;
  }
  for (const listener of set) {
    try {
      listener();
    } catch {
      // no-op
    }
  }
}
