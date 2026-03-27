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
  return (
    <Image
      source={source}
      style={[
        styles.mainImage,
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
    width: '100%',
    maxWidth: 280,
    aspectRatio: 1,
    alignSelf: 'flex-end',
  },
  firstSlideMainImage: {},
  secondSlideMainImage: {
    width: 350,
    maxWidth: 350,
    aspectRatio: 1,
  },
  thirdSlideMainImage: {
    width: 380,
    maxWidth: 380,
    aspectRatio: 1162 / 1326,
  },
});
