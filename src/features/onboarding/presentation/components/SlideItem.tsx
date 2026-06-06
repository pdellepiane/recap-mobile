import type { OnboardingSlide } from '../data';
import { scaledOnboardingSize, useOnboardingScale } from '../utils/onboardingLayout';
import { DecorativeImages } from './DecorativeImages';
import { OverlayImages } from './OverlayImages';
import { SlideMainImage } from './SlideMainImage';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui/colors';
import { fontFamilies } from '@/src/ui/typography';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SlideItemProps = {
  slide: OnboardingSlide;
  width: number;
};

export function SlideItem({ slide, width }: SlideItemProps) {
  const { t } = useTranslation();
  const scale = useOnboardingScale();
  const title = t(slide.titleKey);
  const isFirstSlide = slide.id === '1';
  const isSecondSlide = slide.id === '2';
  const isThirdSlide = slide.id === '3';

  const layout = useMemo(
    () => ({
      slidePaddingTop: scaledOnboardingSize(120, scale),
      slidePaddingBottom: scaledOnboardingSize(176, scale),
      titleFontSize: scaledOnboardingSize(36, scale),
      titleLineHeight: scaledOnboardingSize(44, scale),
      titleMarginHorizontal: scaledOnboardingSize(16, scale),
      titleMaxWidth: scaledOnboardingSize(300, scale),
      firstSlideMaxHeight: scaledOnboardingSize(440, scale),
      firstSlideMarginTop: scaledOnboardingSize(6, scale),
      firstSlideMarginBottom: scaledOnboardingSize(28, scale),
      secondSlideMinHeight: scaledOnboardingSize(400, scale),
      thirdSlideMinHeight: scaledOnboardingSize(470, scale),
      thirdSlideMarginTop: scaledOnboardingSize(8, scale),
      thirdSlideMainHeight: scaledOnboardingSize(500, scale),
      secondSlideTitleMarginTop: scaledOnboardingSize(6, scale),
      secondSlideTitleMarginBottom: scaledOnboardingSize(16, scale),
      thirdSlideTitleTop: scaledOnboardingSize(40, scale),
      thirdSlideTitleMarginBottom: scaledOnboardingSize(8, scale),
      firstSlideTitleMarginTop: scaledOnboardingSize(-50, scale),
      firstSlideTitleMarginBottom: scaledOnboardingSize(32, scale),
    }),
    [scale],
  );

  return (
    <View
      style={[
        styles.slide,
        {
          width,
          backgroundColor: slide.backgroundColor,
          paddingTop: layout.slidePaddingTop,
          paddingBottom: isFirstSlide
            ? scaledOnboardingSize(200, scale)
            : layout.slidePaddingBottom,
          justifyContent: isFirstSlide ? 'flex-start' : 'center',
        },
      ]}
    >
      {slide.titlePosition === 'above' && (
        <Text
          style={[
            styles.title,
            {
              fontSize: layout.titleFontSize,
              lineHeight: layout.titleLineHeight,
              marginHorizontal: layout.titleMarginHorizontal,
            },
            isSecondSlide && {
              marginTop: layout.secondSlideTitleMarginTop,
              marginBottom: layout.secondSlideTitleMarginBottom,
            },
            isThirdSlide && {
              maxWidth: layout.titleMaxWidth,
              top: layout.thirdSlideTitleTop,
              marginBottom: layout.thirdSlideTitleMarginBottom,
            },
          ]}
        >
          {title}
        </Text>
      )}
      <View
        style={[
          styles.imageContainer,
          isFirstSlide && {
            flex: 0,
            maxHeight: layout.firstSlideMaxHeight,
            marginTop: layout.firstSlideMarginTop,
            marginBottom: layout.firstSlideMarginBottom,
            alignItems: 'flex-start',
          },
          isSecondSlide && {
            flex: 0,
            minHeight: layout.secondSlideMinHeight,
            alignItems: 'center',
          },
          isThirdSlide && {
            flex: 0,
            minHeight: layout.thirdSlideMinHeight,
            marginTop: layout.thirdSlideMarginTop,
            alignItems: 'center',
          },
        ]}
      >
        {slide.decorativeImages && <DecorativeImages images={slide.decorativeImages} />}
        <View
          style={[
            styles.mainImageWrapper,
            isFirstSlide && { flex: 0, height: layout.firstSlideMaxHeight },
            isSecondSlide && {
              flex: 0,
              width: '100%',
              height: layout.secondSlideMinHeight,
              overflow: 'visible',
            },
            isThirdSlide && {
              flex: 0,
              width: '100%',
              height: layout.thirdSlideMainHeight,
              overflow: 'visible',
            },
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
        <Text
          style={[
            styles.title,
            styles.titleBelow,
            {
              fontSize: layout.titleFontSize,
              lineHeight: layout.titleLineHeight,
              marginHorizontal: layout.titleMarginHorizontal,
            },
            isFirstSlide && {
              fontFamily: fontFamilies.medium,
              maxWidth: layout.titleMaxWidth,
              marginTop: layout.firstSlideTitleMarginTop,
              marginBottom: layout.firstSlideTitleMarginBottom,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
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
  mainImageWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    color: colors.background.primary,
    fontFamily: fontFamilies.regular,
  },
  titleBelow: {
    flexShrink: 0,
    zIndex: 2,
  },
});
