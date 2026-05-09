import type { RankingRow } from '../../data/eventRanking';
import { EventDetailTab } from './eventDetailTabs';
import type { Event } from '@/src/domain/entities';
import { eventRepository } from '@/src/core/di/container';
import { useCallback, useEffect, useState } from 'react';

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
    let cancelled = false;
    void (async () => {
      const remote = await eventRepository.fetchEventRankingRemote(id);
      if (cancelled) {
        return;
      }
      setRankingRows(remote ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, event?.id, guestEventDayOrPastTabBlocked]);

  const refetchRanking = useCallback(async () => {
    if (guestEventDayOrPastTabBlocked) {
      setRankingRows([]);
      return;
    }
    const remote = await eventRepository.fetchEventRankingRemote(eventId);
    setRankingRows(remote ?? []);
  }, [eventId, guestEventDayOrPastTabBlocked]);

  return { rankingRows, refetchRanking };
}
