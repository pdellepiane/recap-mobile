import * as Notifications from 'expo-notifications';

let configured = false;

/** Foreground notification presentation — call once before registering listeners. */
export function configurePushNotifications(): void {
  if (configured) {
    return;
  }
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
