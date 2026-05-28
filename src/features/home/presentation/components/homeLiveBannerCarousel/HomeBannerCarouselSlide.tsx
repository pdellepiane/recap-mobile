import { useBannerLayout } from './BannerLayoutContext';
import { isEventFinished, isLiveEvent, isNoEvent, isScheduledEvent } from './bannerKind';
import { BANNER_STRUCTURED_FRAME_H } from './layout';
import {
  FinishedBannerSlide,
  LiveBannerSlide,
  NoBannerSlide,
  ScheduledBannerSlide,
} from './slides';
import type { HomeBannerItem } from '@/src/core/api/types';
import { Pressable, StyleSheet, View } from 'react-native';

export type HomeBannerCarouselSlideProps = {
  banner: HomeBannerItem;
  onPress: () => void;
};

export function HomeBannerCarouselSlide({ banner, onPress }: HomeBannerCarouselSlideProps) {
  const { cardWidth, pageWidth } = useBannerLayout();

  return (
    <View style={[styles.page, { width: pageWidth }]}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.slidePage,
          { width: cardWidth, height: BANNER_STRUCTURED_FRAME_H },
          pressed && styles.slidePressed,
        ]}
        accessibilityRole="button"
      >
        {isNoEvent(banner) ? (
          <NoBannerSlide />
        ) : isScheduledEvent(banner) ? (
          <ScheduledBannerSlide banner={banner} />
        ) : isLiveEvent(banner) ? (
          <LiveBannerSlide banner={banner} />
        ) : isEventFinished(banner) ? (
          <FinishedBannerSlide banner={banner} />
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidePage: {
    backgroundColor: 'transparent',
  },
  slidePressed: {
    opacity: 0.94,
  },
});
