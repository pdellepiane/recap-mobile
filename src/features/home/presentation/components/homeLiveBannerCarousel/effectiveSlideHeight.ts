import { isEventFinished, isLiveEvent, isNoEvent, isScheduledEvent } from './bannerKind';
import type { BannerLayoutMetrics } from './layout';
import { BANNER_STRUCTURED_FRAME_H, CAROUSEL_HEIGHT_TRIM } from './layout';
import type { HomeBannerItem } from '@/src/core/api/types';

export function effectiveSlideHeight(
  banner: HomeBannerItem,
  measuredRaw: number,
  layout: Pick<BannerLayoutMetrics, 'fallbackFrameHeight'>,
): number {
  if (
    isNoEvent(banner) ||
    isScheduledEvent(banner) ||
    isLiveEvent(banner) ||
    isEventFinished(banner)
  ) {
    return BANNER_STRUCTURED_FRAME_H;
  }
  if (measuredRaw <= 0) {
    return layout.fallbackFrameHeight;
  }
  return Math.max(1, measuredRaw - CAROUSEL_HEIGHT_TRIM);
}
