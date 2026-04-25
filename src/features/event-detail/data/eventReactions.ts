import type { EventReactionKind } from '@/src/core/api/types';
import type { ImageSourcePropType } from 'react-native';

/** Payload when the user taps a hero reaction emoji (animation + API). */
export type EventDetailReactionPressPayload = {
  reaction: EventReactionKind;
  source: ImageSourcePropType;
  center: { x: number; y: number };
};

/**
 * Maps tap slot index → POST `reaction` (order: left×2, right×2).
 * Must match {@link DEFAULT_LIVE_REACTION_IMAGES} / `extras.reactionImages` semantics.
 */
export const EVENT_DETAIL_REACTION_BY_SLOT_INDEX: readonly EventReactionKind[] = [
  'party',
  'sad',
  'laugh',
  'love',
];
