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
import { AppState } from 'react-native';

type SharedProps = {
  what: string;
  why: string;
  when?: string;
  whoUserId?: string;
  whoRole?: string;
  whoAuthenticated?: boolean;
};

function withContext(properties: SharedProps & Record<string, unknown>): Record<string, unknown> {
  return {
    ...properties,
    when: properties.when ?? new Date().toISOString(),
    who_user_id: properties.whoUserId ?? 'anonymous',
    who_role: properties.whoRole ?? 'unknown',
    who_authenticated: properties.whoAuthenticated ?? false,
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

const trackAction = async (
  action: string,
  properties: SharedProps & Record<string, unknown>,
) => {
  await trackEvent(
    ANALYTICS_EVENTS.ACTION_OBSERVED,
    withContext({
      ...properties,
      action,
    }),
  );
};

const identifyUser = async (userId: string, properties?: User) => {
  mpIdentify(userId);
  if (properties) {
    mpSetProps(properties);
  }
};

const setUserProperties = async (properties: User) => {
  mpSetProps(properties);
};

const clearAll = () => {
  mpReset();
};

const getDistinctId = async (): Promise<string | null> => mpGetDistinctId();

const analytics = {
  init,
  trackEvent,
  trackRouteEnter,
  trackAction,
  identifyUser,
  setUserProperties,
  clearAll,
  getDistinctId,
  isEnabled: isAnalyticsEnabled,
  events: ANALYTICS_EVENTS,
};

export default analytics;
