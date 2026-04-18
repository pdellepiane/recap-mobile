import {
  isBannerFinished,
  isBannerState2,
  isBannerState3Live,
  noBanner,
} from './homeLiveBannerCarousel/bannerKind';
import { getBannerTopPresentation } from './homeLiveBannerCarousel/getBannerTopPresentation';
import { NO_EVENT_CAROUSEL_FALLBACK } from './homeLiveBannerCarousel/noEventFallbackBanner';
import {
  BANNER_STRUCTURED_FRAME_H,
  CARD_W,
  PAGE_W,
  SCREEN_W,
} from './homeLiveBannerCarousel/layout';
import {
  EventBannerSlide,
  FinishedBannerSlide,
  LiveBannerSlide,
  NoBannerSlide,
  ScheduledBannerSlide,
} from './homeLiveBannerCarousel/slides';
import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { useCallback, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

type Props = {
  banners: HomeBannerItem[];
  onSlidePress?: (index: number) => void;
};

/**
 * Horizontal home banner slider driven by GET /api/home/banners (`cover` + `banner_type`).
 * If the API returns no rows, shows a single {@link NoBannerSlide} via {@link NO_EVENT_CAROUSEL_FALLBACK}.
 * Slide layouts live under {@link ./homeLiveBannerCarousel/slides}.
 */
export function HomeLiveEventsCarousel({ banners, onSlidePress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = banners.length > 0 ? banners : [NO_EVENT_CAROUSEL_FALLBACK];

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
          <View key={`${String(banner.id)}-${String(index)}`} style={styles.page}>
            <Pressable
              onPress={() => onSlidePress?.(index)}
              style={({ pressed }) => [
                styles.slidePage,
                { width: CARD_W, height: BANNER_STRUCTURED_FRAME_H },
                pressed && styles.slidePressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                noBanner(banner)
                  ? 'Crea tu primer evento en sin envolturas. Ir a crear.'
                  : isBannerFinished(banner)
                    ? `${banner.name}. Recuerdo. Ver recuerdo.`
                    : `${banner.name}, banner ${String(index + 1)} of ${String(slides.length)}, ${banner.banner_type}. Ingresar`
              }
            >
              {noBanner(banner) ? (
                <NoBannerSlide />
              ) : isBannerState2(banner) ? (
                <ScheduledBannerSlide banner={banner} />
              ) : isBannerState3Live(banner) ? (
                <LiveBannerSlide banner={banner} />
              ) : isBannerFinished(banner) ? (
                <FinishedBannerSlide
                  banner={banner}
                  width={CARD_W}
                  height={BANNER_STRUCTURED_FRAME_H}
                />
              ) : (
                <EventBannerSlide
                  banner={banner}
                  width={CARD_W}
                  height={BANNER_STRUCTURED_FRAME_H}
                  top={getBannerTopPresentation(banner.banner_type)}
                />
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={`dot-${String(i)}`}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
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
  page: {
    width: PAGE_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidePage: {
    backgroundColor: 'transparent',
  },
  slidePressed: {
    opacity: 0.94,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.events.carouselDotInactive,
  },
  dotActive: {
    backgroundColor: colors.states.active,
    width: 22,
    borderRadius: 4,
  },
});
