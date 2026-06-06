import {
  scaledOnboardingSize,
  useOnboardingScale,
} from '../utils/onboardingLayout';
import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet } from 'react-native';

type SlideMainImageProps = {
  source: ImageSourcePropType;
  isFirstSlide: boolean;
  isSecondSlide: boolean;
  isThirdSlide: boolean;
};

export function SlideMainImage({
  source,
  isFirstSlide,
  isSecondSlide,
  isThirdSlide,
}: SlideMainImageProps) {
  const scale = useOnboardingScale();

  const imageStyle = useMemo(() => {
    const base = {
      width: '100%' as const,
      alignSelf: 'flex-end' as const,
    };

    if (isSecondSlide) {
      const size = scaledOnboardingSize(350, scale);
      return { ...base, width: size, maxWidth: size, aspectRatio: 1 };
    }

    if (isThirdSlide) {
      const size = scaledOnboardingSize(380, scale);
      return { ...base, width: size, maxWidth: size, aspectRatio: 1162 / 1326 };
    }

    const size = scaledOnboardingSize(280, scale);
    return { ...base, maxWidth: size, aspectRatio: 1 };
  }, [isSecondSlide, isThirdSlide, scale]);

  return <Image source={source} style={[styles.mainImage, imageStyle]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  mainImage: {},
});
