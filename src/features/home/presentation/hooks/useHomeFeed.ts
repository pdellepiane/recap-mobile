import type { HomeBannerItem } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event } from '@/src/domain/entities';
import { seedHomeEventCache } from '@/src/features/events/data/homeEventCache';
import { partitionHomeFeedEvents } from '@/src/features/home/presentation/utils/homeFeedPartition';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

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

type HomeFeedRemote = {
  banners: HomeBannerItem[];
  hostEvents: Event[];
  plans: Event[];
};

const homeFeedQueryKey = ['homeFeed'] as const;

async function fetchHomeFeed(signal: AbortSignal): Promise<HomeFeedRemote> {
  const [hostR, guestR, bannerR] = await Promise.allSettled([
    eventRepository.getHostEvents({ signal }),
    eventRepository.getGuestEvents({ signal }),
    eventRepository.getHomeBanners({ signal }),
  ]);
  const aborted = [hostR, guestR, bannerR].find(
    (result) => result.status === 'rejected' && isAbortError(result.reason),
  );
  if (aborted?.status === 'rejected') {
    throw aborted.reason;
  }
  return {
    hostEvents: hostR.status === 'fulfilled' ? hostR.value : [],
    plans: guestR.status === 'fulfilled' ? guestR.value : [],
    banners: bannerR.status === 'fulfilled' ? bannerR.value : [],
  };
}

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
  const { data, isPending, isRefetching, refetch } = useQuery({
    queryKey: homeFeedQueryKey,
    queryFn: ({ signal }) => fetchHomeFeed(signal),
  });

  const banners = data?.banners ?? [];
  const hostEvents = data?.hostEvents ?? [];
  const plans = data?.plans ?? [];

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
    isLoading: isPending,
    isRefreshing: isRefetching,
    reload: async () => {
      await refetch();
    },
  };
}
