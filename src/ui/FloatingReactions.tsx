import { FloatingParticleView } from './FloatingParticleView';
import type { ReactElement, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

/** Emoji text or image asset (same falling animation). */
export type FloatingReactionPayload = string | ImageSourcePropType;

export type FloatingReactionParticle = {
  id: string;
  payload: FloatingReactionPayload;
  /** Window coordinates of spawn center. */
  originX: number;
  originY: number;
  driftX: number;
  rotStart: number;
  rotEnd: number;
  duration: number;
  fallDistance: number;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticle(
  payload: FloatingReactionPayload,
  originX: number,
  originY: number,
  screenHeight: number,
): FloatingReactionParticle {
  const bottomMargin = 24;
  const maxFall = Math.min(screenHeight - originY - bottomMargin, screenHeight * 0.55);
  const fallDistance = Math.max(220, maxFall);

  const driftDir = Math.random() < 0.5 ? -1 : 1;
  const driftX = driftDir * randomBetween(18, 52);

  const rotDir = Math.random() < 0.5 ? -1 : 1;
  const rotStart = rotDir * randomBetween(4, 14);
  const rotEnd = -rotDir * randomBetween(18, 38);

  const duration = Math.round(randomBetween(1850, 2600));

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    payload,
    originX,
    originY,
    driftX,
    rotStart,
    rotEnd,
    duration,
    fallDistance,
  };
}

export type UseFloatingReactionsOptions = {
  /** Cap simultaneous particles (drops oldest when exceeded). Default 10. */
  maxConcurrent?: number;
};

export type SpawnFloatingReaction = (
  payload: FloatingReactionPayload,
  originX: number,
  originY: number,
) => void;

/**
 * Spawns floating emoji reactions from window coordinates + full-screen overlay layer.
 * Mount `overlay` once above scrollable content (`pointerEvents="box-none"`).
 */
export function useFloatingReactions(options: UseFloatingReactionsOptions = {}): {
  spawnAt: SpawnFloatingReaction;
  overlay: ReactElement;
} {
  const { height: screenHeight } = useWindowDimensions();
  const maxConcurrent = options.maxConcurrent ?? 10;
  const [particles, setParticles] = useState<FloatingReactionParticle[]>([]);

  const remove = useCallback((id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const spawnAt = useCallback(
    (payload: FloatingReactionPayload, originX: number, originY: number) => {
      setParticles((prev) => {
        const next = [...prev, createParticle(payload, originX, originY, screenHeight)];
        if (next.length <= maxConcurrent) {
          return next;
        }
        return next.slice(next.length - maxConcurrent);
      });
    },
    [maxConcurrent, screenHeight],
  );

  const overlay = (
    <View style={styles.overlay} pointerEvents="box-none" accessibilityElementsHidden>
      {particles.map((p) => (
        <FloatingParticleView key={p.id} item={p} onComplete={remove} />
      ))}
    </View>
  );

  return { spawnAt, overlay };
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
  },
});

export type FloatingReactionsProps = {
  maxConcurrent?: number;
  children: (spawnAt: SpawnFloatingReaction) => ReactNode;
};

/**
 * Composes a full-screen reaction layer with `spawnAt` for children.
 * Place as a direct child of a `flex:1` screen root so coordinates match `measureInWindow`.
 *
 * Event detail: only mount when the event is inside the “start → +24h” window; otherwise pass
 * `onReactionPress={undefined}` so reaction emojis are hidden (see `EventDetailLiveReactionProvider`).
 */
export function FloatingReactions({ maxConcurrent = 10, children }: FloatingReactionsProps) {
  const { spawnAt, overlay } = useFloatingReactions({ maxConcurrent });
  return (
    <>
      {children(spawnAt)}
      {overlay}
    </>
  );
}
