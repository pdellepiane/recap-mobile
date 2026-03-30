import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback } from 'react';
import { firstNameFromDisplayName } from '../utils/eventDisplay';
import { useHomeFeed } from './useHomeFeed';

/**
 * Home screen orchestration: greeting + feed data + event navigation handlers.
 */
export function useHomeScreen() {
  const { session } = useAuth();
  const { goToEventDetail } = useCoordinator();
  const { liveEvents, myEvents, plans, pastEvents, hasEvents, isLoading } = useHomeFeed();

  const firstName = session ? firstNameFromDisplayName(session.user.name) : 'Invitado';

  const openEvent = useCallback(
    (id: string) => {
      goToEventDetail(id);
    },
    [goToEventDetail],
  );

  const handleLiveSlidePress = useCallback(
    (index: number) => {
      const ev = liveEvents[index] ?? liveEvents[0];
      if (ev) {
        openEvent(ev.id);
      }
    },
    [liveEvents, openEvent],
  );

  return {
    firstName,
    liveEvents,
    myEvents,
    plans,
    pastEvents,
    hasEvents,
    isLoading,
    openEvent,
    handleLiveSlidePress,
  };
}
