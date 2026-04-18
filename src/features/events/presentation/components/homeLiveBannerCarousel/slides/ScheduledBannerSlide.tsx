import { BannerSlideCoverCircle } from '../BannerSlideCoverCircle';
import { BannerSlideStatusRow } from '../BannerSlideStatusRow';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { BANNER_STATE2_DECOR, GO_TO_RIGHT_ICON, SCHEDULED_ICON } from '../assets';
import { BANNER_STRUCTURED_FRAME_H, CARD_W, PROMO_RADIUS } from '../layout';
import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function ScheduledBannerSlide({ banner }: Props) {
  const coverUri = banner.cover?.trim() ?? '';
  const circleD = Math.round(Math.min(120, BANNER_STRUCTURED_FRAME_H * 0.54));

  return (
    <View style={[styles.root, { borderRadius: PROMO_RADIUS }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Image source={BANNER_STATE2_DECOR} style={styles.leftImage} resizeMode="cover" />
          <BannerSlideCoverCircle diameter={circleD} uri={coverUri} variant="scheduled" />
        </View>
        <View style={styles.right}>
          <BannerSlideStatusRow
            icon={SCHEDULED_ICON}
            label="Evento por iniciar"
            variant="scheduled"
          />
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {banner.name}
          </Text>
          <HomeBannerCtaPill
            label="INGRESAR"
            trailingIcon={GO_TO_RIGHT_ICON}
            style={styles.ctaSpacing}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.elevated,
    width: CARD_W,
    height: BANNER_STRUCTURED_FRAME_H,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  left: {
    width: Math.round(CARD_W * 0.46),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftImage: {
    ...StyleSheet.absoluteFillObject,
    width: Math.round(CARD_W * 0.48),
    height: BANNER_STRUCTURED_FRAME_H,
  },
  right: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 16,
    left: -20,
  },
  title: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});
