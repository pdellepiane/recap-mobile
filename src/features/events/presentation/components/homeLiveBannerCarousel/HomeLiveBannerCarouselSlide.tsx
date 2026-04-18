import { isEventFinished, isLiveEvent, isNoEvent, isScheduledEvent } from './bannerKind';
import { BANNER_STRUCTURED_FRAME_H, CARD_W, PAGE_W } from './layout';
import {
  FinishedBannerSlide,
  LiveBannerSlide,
  NoBannerSlide,
  ScheduledBannerSlide,
} from './slides';
import type { HomeBannerItem } from '@/src/core/api/types';
import { Pressable, StyleSheet, View } from 'react-native';

export type HomeLiveBannerCarouselSlideProps = {
  banner: HomeBannerItem;
  onPress: () => void;
};

export function HomeLiveBannerCarouselSlide({ banner, onPress }: HomeLiveBannerCarouselSlideProps) {
  return (
    <View style={styles.page}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.slidePage,
          { width: CARD_W, height: BANNER_STRUCTURED_FRAME_H },
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
});
