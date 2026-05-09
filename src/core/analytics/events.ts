export const ANALYTICS_EVENTS = {
  PAGE_ROUTE_ENTER: 'page_route_enter',
  ACTION_OBSERVED: 'action_observed',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
