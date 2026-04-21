import type { HomeBannerItem } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import type { Event } from '@/src/domain/entities';
import { seedHomeEventCache } from '@/src/features/home/data/homeEventCache';
import { partitionHostEventsByDateTime } from '@/src/features/home/presentation/utils/homeFeedPartition';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type HomeFeed = {
  /** Top-of-home banner slider (from GET /api/home/banners). */
  banners: HomeBannerItem[];
  myEvents: Event[];
  plans: Event[];
  pastEvents: Event[];
  /** True when host or guest event lists have at least one row. */
  hasEvents: boolean;
};

/**
 * Loads host events, guest events, and home banners. Hosted “Mis eventos” are split into upcoming
 * vs “Mis eventos pasados” by **calendar day** (see {@link partitionHostEventsByDateTime}).
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

  const load = useCallback(async (purpose: 'initial' | 'refresh' = 'initial') => {
    if (purpose === 'initial') {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    try {
      const [hostR, guestR, bannerR] = await Promise.allSettled([
        eventRepository.getHostEvents(),
        eventRepository.getGuestEvents(),
        eventRepository.getHomeBanners(),
      ]);
      setHostEvents(hostR.status === 'fulfilled' ? hostR.value : []);
      setPlans(guestR.status === 'fulfilled' ? guestR.value : []);
      setBanners(bannerR.status === 'fulfilled' ? bannerR.value : []);
    } finally {
      if (purpose === 'initial') {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void load('initial');
  }, [load]);

  useEffect(() => {
    seedHomeEventCache([...hostEvents, ...plans], {
      hostedEventIds: hostEvents.map((e) => e.id),
    });
  }, [hostEvents, plans]);

  const feed = useMemo((): HomeFeed => {
    const { upcoming, past } = partitionHostEventsByDateTime(hostEvents);
    const hasEvents = upcoming.length > 0 || past.length > 0 || plans.length > 0;
    return {
      banners,
      myEvents: upcoming,
      plans,
      pastEvents: past,
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
