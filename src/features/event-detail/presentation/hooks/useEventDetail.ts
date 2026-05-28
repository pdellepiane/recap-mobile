import { useAbortController } from '@/src/core/hooks/useAbortController';
import { eventRepository } from '@/src/core/di/container';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event } from '@/src/domain/entities';
import { mergeEventPreferRemote } from '@/src/features/events/data/eventDetailMerge';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Loads event detail: **local** snapshot from the last home feed (instant) merged with **remote**
 * GET /api/events/:id when available (remote wins on conflicts).
 */
export const useEventDetail = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadGenerationRef = useRef(0);
  const { beginRequest, endRequest, abortAll } = useAbortController();

  /**
   * Refetches remote detail and merges into state.
   *
   * @param opts.silent - When `true`, skips updating the hook's loading flag and does not push the local-only
   *   snapshot into state before the network returns. Use for **background** refresh (e.g. pull-to-refresh,
   *   re-entering the overview tab) so the screen does not flash a loading shell or stale local-only data.
   *   When `false` or omitted, behaves like an initial load: may show loading and applies local cache first.
   */
  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      const generation = ++loadGenerationRef.current;
      const controller = beginRequest();
      const silent = opts?.silent === true;
      if (!eventId) {
        if (generation !== loadGenerationRef.current) {
          endRequest(controller);
          return;
        }
        setEvent(null);
        if (!silent) {
          setIsLoading(false);
        }
        endRequest(controller);
        return;
      }

      const local = eventRepository.getLocalEventById(eventId);
      if (!silent) {
        if (generation !== loadGenerationRef.current) {
          endRequest(controller);
          return;
        }
        setEvent(local);
        setIsLoading(local === null);
      }

      try {
        const remote = await eventRepository.fetchRemoteEventDetail(eventId, {
          signal: controller.signal,
        });
        if (generation !== loadGenerationRef.current) {
          return;
        }
        if (remote) {
          setEvent((prev) => {
            return prev ? mergeEventPreferRemote(prev, remote) : remote;
          });
        } else if (!silent && !local) {
          setEvent(null);
        }
      } catch (e) {
        if (!isAbortError(e) && generation === loadGenerationRef.current && !silent && !local) {
          setEvent(null);
        }
      } finally {
        endRequest(controller);
        if (generation === loadGenerationRef.current && !silent) {
          setIsLoading(false);
        }
      }
    },
    [beginRequest, endRequest, eventId],
  );

  useEffect(() => {
    void reload();
    return () => {
      loadGenerationRef.current += 1;
      abortAll();
    };
  }, [abortAll, reload]);

  const setEventShowGuestList = useCallback((showGuestList: boolean) => {
    setEvent((prev) => (prev ? { ...prev, showGuestList } : prev));
  }, []);

  return {
    event,
    isLoading,
    reload,
    setEventShowGuestList,
  };
};
