import type { FloatingReactionParticle } from './FloatingReactions';
import { colors } from '@/src/ui/colors';
import { useEffect } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const FLOAT_SIZE = 56;
const HALF = FLOAT_SIZE / 2;

type FloatingParticleViewProps = {
  item: FloatingReactionParticle;
  onComplete: (id: string) => void;
};

/**
 * Single falling reaction: scales up, drifts, rotates and fades out.
 */
export function FloatingParticleView({ item, onComplete }: FloatingParticleViewProps) {
  const progress = useSharedValue(0);
  const { id, duration, fallDistance, driftX, rotStart, rotEnd } = item;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onComplete)(id);
        }
      },
    );
    return () => {
      cancelAnimation(progress);
    };
  }, [duration, id, onComplete, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value;

    const ty = interpolate(t, [0, 1], [0, fallDistance], Extrapolation.CLAMP);
    const wobbleX = Math.sin(t * Math.PI * 5) * 16 * (1 - t);
    const wobbleRot = Math.sin(t * Math.PI * 4) * 14 * (1 - t);
    const tx = driftX * t + wobbleX;

    const scale = interpolate(
      t,
      [0, 0.32, 0.58, 0.82, 1],
      [0.46, 1.1, 1.48, 2.02, 2.48],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      t,
      [0, 0.48, 0.78, 0.92, 1],
      [1, 0.98, 0.72, 0.28, 0],
      Extrapolation.CLAMP,
    );
    const rotate = interpolate(t, [0, 1], [rotStart, rotEnd], Extrapolation.CLAMP) + wobbleRot;

    return {
      opacity,
      transform: [
        { translateX: -HALF + tx },
        { translateY: -HALF + ty },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  }, [driftX, fallDistance, rotEnd, rotStart]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: item.originX,
          top: item.originY,
        },
        animatedStyle,
      ]}
    >
      {typeof item.payload === 'string' ? (
        <Text style={styles.floatingEmojiText}>{item.payload}</Text>
      ) : (
        <Image source={item.payload} style={styles.floatingImage} resizeMode="contain" />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingEmojiText: {
    fontSize: FLOAT_SIZE,
    lineHeight: FLOAT_SIZE + 6,
    textAlign: 'center',
    width: FLOAT_SIZE + 20,
    textShadowColor: colors.overlay.white85,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  floatingImage: {
    width: FLOAT_SIZE,
    height: FLOAT_SIZE,
  },
});
