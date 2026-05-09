import { HomeBannerCarouselDots } from './homeLiveBannerCarousel/HomeBannerCarouselDots';
import { HomeBannerCarouselSlide } from './homeLiveBannerCarousel/HomeBannerCarouselSlide';
import { PAGE_W, SCREEN_W } from './homeLiveBannerCarousel/layout';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const slides = banners;

  if (slides.length === 0) {
    return null;
  }

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, Math.max(0, slides.length - 1)));
      setActiveIndex(clamped);
      scrollRef.current?.scrollTo({ x: clamped * PAGE_W, animated: true });
    },
    [slides.length],
  );

  const syncIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / PAGE_W);
      const clamped = Math.max(0, Math.min(next, Math.max(0, slides.length - 1)));
      setActiveIndex(clamped);
    },
    [slides.length],
  );

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
        style={styles.scroller}
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
    width: SCREEN_W,
    alignSelf: 'center',
  },
  scrollerContent: {
    alignItems: 'stretch',
  },
});
