import { EventType, type HomeBannerItem } from '@/src/core/api/types';
import i18n from '@/src/i18n/i18n';

/**
 * When GET /api/home/banners is empty, the carousel still shows one “create first event” slide
 * (`NoBannerSlide`), replacing the former standalone first-event promo card.
 */
export const NO_EVENT_CAROUSEL_FALLBACK: HomeBannerItem = {
  id: -1,
  banner_type: EventType.NoEvent,
  slug: 'promo-primer-evento',
  name: i18n.t('home.noEventBannerName'),
  type: 'Promo',
  datetime: '',
  with_time: 0,
  cover: '',
  guest_images: [],
  timezone: 'America/Lima',
  created_at: '',
  updated_at: '',
};
