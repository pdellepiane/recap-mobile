import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export type MapAppId = 'apple-maps' | 'google-maps' | 'waze';

export type MapAppOption = {
  id: MapAppId;
  labelKey:
    | 'eventDetail.mapAppAppleMaps'
    | 'eventDetail.mapAppGoogleMaps'
    | 'eventDetail.mapAppWaze';
};

type MapAppDefinition = MapAppOption & {
  platforms: readonly ('ios' | 'android')[];
  /** When true, skip `canOpenURL` (e.g. Apple Maps on iOS, Google Maps via https/geo). */
  alwaysAvailable?: boolean;
  canOpenTestUrl?: string;
};

const MAP_APP_DEFINITIONS: MapAppDefinition[] = [
  {
    id: 'apple-maps',
    labelKey: 'eventDetail.mapAppAppleMaps',
    platforms: ['ios'],
    alwaysAvailable: true,
  },
  {
    id: 'google-maps',
    labelKey: 'eventDetail.mapAppGoogleMaps',
    platforms: ['ios', 'android'],
    alwaysAvailable: true,
  },
  {
    id: 'waze',
    labelKey: 'eventDetail.mapAppWaze',
    platforms: ['ios', 'android'],
    canOpenTestUrl: 'waze://?q=test',
  },
];

/** Google Maps search URL (web / universal link — opens the app on iOS when installed). */
export function googleMapsSearchUrl(query: string | null | undefined): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query?.trim() ?? '')}`;
}

function wazeFallbackUrl(query: string): string {
  const q = encodeURIComponent(query.trim());
  return `https://waze.com/ul?q=${q}&navigate=yes`;
}

async function canOpenMapUrl(url: string): Promise<boolean> {
  try {
    return await Linking.canOpenURL(url);
  } catch {
    return false;
  }
}

export function buildMapAppUrl(appId: MapAppId, query: string): string {
  const trimmed = query.trim();
  const q = encodeURIComponent(trimmed);

  switch (appId) {
    case 'apple-maps':
      return `http://maps.apple.com/?q=${q}`;
    case 'google-maps':
      return Platform.OS === 'android'
        ? `geo:0,0?q=${q}`
        : googleMapsSearchUrl(trimmed);
    case 'waze':
      return `waze://?q=${q}&navigate=yes`;
  }
}

export async function getInstalledMapApps(): Promise<MapAppOption[]> {
  if (Platform.OS === 'web') {
    return [];
  }

  const platform = Platform.OS;
  const installed: MapAppOption[] = [];

  for (const app of MAP_APP_DEFINITIONS) {
    if (!app.platforms.includes(platform as 'ios' | 'android')) {
      continue;
    }

    if (app.alwaysAvailable) {
      installed.push({ id: app.id, labelKey: app.labelKey });
      continue;
    }

    if (app.canOpenTestUrl && (await canOpenMapUrl(app.canOpenTestUrl))) {
      installed.push({ id: app.id, labelKey: app.labelKey });
    }
  }

  return installed;
}

export async function openMapApp(appId: MapAppId, query: string): Promise<void> {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  const primaryUrl = buildMapAppUrl(appId, trimmed);

  try {
    await Linking.openURL(primaryUrl);
  } catch {
    if (appId === 'waze') {
      await Linking.openURL(wazeFallbackUrl(trimmed));
      return;
    }

    if (appId === 'google-maps') {
      await Linking.openURL(googleMapsSearchUrl(trimmed));
    }
  }
}
