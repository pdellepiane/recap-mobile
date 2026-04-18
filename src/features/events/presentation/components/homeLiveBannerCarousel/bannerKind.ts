import { HomeBannerType, type HomeBannerItem } from '@/src/core/api/types';

export function isNoEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.NoEvent;
}

export function isScheduledEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventToStart;
}

export function isLiveEvent(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventLive;
}

export function isEventFinished(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventFinished;
}
