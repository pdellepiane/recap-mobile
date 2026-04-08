import { useCallback, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const DISMISS_DISTANCE = 110;
const DISMISS_VELOCITY = 480;
const SPRING = { damping: 22, stiffness: 320 };
/** Final circular crop size when dragging (WhatsApp-style). */
const MORPH_END_SIZE = 68;
/** Translation at which the morph reaches ~100%. */
const DRAG_MORPH_RANGE = 260;

/**
 * Vertical pan down to dismiss (WhatsApp stories-style). `resetKey` resets position when context changes (e.g. slide).
 *
 * Returns styles for: dim layer fading out, media frame morphing to a circle, and chrome UI opacity.
 */
export function useSwipeDownToClose(onClose: () => void, resetKey: number) {
  const translateY = useSharedValue(0);
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    translateY.value = 0;
  }, [resetKey]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY(12)
        .failOffsetX([-44, 44])
        .onUpdate((e) => {
          translateY.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
          const shouldClose = translateY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY;
          if (shouldClose) {
            translateY.value = withTiming(SCREEN_H, { duration: 240 }, (finished) => {
              if (finished) {
                runOnJS(close)();
              }
            });
          } else {
            translateY.value = withSpring(0, SPRING);
          }
        }),
    [close],
  );

  const dimmerStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: '#000',
    opacity: interpolate(translateY.value, [0, DRAG_MORPH_RANGE + 40], [1, 0], Extrapolation.CLAMP),
  }));

  const mediaShellStyle = useAnimatedStyle(() => {
    const t = interpolate(translateY.value, [0, DRAG_MORPH_RANGE], [0, 1], Extrapolation.CLAMP);
    const w = SCREEN_W + (MORPH_END_SIZE - SCREEN_W) * t;
    const h = SCREEN_H + (MORPH_END_SIZE - SCREEN_H) * t;
    const left = (SCREEN_W - w) / 2;
    const top = translateY.value;
    const borderRadius = t * (Math.min(w, h) / 2);
    return {
      position: 'absolute' as const,
      left,
      top,
      width: w,
      height: h,
      borderRadius,
      overflow: 'hidden' as const,
      zIndex: 1,
    };
  });

  const chromeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, 56], [1, 0], Extrapolation.CLAMP),
  }));

  return { panGesture, dimmerStyle, mediaShellStyle, chromeStyle };
}
