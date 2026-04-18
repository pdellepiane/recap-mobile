import type { HomeBannerItem } from '@/src/core/api/types';
import {
  BANNER_STRUCTURED_FRAME_H,
  CAROUSEL_HEIGHT_TRIM,
  FALLBACK_FRAME_H,
} from './layout';
import { isEventFinished, isLiveEvent, isNoEvent, isScheduledEvent } from './bannerKind';

export function effectiveSlideHeight(banner: HomeBannerItem, measuredRaw: number): number {
  if (
    isNoEvent(banner) ||
    isScheduledEvent(banner) ||
    isLiveEvent(banner) ||
    isEventFinished(banner)
  ) {
    return BANNER_STRUCTURED_FRAME_H;
  }
  if (measuredRaw <= 0) {
    return FALLBACK_FRAME_H;
  }
  return Math.max(1, measuredRaw - CAROUSEL_HEIGHT_TRIM);
}
