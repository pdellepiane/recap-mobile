import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const HOME_CONTENT_INSET_LEFT = 20;
/** Slide width: flush to the right edge, no right horizontal padding (same as `HomeFeedCarouselSections`). */
const SLIDE_W = SCREEN_W - HOME_CONTENT_INSET_LEFT;
const FALLBACK_FRAME_H = Math.round(SLIDE_W / 2.15);
const IMAGE_RADIUS = 20;

function measureSlideHeightFromUri(uri: string): Promise<number> {
  return new Promise((resolve) => {
    if (!uri?.trim()) {
      resolve(0);
      return;
    }
    Image.getSize(
      uri,
      (imgW, imgH) => {
        if (imgW > 0 && imgH > 0) {
          resolve(Math.round((SLIDE_W * imgH) / imgW));
        } else {
          resolve(0);
        }
      },
      () => resolve(0),
    );
  });
}

type Props = {
  banners: HomeBannerItem[];
  onSlidePress?: (index: number) => void;
};

/**
 * Horizontal home banner slider driven by GET /api/home/banners (`cover` + `banner_type`).
 */
export function HomeLiveEventsCarousel({ banners, onSlidePress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [frameH, setFrameH] = useState(FALLBACK_FRAME_H);

  useEffect(() => {
    if (banners.length === 0) {
      return;
    }
    let cancelled = false;
    void (async () => {
      const heights = await Promise.all(banners.map((b) => measureSlideHeightFromUri(b.cover)));
      if (cancelled) {
        return;
      }
      const maxH = Math.max(...heights.filter((x) => x > 0), FALLBACK_FRAME_H);
      setFrameH(maxH);
    })();
    return () => {
      cancelled = true;
    };
  }, [banners]);

  const syncIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / SLIDE_W);
      const clamped = Math.max(0, Math.min(next, Math.max(0, banners.length - 1)));
      setActiveIndex(clamped);
    },
    [banners.length],
  );

  if (banners.length === 0) {
    return null;
  }

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
        {banners.map((banner, index) => (
          <Pressable
            key={`${String(banner.id)}-${String(index)}`}
            onPress={() => onSlidePress?.(index)}
            style={({ pressed }) => [
              styles.slidePage,
              { width: SLIDE_W, height: frameH },
              pressed && styles.slidePressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${banner.name}, banner ${String(index + 1)} of ${String(banners.length)}, ${banner.banner_type}`}
          >
            <View
              style={[
                styles.imageRoundedClip,
                { width: SLIDE_W, height: frameH, borderRadius: IMAGE_RADIUS },
              ]}
            >
              {banner.cover?.trim() ? (
                <Image
                  source={{ uri: banner.cover.trim() }}
                  style={{ width: SLIDE_W, height: frameH }}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.coverPlaceholder, { width: SLIDE_W, height: frameH }]} />
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View key={`dot-${String(i)}`} style={[styles.dot, i === activeIndex && styles.dotActive]} />
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
    paddingLeft: HOME_CONTENT_INSET_LEFT,
    alignItems: 'center',
  },
  slidePage: {
    backgroundColor: 'transparent',
  },
  imageRoundedClip: {
    overflow: 'hidden',
  },
  coverPlaceholder: {
    backgroundColor: colors.background.tertiary,
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
