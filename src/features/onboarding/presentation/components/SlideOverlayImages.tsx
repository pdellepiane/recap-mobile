import type { OverlayImage } from '../data';
import { Image, StyleSheet } from 'react-native';

type SlideOverlayImagesProps = {
  overlayImages: OverlayImage[];
  isFirstSlide: boolean;
};

export function SlideOverlayImages({ overlayImages, isFirstSlide }: SlideOverlayImagesProps) {
  return (
    <>
      {overlayImages.map((overlay, i) => (
        <Image
          key={i}
          source={overlay.source}
          style={[
            styles.overlayImage,
            overlay.position === 'topLeft' && styles.overlayTopLeft,
            overlay.position === 'left' && styles.overlayLeft,
            isFirstSlide && overlay.position === 'topLeft' && styles.firstSlideOverlayTopLeft,
            isFirstSlide && overlay.position === 'left' && styles.firstSlideOverlayLeft,
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
    bottom: 32,
  },
  firstSlideOverlayTopLeft: {
    top: 42,
    left: 80,
    zIndex: 2,
  },
  firstSlideOverlayLeft: {
    left: 0,
    zIndex: 2,
  },
});
