import { images } from '@/src/assets/images';
import type { ImageSourcePropType } from 'react-native';

/**
 * Fixed four reaction chips (left×2, right×2) on event detail hero — same for every event until the product
 * supports per-event assets from the backend.
 */
export const EVENT_DETAIL_LIVE_REACTION_IMAGES = [
  images.eventDetail.reactions.party,
  images.eventDetail.reactions.sad,
  images.eventDetail.reactions.fun,
  images.eventDetail.reactions.hearts,
] as const satisfies readonly [
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
  ImageSourcePropType,
];
