import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GO_TO_RIGHT_ICON } from '../assets';
import type { BannerTopPresentation } from '../getBannerTopPresentation';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { IMAGE_RADIUS } from '../layout';

type Props = {
  banner: HomeBannerItem;
  width: number;
  height: number;
  top: BannerTopPresentation;
};

export function EventBannerSlide({ banner, width, height, top }: Props) {
  return (
    <View style={[styles.imageRoundedClip, { width, height, borderRadius: IMAGE_RADIUS }]}>
      {banner.cover?.trim() ? (
        <Image
          source={{ uri: banner.cover.trim() }}
          style={{ width, height }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.coverPlaceholder, { width, height }]} />
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
        <HomeBannerCtaPill label="INGRESAR" trailingIcon={GO_TO_RIGHT_ICON} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  coverPlaceholder: {
    backgroundColor: colors.background.tertiary,
  },
});
