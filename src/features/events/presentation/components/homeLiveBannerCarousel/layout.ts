import { Dimensions } from 'react-native';

export const SCREEN_W = Dimensions.get('window').width;
/** Symmetric horizontal inset so one card is visible per page (matches home gutter). */
export const HORIZONTAL_INSET = 20;
/** Visible card width inside each full-width page. */
export const CARD_W = SCREEN_W - 2 * HORIZONTAL_INSET;
/** One ScrollView “page” per slide — must equal viewport width for `pagingEnabled`. */
export const PAGE_W = SCREEN_W;
/** Subtracted from measured / aspect-ratio height (tighter card) — not applied to structured slides. */
export const CAROUSEL_HEIGHT_TRIM = 60;
export const RAW_FALLBACK_FRAME_H = Math.round(CARD_W / 2.15);
export const FALLBACK_FRAME_H = Math.max(1, RAW_FALLBACK_FRAME_H - CAROUSEL_HEIGHT_TRIM);
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
