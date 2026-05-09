import { Alert, Platform, ToastAndroid } from 'react-native';

/** Brief non-blocking feedback: toast on Android, alert on iOS. */
export function showShortUserMessage(message: string): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert(message);
}
