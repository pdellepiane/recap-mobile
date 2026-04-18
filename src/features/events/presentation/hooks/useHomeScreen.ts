import { HomeBannerType } from '@/src/core/api/types';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo } from 'react';
import { NO_EVENT_CAROUSEL_FALLBACK } from '../components/homeLiveBannerCarousel/noEventFallbackBanner';
import { firstNameFromDisplayName } from '../utils/eventDisplay';
import { useHomeFeed } from './useHomeFeed';

const SIN_ENVOLTURAS_MARKETING_URL = 'https://sinenvolturas.com';

/**
 * Home screen orchestration: greeting + feed data + event navigation handlers.
 */
export function useHomeScreen() {
  const { session } = useAuth();
  const { goToEventDetail, goToHomeWeb } = useCoordinator();
  const { banners, myEvents, plans, pastEvents, hasEvents, isLoading } = useHomeFeed();

  const firstName = session ? firstNameFromDisplayName(session.user.name) : 'Invitado';

  /** Same ordering as {@link HomeLiveEventsCarousel} (fallback when GET /banners is empty). */
  const carouselBanners = useMemo(
    () => (banners.length > 0 ? banners : [NO_EVENT_CAROUSEL_FALLBACK]),
    [banners],
  );

  const openEvent = useCallback(
    (id: string) => {
      goToEventDetail(id);
    },
    [goToEventDetail],
  );

  const handleLiveSlidePress = useCallback(
    (index: number) => {
      const item = carouselBanners[index] ?? carouselBanners[0];
      if (!item) {
        return;
      }
      if (item.banner_type === HomeBannerType.NoEvent) {
        goToHomeWeb(SIN_ENVOLTURAS_MARKETING_URL);
        return;
      }
      openEvent(String(item.id));
    },
    [carouselBanners, goToHomeWeb, openEvent],
  );

  return {
    firstName,
    banners,
    myEvents,
    plans,
    pastEvents,
    hasEvents,
    isLoading,
    openEvent,
    handleLiveSlidePress,
  };
}
