import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { mergeEventPreferRemote } from '@/src/features/events/data/eventDetailMerge';
import { useCallback, useEffect, useState } from 'react';

/**
 * Loads event detail: **local** snapshot from the last home feed (instant) merged with **remote**
 * GET /api/events/:id when available (remote wins on conflicts).
 */
export const useEventDetail = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = opts?.silent === true;
      if (!eventId) {
        setEvent(null);
        if (!silent) {
          setIsLoading(false);
        }
        return;
      }

      const local = eventRepository.getLocalEventById(eventId);
      if (!silent) {
        setEvent(local);
        setIsLoading(local === null);
      }

      const remote = await eventRepository.fetchRemoteEventDetail(eventId);
      if (remote) {
        setEvent((prev) => {
          return prev ? mergeEventPreferRemote(prev, remote) : remote;
        });
      } else if (!silent && !local) {
        setEvent(null);
      }

      if (!silent) {
        setIsLoading(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    event,
    isLoading,
    reload,
  };
};
