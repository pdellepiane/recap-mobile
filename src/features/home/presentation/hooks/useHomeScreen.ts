import { NO_EVENT_CAROUSEL_FALLBACK } from '../components/homeLiveBannerCarousel/noEventFallbackBanner';
import { firstNameFromDisplayName } from '../utils/eventDisplay';
import { useHomeFeed } from './useHomeFeed';
import { EventType } from '@/src/core/api/types';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import * as Linking from 'expo-linking';
import { useCallback, useMemo } from 'react';

const SIN_ENVOLTURAS_MARKETING_URL = 'https://sinenvolturas.com/evento/crear/tipo';

/**
 * Home screen orchestration: greeting + feed data + event navigation handlers.
 */
export function useHomeScreen() {
  const { t } = useTranslation();
  const { session, refreshUser } = useAuth();
  const { goToEventDetail } = useCoordinator();
  const {
    banners,
    myEvents,
    plans,
    pastEvents,
    hasEvents,
    isLoading,
    isRefreshing,
    reload: reloadFeed,
  } = useHomeFeed();

  const reload = useCallback(async () => {
    await Promise.all([reloadFeed(), refreshUser()]);
  }, [reloadFeed, refreshUser]);

  const displayName = session ? firstNameFromDisplayName(session.user.name) : t('home.guest');
  const greeting = t('home.greeting', { name: displayName });

  /** Same ordering as {@link HomeBannerCarousel} (fallback when GET /banners is empty). */
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

  const handleSlidePress = useCallback(
    (index: number) => {
      const item = carouselBanners[index] ?? carouselBanners[0];
      if (!item) {
        return;
      }
      if (item.banner_type === EventType.NoEvent) {
        void Linking.openURL(SIN_ENVOLTURAS_MARKETING_URL);
        return;
      }
      openEvent(String(item.id));
    },
    [carouselBanners, openEvent],
  );

  return {
    greeting,
    banners,
    myEvents,
    plans,
    pastEvents,
    hasEvents,
    isLoading,
    isRefreshing,
    reload,
    openEvent,
    handleSlidePress,
  };
}
