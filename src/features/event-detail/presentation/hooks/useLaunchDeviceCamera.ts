import { useTranslation } from '@/src/i18n';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Opens the native camera to capture a photo.
 * Requests camera permission the first time; returns local file URI or null.
 */
export function useLaunchDeviceCamera() {
  const { t } = useTranslation();
  const takePhoto = useCallback(async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('camera.permissionTitle'), t('camera.permissionMessage'));
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      return result.assets[0]?.uri ?? null;
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('camera.openFailedGeneric');
      if (Platform.OS === 'web') {
        Alert.alert(t('camera.unavailableWebTitle'), t('camera.unavailableWebMessage'));
      } else {
        Alert.alert(t('camera.openFailedTitle'), `${msg}${t('camera.openFailedBodySuffix')}`);
      }
      return null;
    }
  }, [t]);

  return { takePhoto };
}
