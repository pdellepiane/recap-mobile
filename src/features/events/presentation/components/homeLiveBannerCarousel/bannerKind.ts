import { HomeBannerType, type HomeBannerItem } from '@/src/core/api/types';

export function noBanner(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.NoEvent;
}

export function isBannerState2(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventToStart;
}

export function isBannerState3Live(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventLive;
}

export function isBannerFinished(banner: HomeBannerItem): boolean {
  return banner.banner_type === HomeBannerType.EventFinished;
}
