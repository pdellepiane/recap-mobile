import { usePushNotifications } from './hooks/usePushNotifications';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import {
  enqueueNotificationAction,
  peekPendingNotificationAction,
  takePendingNotificationAction,
} from '@/src/navigation/pendingNotificationAction';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import type { NotificationResponse } from 'expo-notifications';
import { useSegments } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Headless push notification registration — mount under {@link AuthProvider}.
 * Queues notification actions on tap and navigates after cold-start bootstrap (auth + home redirect).
 */
export function PushNotificationSync() {
  const { isReady, session } = useAuth();
  const segments = useSegments();
  const { goToPushRedirect } = useCoordinator();
  const [pendingTick, setPendingTick] = useState(0);

  /** Queue the notification action path from a push tap or initial deeplink. */
  const onNotificationResponse = useCallback((response: NotificationResponse) => {
    const data = response.notification.request.content.data;
    const actionPath = data.action as string;

    if (actionPath && enqueueNotificationAction(actionPath)) {
      setPendingTick((tick) => tick + 1);
    }
  }, []);

  usePushNotifications({ onNotificationResponse });

  /** Handle the pending notification action path from a push tap or initial deeplink. */
  useEffect(() => {
    if (!isReady || !session) {
      return undefined;
    }
    if (!peekPendingNotificationAction()) {
      return undefined;
    }

    const root = segments[0];
    if (root === undefined) {
      return undefined;
    }
    // Let `app/index` redirect to home finish before pushing the notification target.
    if (root !== 'home' && root !== 'event') {
      return undefined;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      const action = takePendingNotificationAction();
      if (!action) {
        return;
      }
      goToPushRedirect(action);
    });

    return () => task.cancel();
  }, [goToPushRedirect, isReady, pendingTick, segments, session]);

  return null;
}
