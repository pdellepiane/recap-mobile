import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Opens the native camera to capture a photo.
 * Requests camera permission the first time; returns local file URI or null.
 */
export function useLaunchDeviceCamera() {
  const takePhoto = useCallback(async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de cámara',
          'Para tomar fotos necesitamos acceso a la cámara. Puedes activarlo en los ajustes del dispositivo.',
        );
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
      const msg = e instanceof Error ? e.message : 'No se pudo abrir la cámara.';
      if (Platform.OS === 'web') {
        Alert.alert(
          'Cámara no disponible',
          'En la web la cámara depende del navegador y de permisos.',
        );
      } else {
        Alert.alert(
          'No se pudo abrir la cámara',
          `${msg}\n\nComprueba permisos en Ajustes y prueba en un dispositivo físico (el simulador iOS no tiene cámara).`,
        );
      }
      return null;
    }
  }, []);

  return { takePhoto };
}
