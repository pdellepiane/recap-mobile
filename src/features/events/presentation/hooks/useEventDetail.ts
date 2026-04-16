import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { mergeEventPreferRemote } from '@/src/features/events/data/eventDetailMerge';
import { useCallback, useEffect, useState } from 'react';

/**
 * Loads event detail: **local** snapshot from the last home feed (instant) merged with **remote**
 * GET /api/events/:id when available (remote wins on conflicts). Falls back to legacy mock ids.
 */
export const useEventDetail = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!eventId) {
      setEvent(null);
      setIsLoading(false);
      return;
    }

    const local = eventRepository.getLocalEventById(eventId);
    setEvent(local);
    setIsLoading(local === null);

    const remote = await eventRepository.fetchRemoteEventDetail(eventId);
    if (remote) {
      setEvent((prev) => {
        const merged = prev ? mergeEventPreferRemote(prev, remote) : remote;
        if (__DEV__) {
          console.log('[EventDetail]', { eventId, localSnapshot: local, remote, merged });
        }
        return merged;
      });
    } else if (!local) {
      try {
        const legacy = await eventRepository.getEventByIdLegacy(eventId);
        setEvent(legacy);
      } catch {
        setEvent(null);
      }
    }

    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    event,
    isLoading,
    reload,
  };
};
