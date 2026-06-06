import { useMemo } from 'react';
import type { ImageStyle } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Reference usable height (iPhone 14/15 class, minus typical safe areas). */
const REFERENCE_CONTENT_HEIGHT = 760;
const MIN_SCALE = 0.72;
const MAX_SCALE = 1;

const SCALABLE_IMAGE_STYLE_KEYS = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'top',
  'left',
  'right',
  'bottom',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
] as const satisfies readonly (keyof ImageStyle)[];

export function useOnboardingScale(): number {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const contentHeight = height - insets.top - insets.bottom;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, contentHeight / REFERENCE_CONTENT_HEIGHT));
  }, [height, insets.bottom, insets.top]);
}

export function scaledOnboardingSize(base: number, scale: number): number {
  return Math.round(base * scale);
}

/** Scale numeric dimensions in overlay image styles from slide data. */
export function scaleOnboardingImageStyle(
  style: ImageStyle | undefined,
  scale: number,
): ImageStyle | undefined {
  if (!style) {
    return undefined;
  }

  const scaled = { ...style } as ImageStyle;
  for (const key of SCALABLE_IMAGE_STYLE_KEYS) {
    const value = scaled[key];
    if (typeof value === 'number') {
      (scaled as Record<string, number>)[key] = scaledOnboardingSize(value, scale);
    }
  }
  return scaled;
}
