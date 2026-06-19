import { EventDetailTab } from '../../../../navigation/eventDetailTabs';
import type { RankingRow } from '../../data/eventRanking';
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
 * Get ranking data when entering the Ranking tab (host always; guest: event day or after).
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
  const [isRankingLoaded, setIsRankingLoaded] = useState(false);

  /** Get ranking data when entering the Ranking tab. */
  useEffect(() => {
    /** Only fetch ranking data when the Ranking tab is active and the event ID is valid. */
    if (activeTab !== EventDetailTab.Ranking || !event?.id) {
      return;
    }
    /** Block guest from seeing ranking before event day. */
    if (guestEventDayOrPastTabBlocked) {
      setRankingRows([]);
      setIsRankingLoaded(true);
      return;
    }
    const id = event.id;
    const controller = beginRequest();
    setIsRankingLoaded(false);
    void (async () => {
      try {
        const remote = await eventRepository.fetchEventRankingRemote(id, {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setRankingRows(remote ?? []);
          setIsRankingLoaded(true);
        }
      } catch (e) {
        if (!isAbortError(e) && !controller.signal.aborted) {
          setRankingRows([]);
          setIsRankingLoaded(true);
        }
      } finally {
        endRequest(controller);
      }
    })();
    return () => {
      abortAll();
    };
  }, [abortAll, activeTab, beginRequest, endRequest, event?.id, guestEventDayOrPastTabBlocked]);

  /** Refetch ranking data when user pulls to refresh. */
  const refetchRanking = useCallback(async () => {
    const generation = ++refetchGenerationRef.current;
    const controller = beginRequest();

    /** Block guest from seeing ranking before event day. */
    if (guestEventDayOrPastTabBlocked) {
      /** Clear ranking rows if the request is aborted. */
      if (mountedRef.current && generation === refetchGenerationRef.current) {
        setRankingRows([]);
        setIsRankingLoaded(true);
      }
      endRequest(controller);
      return;
    }
    setIsRankingLoaded(false);
    try {
      const remote = await eventRepository.fetchEventRankingRemote(eventId, {
        signal: controller.signal,
      });
      if (!mountedRef.current || generation !== refetchGenerationRef.current) {
        return;
      }
      setRankingRows(remote ?? []);
      setIsRankingLoaded(true);
    } catch (e) {
      if (!isAbortError(e) && mountedRef.current && generation === refetchGenerationRef.current) {
        setRankingRows([]);
        setIsRankingLoaded(true);
      }
    } finally {
      endRequest(controller);
    }
  }, [beginRequest, endRequest, eventId, guestEventDayOrPastTabBlocked, mountedRef]);

  return { rankingRows, isRankingLoaded, refetchRanking };
}
