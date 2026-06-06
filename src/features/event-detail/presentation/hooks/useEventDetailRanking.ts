import type { RankingRow } from '../../data/eventRanking';
import { EventDetailTab } from './eventDetailTabs';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { useMountedRef } from '@/src/core/hooks/useMountedRef';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event } from '@/src/domain/entities';
import { useCallback, useEffect, useRef, useState } from 'react';

type Params = {
  eventId: string;
  event: Event | null | undefined;
  activeTab: EventDetailTab;
  guestEventDayOrPastTabBlocked: boolean;
};

/**
 * GET /api/events/:id/ranking — solo al entrar en Ranking (anfitrión siempre; invitado: día del evento o después).
 */
export function useEventDetailRanking({
  eventId,
  event,
  activeTab,
  guestEventDayOrPastTabBlocked,
}: Params) {
  const mountedRef = useMountedRef();
  const refetchGenerationRef = useRef(0);
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [rankingRows, setRankingRows] = useState<RankingRow[]>([]);

  useEffect(() => {
    if (activeTab !== EventDetailTab.Ranking || !event?.id) {
      return;
    }
    if (guestEventDayOrPastTabBlocked) {
      setRankingRows([]);
      return;
    }
    const id = event.id;
    const controller = beginRequest();
    void (async () => {
      try {
        const remote = await eventRepository.fetchEventRankingRemote(id, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setRankingRows(remote ?? []);
        }
      } catch (e) {
        if (!isAbortError(e) && !controller.signal.aborted) {
          setRankingRows([]);
        }
      } finally {
        endRequest(controller);
      }
    })();
    return () => {
      abortAll();
    };
  }, [abortAll, activeTab, beginRequest, endRequest, event?.id, guestEventDayOrPastTabBlocked]);

  const refetchRanking = useCallback(async () => {
    const generation = ++refetchGenerationRef.current;
    const controller = beginRequest();
    if (guestEventDayOrPastTabBlocked) {
      if (mountedRef.current && generation === refetchGenerationRef.current) {
        setRankingRows([]);
      }
      endRequest(controller);
      return;
    }
    try {
      const remote = await eventRepository.fetchEventRankingRemote(eventId, {
        signal: controller.signal,
      });
      if (!mountedRef.current || generation !== refetchGenerationRef.current) {
        return;
      }
      setRankingRows(remote ?? []);
    } catch (e) {
      if (!isAbortError(e) && mountedRef.current && generation === refetchGenerationRef.current) {
        setRankingRows([]);
      }
    } finally {
      endRequest(controller);
    }
  }, [beginRequest, endRequest, eventId, guestEventDayOrPastTabBlocked, mountedRef]);

  return { rankingRows, refetchRanking };
}
