import { Image, StyleSheet } from "react-native";

import type { OverlayImage } from "../hooks/useOnboarding";

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
            overlay.position === "topLeft" && styles.overlayTopLeft,
            overlay.position === "left" && styles.overlayLeft,
            isFirstSlide &&
              overlay.position === "topLeft" &&
              styles.firstSlideOverlayTopLeft,
            isFirstSlide &&
              overlay.position === "left" &&
              styles.firstSlideOverlayLeft,
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
    position: "absolute",
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
    top: 42,
    left: 80,
    zIndex: 2,
  },
  firstSlideOverlayLeft: {
    left: 0,
    zIndex: 2,
  },
  secondSlideOverlayTopLeft: {
    zIndex: 2,
  },
  secondSlideOverlayCard: {
    zIndex: 3,
  },
  secondSlideOverlayBottomRight: {
    zIndex: 2,
  },
  thirdSlideOverlayTop: {
    zIndex: 3,
  },
  thirdSlideOverlayLeft: {
    zIndex: 3,
  },
  thirdSlideOverlayBottomLeft: {
    zIndex: 3,
  },
});
