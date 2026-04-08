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

const LIVE_SLIDE_IMAGES = [
  require('../../../../../assets/images/home-live/live-slide-1.png'),
  require('../../../../../assets/images/home-live/live-slide-2.png'),
  require('../../../../../assets/images/home-live/live-slide-3.png'),
] as const;

function measureSlideHeight(source: number): Promise<number> {
  return new Promise((resolve) => {
    const resolved = Image.resolveAssetSource(source);
    const uri = resolved?.uri;
    if (!uri) {
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
  onSlidePress?: (index: number) => void;
};

/**
 * Horizontal “My live events” carousel (3 design images). Only when there are events from the API.
 */
export function HomeLiveEventsCarousel({ onSlidePress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [frameH, setFrameH] = useState(FALLBACK_FRAME_H);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const heights = await Promise.all(LIVE_SLIDE_IMAGES.map((src) => measureSlideHeight(src)));
      if (cancelled) {
        return;
      }
      const maxH = Math.max(...heights.filter((x) => x > 0), FALLBACK_FRAME_H);
      setFrameH(maxH);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const syncIndex = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / SCREEN_W);
    const clamped = Math.max(0, Math.min(next, LIVE_SLIDE_IMAGES.length - 1));
    setActiveIndex(clamped);
  }, []);

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
        {LIVE_SLIDE_IMAGES.map((source, index) => (
          <Pressable
            key={index}
            onPress={() => onSlidePress?.(index)}
            style={({ pressed }) => [
              styles.slidePage,
              { width: SLIDE_W, height: frameH },
              pressed && styles.slidePressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Evento en vivo, diapositiva ${String(index + 1)} de ${String(LIVE_SLIDE_IMAGES.length)}`}
          >
            <View
              style={[
                styles.imageRoundedClip,
                { width: SLIDE_W, height: frameH, borderRadius: IMAGE_RADIUS },
              ]}
            >
              <Image
                source={source}
                style={{ width: SLIDE_W, height: frameH }}
                resizeMode="cover"
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {LIVE_SLIDE_IMAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
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
