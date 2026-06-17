import { actionFromPushNotificationData } from '@/src/features/notifications/data/pushNotificationAction';
import { usePushNotifications } from './hooks/usePushNotifications';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import type { NotificationResponse } from 'expo-notifications';
import { useCallback } from 'react';

/**
 * Headless push notification registration — mount under {@link AuthProvider}.
 * Registers on app launch when a session is restored, and again after login.
 */
export function PushNotificationSync() {
  const coordinator = useCoordinator();

  const onNotificationResponse = useCallback(
    (response: NotificationResponse) => {
      const action = actionFromPushNotificationData(response.notification.request.content.data);
      if (action) {
        coordinator.goToPushRedirect(action);
      }
    },
    [coordinator],
  );

  usePushNotifications({ onNotificationResponse });

  return null;
}
