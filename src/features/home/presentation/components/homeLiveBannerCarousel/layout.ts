/** Symmetric horizontal inset so one card is visible per page (matches home gutter). */
export const HORIZONTAL_INSET = 20;
/** Subtracted from measured / aspect-ratio height (tighter card) — not applied to structured slides. */
export const CAROUSEL_HEIGHT_TRIM = 60;
export const IMAGE_RADIUS = 20;
export const PROMO_RADIUS = 16;
/** Structured “event live” banner card corners (design ~24px). */
export const LIVE_BANNER_RADIUS = 24;
/**
 * Fixed height for all structured banner slides (`no_event`, `event_to_start`, `event_live`, `event_finished`).
 * Full-bleed fallback slides use measured cover height instead.
 */
export const BANNER_STRUCTURED_FRAME_H = 158;

export const COLLAGE_CELL = 54;
export const COLLAGE_COL_OVERLAP = -20;
export const COLLAGE_ROW_OVERLAP = -13;
export const COLLAGE_STAGGER = 18;
/** Circular guest collage on the finished-event banner (must match `rightPanel` in slide columns). */
export const FINISHED_GUEST_COLLAGE_FRAME = 214;

export type BannerLayoutMetrics = {
  screenWidth: number;
  cardWidth: number;
  pageWidth: number;
  fallbackFrameHeight: number;
};

/** Width-dependent banner carousel metrics (use with `useWindowDimensions`). */
export function deriveBannerLayout(screenWidth: number): BannerLayoutMetrics {
  const cardWidth = screenWidth - 2 * HORIZONTAL_INSET;
  const rawFallbackFrameH = Math.round(cardWidth / 2.15);
  const fallbackFrameHeight = Math.max(1, rawFallbackFrameH - CAROUSEL_HEIGHT_TRIM);
  return {
    screenWidth,
    cardWidth,
    pageWidth: screenWidth,
    fallbackFrameHeight,
  };
}
