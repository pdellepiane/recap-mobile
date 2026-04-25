import { EventType, type HomeBannerItem } from '@/src/core/api/types';

export function isNoEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === EventType.NoEvent;
}

export function isScheduledEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === EventType.EventToStart;
}

export function isLiveEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === EventType.EventLive;
}

export function isEventFinished(banner: HomeBannerItem): boolean {
  return banner.banner_type === EventType.EventFinished;
}
