import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Reference usable height (iPhone 14/15 class, minus typical safe areas). */
const REFERENCE_CONTENT_HEIGHT = 760;
const MIN_SCALE = 0.74;
const MAX_SCALE = 1;

export function useChallengeFlowScale(): number {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const contentHeight = height - insets.top - insets.bottom;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, contentHeight / REFERENCE_CONTENT_HEIGHT));
  }, [height, insets.bottom, insets.top]);
}

export function scaledChallengeSize(base: number, scale: number): number {
  return Math.round(base * scale);
}
