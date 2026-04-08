import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback } from 'react';
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

  const openEvent = useCallback(
    (id: string) => {
      goToEventDetail(id);
    },
    [goToEventDetail],
  );

  const handleLiveSlidePress = useCallback(
    (index: number) => {
      const item = banners[index] ?? banners[0];
      if (item) {
        openEvent(String(item.id));
      }
    },
    [banners, openEvent],
  );

  const handleOpenWebsiteToCreateEvent = useCallback(() => {
    goToHomeWeb(SIN_ENVOLTURAS_MARKETING_URL);
  }, [goToHomeWeb]);

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
    handleOpenWebsiteToCreateEvent,
  };
}
