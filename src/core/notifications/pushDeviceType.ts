import { Platform } from 'react-native';

export type PushDeviceType = 'ios' | 'android' | 'unknown';

export function pushDeviceTypeFromPlatform(): PushDeviceType {
  if (Platform.OS === 'ios') {
    return 'ios';
  }
  if (Platform.OS === 'android') {
    return 'android';
  }
  return 'unknown';
}
