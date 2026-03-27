import type { OnboardingSlide } from '../data';
import { DecorativeImages } from './DecorativeImages';
import { OverlayImages } from './OverlayImages';
import { SlideMainImage } from './SlideMainImage';
import { colors } from '@/src/ui/colors';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type SlideItemProps = {
  slide: OnboardingSlide;
  width: number;
};

export function SlideItem({ slide, width }: SlideItemProps) {
  const isFirstSlide = slide.id === '1';
  const isSecondSlide = slide.id === '2';
  const isThirdSlide = slide.id === '3';

  return (
    <View style={[styles.slide, { width, backgroundColor: slide.backgroundColor }]}>
      {slide.titlePosition === 'above' && (
        <Text
          style={[
            styles.title,
            isSecondSlide && styles.secondSlideTitle,
            isThirdSlide && styles.thirdSlideTitle,
          ]}
        >
          {slide.title}
        </Text>
      )}
      <View
        style={[
          styles.imageContainer,
          isFirstSlide && styles.firstSlideImageContainer,
          isSecondSlide && styles.secondSlideImageContainer,
          isThirdSlide && styles.thirdSlideImageContainer,
        ]}
      >
        {slide.decorativeImages && <DecorativeImages images={slide.decorativeImages} />}
        <View
          style={[
            styles.mainImageWrapper,
            isFirstSlide && styles.firstSlideMainImageWrapper,
            isSecondSlide && styles.secondSlideMainImageWrapper,
            isThirdSlide && styles.thirdSlideMainImageWrapper,
          ]}
        >
          {slide.overlayImages && (
            <OverlayImages
              overlays={slide.overlayImages}
              isFirstSlide={isFirstSlide}
              isSecondSlide={isSecondSlide}
              isThirdSlide={isThirdSlide}
            />
          )}
          <SlideMainImage
            source={slide.image}
            isFirstSlide={isFirstSlide}
            isSecondSlide={isSecondSlide}
            isThirdSlide={isThirdSlide}
          />
        </View>
      </View>
      {slide.titlePosition === 'below' && (
        <Text style={[styles.title, isFirstSlide && styles.firstSlideTitle]}>{slide.title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingTop: 120,
    paddingBottom: 176,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstSlideImageContainer: {
    maxHeight: 440,
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 28,
  },
  secondSlideImageContainer: {
    flex: 0,
    minHeight: 400,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  thirdSlideImageContainer: {
    flex: 0,
    minHeight: 470,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  mainImageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  firstSlideMainImageWrapper: {
    height: 440,
  },
  secondSlideMainImageWrapper: {
    flex: 0,
    width: '100%',
    height: 400,
    overflow: 'visible',
  },
  thirdSlideMainImageWrapper: {
    flex: 0,
    width: '100%',
    height: 500,
    overflow: 'visible',
  },
  title: {
    textAlign: 'center',
    color: colors.background.primary,
    marginHorizontal: 16,
    fontSize: 36,
    lineHeight: 44,
  },
  firstSlideTitle: {
    fontFamily: fontFamilies.medium,
    maxWidth: 300,
    marginBottom: 8,
  },
  secondSlideTitle: {
    fontFamily: fontFamilies.regular,
    marginTop: 6,
    marginBottom: 16,
  },
  thirdSlideTitle: {
    fontFamily: fontFamilies.regular,
    maxWidth: 300,
    top: 40,
    marginBottom: 8,
  },
});
