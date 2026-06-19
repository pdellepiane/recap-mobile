import { firstNameFromDisplayName } from '../utils/eventDisplay';
import { useHomeFeed } from './useHomeFeed';
import { EventType } from '@/src/core/api/types';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useInvalidateRemoteImageCache } from '@/src/ui';
import * as Linking from 'expo-linking';
import { useCallback } from 'react';

const SIN_ENVOLTURAS_MARKETING_URL = 'https://sinenvolturas.com/evento/crear/tipo';

/**
 * Home screen orchestration: feed data + event navigation handlers.
 */
export function useHomeScreen() {
  const { session, refreshUser } = useAuth();
  const { goToEventDetail } = useCoordinator();
  const invalidateRemoteImageCache = useInvalidateRemoteImageCache();
  const {
    banners,
    myEvents,
    plans,
    pastEvents,
    hostedEventIds,
    hasEvents,
    isLoading,
    isRefreshing,
    reload: reloadFeed,
  } = useHomeFeed();

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([invalidateRemoteImageCache(), reloadFeed(), refreshUser()]);
    } catch (error) {
      console.error('Error refreshing home screen:', error);
    }
  }, [invalidateRemoteImageCache, reloadFeed, refreshUser]);

  const displayName = session ? firstNameFromDisplayName(session.user.name) : '';

  const handleOpenEvent = useCallback(
    (id: string) => {
      goToEventDetail(id);
    },
    [goToEventDetail],
  );

  const handleSlidePress = useCallback(
    (index: number) => {
      const item = banners[index];
      if (!item) {
        return;
      }
      if (item.banner_type === EventType.NoEvent) {
        void Linking.openURL(SIN_ENVOLTURAS_MARKETING_URL);
        return;
      }
      handleOpenEvent(String(item.id));
    },
    [banners, handleOpenEvent],
  );

  return {
    displayName,
    banners,
    myEvents,
    plans,
    pastEvents,
    hostedEventIds,
    hasEvents,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleOpenEvent,
    handleSlidePress,
  };
}
