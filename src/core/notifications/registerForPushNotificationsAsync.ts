import { configurePushNotifications } from './configurePushNotifications';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Requests permission (if needed) and returns the Expo push token.
 * Returns `null` on simulators, denied permission, or missing EAS project ID.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  configurePushNotifications();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    if (__DEV__) {
      console.error('Push notifications not granted');
    }
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId || typeof projectId !== 'string') {
    throw new Error('Missing EAS project ID in app config (extra.eas.projectId).');
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  return token.data;
}
