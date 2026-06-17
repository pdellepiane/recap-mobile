import { registerForPushNotificationsAsync } from '@/src/core/notifications/registerForPushNotificationsAsync';
import { pushDeviceTypeFromPlatform } from '@/src/core/notifications/pushDeviceType';
import { notificationRepository } from '@/src/core/di/container';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

export type UsePushNotificationsResult = {
  expoPushToken: string | null;
  notification: Notifications.Notification | undefined;
};

type UsePushNotificationsOptions = {
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
};

async function syncPushTokenWithBackend(token: string): Promise<void> {
  await notificationRepository.registerPushToken(token, pushDeviceTypeFromPlatform());
}

/**
 * Registers for push notifications and attaches listeners only while the user is authenticated.
 * Re-runs on cold start when a persisted session becomes ready, and again after login.
 */
export function usePushNotifications(
  options: UsePushNotificationsOptions = {},
): UsePushNotificationsResult {
  const { isReady, session } = useAuth();
  const userId = session?.user.id;
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  );
  const onNotificationResponseRef = useRef(options.onNotificationResponse);
  onNotificationResponseRef.current = options.onNotificationResponse;
  const handledColdStartResponseRef = useRef(false);

  useEffect(() => {
    if (!isReady || !userId) {
      setExpoPushToken(null);
      setNotification(undefined);
      return;
    }

    let cancelled = false;

    void registerForPushNotificationsAsync()
      .then((token) => {
        if (cancelled) {
          return;
        }
        setExpoPushToken(token);
        if (token) {
          void syncPushTokenWithBackend(token).catch(() => {
            if (__DEV__) {
              console.error('[usePushNotifications] push token sync failed');
            }
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExpoPushToken(null);
        }
      });

    const notificationListener = Notifications.addNotificationReceivedListener((received) => {
      if (!cancelled) {
        setNotification(received);
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      onNotificationResponseRef.current?.(response);
    });

    if (!handledColdStartResponseRef.current) {
      void Notifications.getLastNotificationResponseAsync().then((response) => {
        if (!cancelled && response) {
          handledColdStartResponseRef.current = true;
          onNotificationResponseRef.current?.(response);
        }
      });
    }

    return () => {
      cancelled = true;
      notificationListener.remove();
      responseListener.remove();
    };
  }, [isReady, userId]);

  return { expoPushToken, notification };
}
