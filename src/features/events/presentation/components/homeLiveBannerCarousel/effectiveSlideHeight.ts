import type { HomeBannerItem } from '@/src/core/api/types';
import {
  BANNER_STRUCTURED_FRAME_H,
  CAROUSEL_HEIGHT_TRIM,
  FALLBACK_FRAME_H,
} from './layout';
import { isBannerFinished, isBannerState2, isBannerState3Live, noBanner } from './bannerKind';

export function effectiveSlideHeight(banner: HomeBannerItem, measuredRaw: number): number {
  if (
    noBanner(banner) ||
    isBannerState2(banner) ||
    isBannerState3Live(banner) ||
    isBannerFinished(banner)
  ) {
    return BANNER_STRUCTURED_FRAME_H;
  }
  if (measuredRaw <= 0) {
    return FALLBACK_FRAME_H;
  }
  return Math.max(1, measuredRaw - CAROUSEL_HEIGHT_TRIM);
}
