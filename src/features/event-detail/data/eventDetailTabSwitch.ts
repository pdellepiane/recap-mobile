import { EventDetailTab } from '../presentation/hooks/eventDetailTabs';

type Listener = (tab: EventDetailTab) => void;

const listenersByEventId = new Map<string, Set<Listener>>();

export function subscribeEventDetailTabSwitch(eventId: string, listener: Listener): () => void {
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

export function emitEventDetailTabSwitch(eventId: string, tab: EventDetailTab): void {
  const set = listenersByEventId.get(eventId);
  if (!set) {
    return;
  }
  for (const listener of set) {
    try {
      listener(tab);
    } catch {
      // no-op
    }
  }
}
