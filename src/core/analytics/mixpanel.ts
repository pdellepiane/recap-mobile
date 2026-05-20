import type { User } from '@/src/domain/entities/User';
import { Mixpanel } from 'mixpanel-react-native';

const projectToken = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

if (!projectToken) {
  throw new Error('Mixpanel project token is not set');
}

const trackAutomaticEvents = false;
let initialized = false;
let enabled = projectToken.trim().length > 0;

const mixpanel = new Mixpanel(projectToken, trackAutomaticEvents);

export const init = async (appUserID?: string) => {
  if (initialized || !enabled) {
    return;
  }
  mixpanel.setLoggingEnabled(__DEV__);
  mixpanel.setFlushOnBackground(true);
  await mixpanel.init();
  initialized = true;
  if (appUserID) {
    mixpanel.identify(appUserID);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (!initialized || !enabled) {
    return;
  }
  mixpanel.track(eventName, properties);
};

export const flush = () => {
  if (!initialized || !enabled) {
    return;
  }
  mixpanel.flush();
};

export const mpIdentify = (userId: string) => {
  if (!initialized || !enabled) {
    return;
  }
  mixpanel.identify(userId);
};

export const setUserProperties = (properties: User) => {
  if (!initialized || !enabled) {
    return;
  }
  const payload: Record<string, unknown> = {
    ...properties,
    $email: properties.email,
    last_login: new Date().toISOString(),
  };
  if (properties.name.trim().length > 0) {
    payload.$first_name = properties.name;
    payload.$name = properties.name;
  }
  mixpanel.getPeople().set(payload);
};

export const reset = () => {
  if (!enabled) {
    return;
  }
  mixpanel.reset();
};

export const getDistinctId = async (): Promise<string | null> => {
  if (!initialized || !enabled) {
    return null;
  }
  try {
    return await mixpanel.getDistinctId();
  } catch {
    return null;
  }
};

export const isAnalyticsEnabled = () => enabled;

export const disableAnalytics = () => {
  enabled = false;
};
