import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet } from "react-native";

type SlideMainImageProps = {
  source: ImageSourcePropType;
  hasOverlays: boolean;
  isFirstSlide: boolean;
  isSecondSlide: boolean;
  isThirdSlide: boolean;
};

export function SlideMainImage({
  source,
  hasOverlays,
  isFirstSlide,
  isSecondSlide,
  isThirdSlide,
}: SlideMainImageProps) {
  return (
    <Image
      source={source}
      style={[
        styles.mainImage,
        hasOverlays &&
          !isSecondSlide &&
          !isThirdSlide &&
          styles.mainImageTilted,
        isFirstSlide && styles.firstSlideMainImage,
        isSecondSlide && styles.secondSlideMainImage,
        isThirdSlide && styles.thirdSlideMainImage,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  mainImage: {
    width: "100%",
    maxWidth: 280,
    aspectRatio: 1,
  },
  mainImageTilted: {
    transform: [{ rotate: "5deg" }],
  },
  firstSlideMainImage: {
    position: "absolute",
    right: 0,
  },
  secondSlideMainImage: {
    width: 260,
    maxWidth: 260,
    aspectRatio: 1,
    alignSelf: "center",
    marginTop: 24,
  },
  thirdSlideMainImage: {
    width: 314,
    maxWidth: 314,
    aspectRatio: 1162 / 1326,
    marginTop: 108,
    marginLeft: 18,
  },
});
