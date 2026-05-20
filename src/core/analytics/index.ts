import { ANALYTICS_EVENTS } from './events';
import {
  flush as mpFlush,
  getDistinctId as mpGetDistinctId,
  init as mpInit,
  isAnalyticsEnabled,
  mpIdentify,
  reset as mpReset,
  setUserProperties as mpSetProps,
  trackEvent as mpTrack,
} from './mixpanel';
import type { User } from '@/src/domain/entities/User';
import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';

type SharedProps = {
  what: string;
  why: string;
  when?: string;
  whoUserId?: string;
  whoRole?: string;
  whoAuthenticated?: boolean;
};

type ActorContext = {
  userId?: string;
  userRole?: string;
  authenticated?: boolean;
};

const actorContext: ActorContext = {};
const staticContext: Record<string, unknown> = {
  app_version: Constants.expoConfig?.version ?? 'unknown',
  app_runtime_version:
    typeof Constants.expoConfig?.runtimeVersion === 'string'
      ? Constants.expoConfig.runtimeVersion
      : 'unknown',
  os_name: Platform.OS,
  os_version: String(Platform.Version),
  device_name: Constants.deviceName ?? 'unknown',
};

function withContext(properties: SharedProps & Record<string, unknown>): Record<string, unknown> {
  return {
    ...staticContext,
    ...properties,
    when: properties.when ?? new Date().toISOString(),
    who_user_id: properties.whoUserId ?? actorContext.userId ?? 'anonymous',
    who_role: properties.whoRole ?? actorContext.userRole ?? 'unknown',
    who_authenticated: properties.whoAuthenticated ?? actorContext.authenticated ?? false,
  };
}

const init = async (appUserID?: string) => {
  await mpInit(appUserID);
};

const trackEvent = async (eventName: string, properties?: Record<string, unknown>) => {
  mpTrack(eventName, properties);
  if (AppState.currentState !== 'active') {
    mpFlush();
  }
};

const trackRouteEnter = async (
  properties: SharedProps & {
    routePath: string;
    routeSegments: string[];
    routeParams?: Record<string, unknown>;
  },
) => {
  await trackEvent(
    ANALYTICS_EVENTS.PAGE_ROUTE_ENTER,
    withContext({
      ...properties,
      route_path: properties.routePath,
      route_segments: properties.routeSegments.join('/'),
      route_params: properties.routeParams ?? {},
    }),
  );
};

const trackAction = async (action: string, properties: SharedProps & Record<string, unknown>) => {
  await trackEvent(
    ANALYTICS_EVENTS.ACTION_OBSERVED,
    withContext({
      ...properties,
      action,
    }),
  );
};

const identifyUser = async (userId: string, properties?: User) => {
  actorContext.userId = userId;
  actorContext.userRole = properties?.role;
  actorContext.authenticated = true;
  mpIdentify(userId);
  if (properties) {
    mpSetProps(properties);
  }
};

const setUserProperties = async (properties: User) => {
  mpSetProps(properties);
};

const clearAll = () => {
  actorContext.userId = undefined;
  actorContext.userRole = undefined;
  actorContext.authenticated = false;
  mpReset();
};

const getDistinctId = async (): Promise<string | null> => mpGetDistinctId();

const setActor = (next: ActorContext) => {
  actorContext.userId = next.userId;
  actorContext.userRole = next.userRole;
  actorContext.authenticated = next.authenticated;
};

const analytics = {
  init,
  trackEvent,
  trackRouteEnter,
  trackAction,
  identifyUser,
  setUserProperties,
  setActor,
  clearAll,
  getDistinctId,
  isEnabled: isAnalyticsEnabled,
  events: ANALYTICS_EVENTS,
};

export default analytics;
