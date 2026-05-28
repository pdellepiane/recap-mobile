import { BannerLayoutProvider, useBannerLayout } from './homeLiveBannerCarousel/BannerLayoutContext';
import { HomeBannerCarouselDots } from './homeLiveBannerCarousel/HomeBannerCarouselDots';
import { HomeBannerCarouselSlide } from './homeLiveBannerCarousel/HomeBannerCarouselSlide';
import type { HomeBannerItem } from '@/src/core/api/types';
import { useCallback, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type Props = {
  banners: HomeBannerItem[];
  onSlidePress?: (index: number) => void;
};

export function HomeBannerCarousel({ banners, onSlidePress }: Props) {
  return (
    <BannerLayoutProvider>
      <HomeBannerCarouselInner banners={banners} onSlidePress={onSlidePress} />
    </BannerLayoutProvider>
  );
}

function HomeBannerCarouselInner({ banners, onSlidePress }: Props) {
  const { pageWidth, screenWidth } = useBannerLayout();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const slides = banners;

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, Math.max(0, slides.length - 1)));
      setActiveIndex(clamped);
      scrollRef.current?.scrollTo({ x: clamped * pageWidth, animated: true });
    },
    [pageWidth, slides.length],
  );

  const syncIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / pageWidth);
      const clamped = Math.max(0, Math.min(next, Math.max(0, slides.length - 1)));
      setActiveIndex(clamped);
    },
    [pageWidth, slides.length],
  );

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap} accessibilityRole="none">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        nestedScrollEnabled
        onScroll={syncIndex}
        onMomentumScrollEnd={syncIndex}
        scrollEventThrottle={16}
        style={[styles.scroller, { width: screenWidth }]}
        contentContainerStyle={styles.scrollerContent}
      >
        {slides.map((banner, index) => (
          <HomeBannerCarouselSlide
            key={`${String(banner.id)}-${String(index)}`}
            banner={banner}
            onPress={() => onSlidePress?.(index)}
          />
        ))}
      </ScrollView>

      {slides.length > 1 && (
        <HomeBannerCarouselDots
          count={slides.length}
          activeIndex={activeIndex}
          onDotPress={goToSlide}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 8,
  },
  scroller: {
    alignSelf: 'center',
  },
  scrollerContent: {
    alignItems: 'stretch',
  },
});
