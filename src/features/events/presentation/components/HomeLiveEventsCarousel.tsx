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
  Text,
  View,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
/** Symmetric horizontal inset so one card is visible per page (matches home gutter). */
const HORIZONTAL_INSET = 20;
/** Visible card width inside each full-width page. */
const CARD_W = SCREEN_W - 2 * HORIZONTAL_INSET;
/** One ScrollView “page” per slide — must equal viewport width for `pagingEnabled` to show a single slide. */
const PAGE_W = SCREEN_W;
/** Subtracted from measured / aspect-ratio height (tighter card). */
const CAROUSEL_HEIGHT_TRIM = 60;
const RAW_FALLBACK_FRAME_H = Math.round(CARD_W / 2.15);
const FALLBACK_FRAME_H = Math.max(1, RAW_FALLBACK_FRAME_H - CAROUSEL_HEIGHT_TRIM);
const IMAGE_RADIUS = 20;

function getBannerTopPresentation(bannerType: string): {
  showLiveDot: boolean;
  label: string;
  labelColor: string;
} {
  switch (bannerType) {
    case 'event_live':
      return {
        showLiveDot: true,
        label: 'Evento en vivo',
        labelColor: colors.states.active,
      };
    case 'event_to_start':
      return {
        showLiveDot: false,
        label: 'Próximo evento',
        labelColor: colors.accent[400],
      };
    case 'event_finished':
      return {
        showLiveDot: false,
        label: 'Evento finalizado',
        labelColor: colors.neutral.secondary,
      };
    default:
      return {
        showLiveDot: false,
        label: 'Evento',
        labelColor: colors.neutral.primary,
      };
  }
}

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
          resolve(Math.round((CARD_W * imgH) / imgW));
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
      const maxRaw = Math.max(...heights.filter((x) => x > 0), RAW_FALLBACK_FRAME_H);
      setFrameH(Math.max(1, maxRaw - CAROUSEL_HEIGHT_TRIM));
    })();
    return () => {
      cancelled = true;
    };
  }, [banners]);

  const syncIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const next = Math.round(x / PAGE_W);
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
        {banners.map((banner, index) => {
          const top = getBannerTopPresentation(banner.banner_type);
          return (
            <View key={`${String(banner.id)}-${String(index)}`} style={styles.page}>
              <Pressable
                onPress={() => onSlidePress?.(index)}
                style={({ pressed }) => [
                  styles.slidePage,
                  { width: CARD_W, height: frameH },
                  pressed && styles.slidePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${banner.name}, banner ${String(index + 1)} of ${String(banners.length)}, ${banner.banner_type}. Ingresar`}
              >
                <View
                  style={[
                    styles.imageRoundedClip,
                    { width: CARD_W, height: frameH, borderRadius: IMAGE_RADIUS },
                  ]}
                >
                  {banner.cover?.trim() ? (
                    <Image
                      source={{ uri: banner.cover.trim() }}
                      style={{ width: CARD_W, height: frameH }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.coverPlaceholder, { width: CARD_W, height: frameH }]} />
                  )}
                <View style={styles.coverBottomScrim} pointerEvents="none" />
                <View style={styles.coverOverlay} pointerEvents="none">
                  <View style={styles.liveLabelRow}>
                    {top.showLiveDot ? (
                      <View style={styles.liveDotOuter}>
                        <View style={styles.liveDotInner} />
                      </View>
                    ) : null}
                    <Text style={[styles.liveLabelText, { color: top.labelColor }]}>{top.label}</Text>
                  </View>
                  <Text style={styles.bannerTitle} numberOfLines={1} ellipsizeMode="tail">
                    {banner.name}
                  </Text>
                  <View style={styles.ingresarPill}>
                    <Text style={styles.ingresarText}>INGRESAR</Text>
                    <Text style={styles.ingresarArrow}>→</Text>
                  </View>
                </View>
              </View>
              </Pressable>
            </View>
          );
        })}
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
    alignItems: 'stretch',
  },
  /** Full viewport width per snap — centers the narrower card so only one slide shows. */
  page: {
    width: PAGE_W,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidePage: {
    backgroundColor: 'transparent',
  },
  imageRoundedClip: {
    overflow: 'hidden',
    position: 'relative',
  },
  coverBottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: colors.overlay.black45,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  liveLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  liveDotOuter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.accent[700],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  liveDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent[500],
  },
  liveLabelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bannerTitle: {
    color: colors.neutral.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textShadowColor: colors.overlay.black70,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  ingresarPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent[500],
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  ingresarText: {
    color: colors.neutral.onLime,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  ingresarArrow: {
    color: colors.neutral.onLime,
    fontSize: 16,
    fontWeight: '700',
    marginTop: -1,
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
