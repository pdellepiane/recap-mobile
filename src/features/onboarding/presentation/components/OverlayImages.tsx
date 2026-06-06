import type { OverlayImage } from '../data';
import {
  scaleOnboardingImageStyle,
  scaledOnboardingSize,
  useOnboardingScale,
} from '../utils/onboardingLayout';
import { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';

type OverlayImagesProps = {
  overlays: OverlayImage[];
  isFirstSlide: boolean;
  isSecondSlide: boolean;
  isThirdSlide: boolean;
};

export function OverlayImages({
  overlays,
  isFirstSlide,
  isSecondSlide,
  isThirdSlide,
}: OverlayImagesProps) {
  const scale = useOnboardingScale();

  const slideStyles = useMemo(
    () => ({
      firstSlideOverlayTopLeft: {
        top: scaledOnboardingSize(0, scale),
        left: scaledOnboardingSize(80, scale),
      },
      firstSlideOverlayLeft: {
        left: 0,
        bottom: scaledOnboardingSize(50, scale),
      },
      secondSlideOverlayTopLeft: {
        minHeight: scaledOnboardingSize(160, scale),
        minWidth: scaledOnboardingSize(160, scale),
        marginLeft: scaledOnboardingSize(-30, scale),
        marginTop: scaledOnboardingSize(-40, scale),
      },
      secondSlideOverlayCard: {
        minHeight: scaledOnboardingSize(250, scale),
        minWidth: scaledOnboardingSize(250, scale),
        marginBottom: scaledOnboardingSize(-100, scale),
        marginLeft: scaledOnboardingSize(8, scale),
      },
      secondSlideOverlayBottomRight: {
        minHeight: scaledOnboardingSize(130, scale),
        minWidth: scaledOnboardingSize(130, scale),
        marginBottom: scaledOnboardingSize(-120, scale),
      },
      thirdSlideOverlayTop: {
        minWidth: scaledOnboardingSize(100, scale),
        minHeight: scaledOnboardingSize(100, scale),
        marginTop: scaledOnboardingSize(-20, scale),
      },
      thirdSlideOverlayLeft: {
        minWidth: scaledOnboardingSize(150, scale),
        minHeight: scaledOnboardingSize(150, scale),
        marginTop: scaledOnboardingSize(-60, scale),
        marginLeft: scaledOnboardingSize(-5, scale),
      },
      thirdSlideOverlayBottomLeft: {
        minHeight: scaledOnboardingSize(300, scale),
        minWidth: scaledOnboardingSize(300, scale),
        marginLeft: scaledOnboardingSize(-35, scale),
        marginBottom: scaledOnboardingSize(-60, scale),
      },
    }),
    [scale],
  );

  return (
    <>
      {overlays.map((overlay, i) => (
        <Image
          key={i}
          source={overlay.source}
          style={[
            styles.overlayImage,
            overlay.position === 'topLeft' && styles.overlayTopLeft,
            overlay.position === 'left' && styles.overlayLeft,
            isFirstSlide && overlay.position === 'topLeft' && slideStyles.firstSlideOverlayTopLeft,
            isFirstSlide && overlay.position === 'left' && slideStyles.firstSlideOverlayLeft,
            isSecondSlide && i === 0 && slideStyles.secondSlideOverlayTopLeft,
            isSecondSlide && i === 1 && slideStyles.secondSlideOverlayCard,
            isSecondSlide && i === 2 && slideStyles.secondSlideOverlayBottomRight,
            isThirdSlide && i === 0 && slideStyles.thirdSlideOverlayTop,
            isThirdSlide && i === 1 && slideStyles.thirdSlideOverlayLeft,
            isThirdSlide && i === 2 && slideStyles.thirdSlideOverlayBottomLeft,
            scaleOnboardingImageStyle(overlay.style, scale),
          ]}
          resizeMode="contain"
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  overlayImage: {
    position: 'absolute',
    zIndex: 1,
  },
  overlayTopLeft: {
    top: 0,
    left: 0,
  },
  overlayLeft: {
    left: 0,
    bottom: 0,
  },
});
