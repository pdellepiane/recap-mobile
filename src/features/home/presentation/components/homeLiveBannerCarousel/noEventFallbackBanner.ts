import { HomeBannerType, type HomeBannerItem } from '@/src/core/api/types';

/**
 * When GET /api/home/banners is empty, the carousel still shows one “create first event” slide
 * (`NoBannerSlide`), replacing the former standalone first-event promo card.
 */
export const NO_EVENT_CAROUSEL_FALLBACK: HomeBannerItem = {
  id: -1,
  banner_type: HomeBannerType.NoEvent,
  slug: 'promo-primer-evento',
  name: 'Crea tu primer evento',
  type: 'Promo',
  datetime: '',
  with_time: 0,
  cover: '',
  guest_images: [],
  timezone: 'America/Lima',
  created_at: '',
  updated_at: '',
};
