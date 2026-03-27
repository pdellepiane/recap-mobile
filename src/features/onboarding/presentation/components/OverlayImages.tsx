import type { OverlayImage } from '../data';
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
            isFirstSlide && overlay.position === 'topLeft' && styles.firstSlideOverlayTopLeft,
            isFirstSlide && overlay.position === 'left' && styles.firstSlideOverlayLeft,
            isSecondSlide && i === 0 && styles.secondSlideOverlayTopLeft,
            isSecondSlide && i === 1 && styles.secondSlideOverlayCard,
            isSecondSlide && i === 2 && styles.secondSlideOverlayBottomRight,
            isThirdSlide && i === 0 && styles.thirdSlideOverlayTop,
            isThirdSlide && i === 1 && styles.thirdSlideOverlayLeft,
            isThirdSlide && i === 2 && styles.thirdSlideOverlayBottomLeft,
            overlay.style,
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
  firstSlideOverlayTopLeft: {
    top: 0,
    left: 80,
    zIndex: 2,
  },
  firstSlideOverlayLeft: {
    left: 0,
    bottom: 50,
    zIndex: 2,
  },
  secondSlideOverlayTopLeft: {
    zIndex: 2,
    minHeight: 160,
    minWidth: 160,
    marginLeft: -30,
    marginTop: -40,
  },
  secondSlideOverlayCard: {
    zIndex: 3,
    minHeight: 250,
    minWidth: 250,
    marginBottom: -100,
    marginLeft: 8,
  },
  secondSlideOverlayBottomRight: {
    zIndex: 2,
    minHeight: 130,
    minWidth: 130,
    marginBottom: -120,
  },
  thirdSlideOverlayTop: {
    zIndex: 3,
    minWidth: 100,
    minHeight: 100,
    marginTop: -20,
  },
  thirdSlideOverlayLeft: {
    zIndex: 3,
    minWidth: 150,
    minHeight: 150,
    marginTop: -60,
    marginLeft: -5,
  },
  thirdSlideOverlayBottomLeft: {
    zIndex: 3,
    minHeight: 300,
    minWidth: 300,
    marginLeft: -35,
    marginBottom: -60,
  },
});
