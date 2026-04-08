import { useEvents } from './useEvents';
import type { Event } from '@/src/domain/entities';
import { useMemo } from 'react';

export type HomeFeed = {
  /** First live event (compat). */
  liveEvent: Event | undefined;
  /** All `evt-live-*` mocks (live carousel). */
  liveEvents: Event[];
  myEvents: Event[];
  plans: Event[];
  pastEvents: Event[];
  /** `true` when the API returned at least one event. */
  hasEvents: boolean;
};

/**
 * Splits the mock list: `evt-live-*` → live carousel; the rest → my events / plans / past.
 */
export function useHomeFeed(): HomeFeed & { isLoading: boolean; reload: () => Promise<void> } {
  const { events, isLoading, reload } = useEvents();

  const feed = useMemo((): HomeFeed => {
    const hasEvents = events.length > 0;
    const liveEvents = hasEvents ? events.filter((e) => e.id.startsWith('evt-live-')) : [];
    const rest = hasEvents ? events.filter((e) => !e.id.startsWith('evt-live-')) : [];
    return {
      liveEvent: liveEvents[0],
      liveEvents,
      myEvents: rest.slice(0, 5),
      plans: rest.slice(5, 8),
      pastEvents: rest.slice(8, 11),
      hasEvents,
    };
  }, [events]);

  return {
    ...feed,
    isLoading,
    reload,
  };
}
