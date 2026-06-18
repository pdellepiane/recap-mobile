import type { HomeBannerItem } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { seedHomeEventCache } from '@/src/features/events/data/homeEventCache';
import { partitionHomeFeedEvents } from '@/src/features/home/presentation/utils/homeFeedPartition';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type HomeFeed = {
  /** Top-of-home banner slider (from GET /api/home/banners). */
  banners: HomeBannerItem[];
  myEvents: Event[];
  plans: Event[];
  pastEvents: Event[];
  /** Event ids from GET /api/home/host-events (for past-row card variant). */
  hostedEventIds: ReadonlySet<string>;
  /** True when host or guest event lists have at least one row. */
  hasEvents: boolean;
};

/**
 * Loads host events, guest events, and home banners. “Mis eventos pasados” includes every event
 * (hosted or guest) with start +24h in the past; active lists exclude those (see {@link partitionHomeFeedEvents}).
 * Uses `allSettled` so one failing request does not wipe the others.
 */
export function useHomeFeed(): HomeFeed & {
  isLoading: boolean;
  isRefreshing: boolean;
  reload: () => Promise<void>;
} {
  const [banners, setBanners] = useState<HomeBannerItem[]>([]);
  const [hostEvents, setHostEvents] = useState<Event[]>([]);
  const [plans, setPlans] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadGenerationRef = useRef(0);
  const { beginRequest, endRequest, abortAll } = useAbortController();

  const load = useCallback(
    async (purpose: 'initial' | 'refresh' = 'initial') => {
      const generation = ++loadGenerationRef.current;
      const controller = beginRequest();
      if (purpose === 'initial') {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      try {
        const signal = controller.signal;
        const [hostR, guestR, bannerR] = await Promise.allSettled([
          eventRepository.getHostEvents({ signal }),
          eventRepository.getGuestEvents({ signal }),
          eventRepository.getHomeBanners({ signal }),
        ]);
        if (generation !== loadGenerationRef.current) {
          return;
        }
        const aborted = [hostR, guestR, bannerR].some(
          (r) => r.status === 'rejected' && isAbortError(r.reason),
        );
        if (aborted) {
          return;
        }
        setHostEvents(hostR.status === 'fulfilled' ? hostR.value : []);
        setPlans(guestR.status === 'fulfilled' ? guestR.value : []);
        setBanners(bannerR.status === 'fulfilled' ? bannerR.value : []);
      } catch (e) {
        if (isAbortError(e)) {
          return;
        }
        if (generation === loadGenerationRef.current) {
          setHostEvents([]);
          setPlans([]);
          setBanners([]);
        }
      } finally {
        endRequest(controller);
        if (generation !== loadGenerationRef.current) {
          return;
        }
        if (purpose === 'initial') {
          setIsLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [beginRequest, endRequest],
  );

  useEffect(() => {
    void load('initial');
    return () => {
      loadGenerationRef.current += 1;
      abortAll();
    };
  }, [abortAll, load]);

  useEffect(() => {
    seedHomeEventCache([...hostEvents, ...plans]);
  }, [hostEvents, plans]);

  const feed = useMemo((): HomeFeed => {
    const hostedEventIds = new Set(hostEvents.map((e) => e.id));
    const { myEvents, plans: activePlans, pastEvents } = partitionHomeFeedEvents(hostEvents, plans);
    const hasEvents = myEvents.length > 0 || pastEvents.length > 0 || activePlans.length > 0;
    return {
      banners,
      myEvents,
      plans: activePlans,
      pastEvents,
      hostedEventIds,
      hasEvents,
    };
  }, [banners, hostEvents, plans]);

  return {
    ...feed,
    isLoading,
    isRefreshing,
    reload: () => load('refresh'),
  };
}
