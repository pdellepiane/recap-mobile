import {
  getInstalledMapApps,
  googleMapsSearchUrl,
  openMapApp,
  type MapAppId,
  type MapAppOption,
} from '../../data/mapApps';
import * as Linking from 'expo-linking';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

export function useMapAppPicker(mapQuery: string | null | undefined) {
  const [visible, setVisible] = useState(false);
  const [apps, setApps] = useState<MapAppOption[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const query = mapQuery?.trim() ?? '';

  const closePicker = useCallback(() => {
    setVisible(false);
  }, []);

  const openMapPicker = useCallback(async () => {
    if (!query) {
      return;
    }

    if (Platform.OS === 'web') {
      await Linking.openURL(googleMapsSearchUrl(query));
      return;
    }

    setIsDetecting(true);
    try {
      const installed = await getInstalledMapApps();
      if (installed.length === 0) {
        await Linking.openURL(googleMapsSearchUrl(query));
        return;
      }

      if (installed.length === 1) {
        await openMapApp(installed[0].id, query);
        return;
      }

      setApps(installed);
      setVisible(true);
    } catch {
      await Linking.openURL(googleMapsSearchUrl(query));
    } finally {
      setIsDetecting(false);
    }
  }, [query]);

  const selectMapApp = useCallback(
    async (appId: MapAppId) => {
      if (!query) {
        return;
      }
      setVisible(false);
      try {
        await openMapApp(appId, query);
      } catch {
        await Linking.openURL(googleMapsSearchUrl(query));
      }
    },
    [query],
  );

  return {
    visible,
    apps,
    isDetecting,
    openMapPicker,
    selectMapApp,
    closePicker,
  };
}
