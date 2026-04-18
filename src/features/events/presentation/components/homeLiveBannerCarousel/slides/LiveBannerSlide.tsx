import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { LiveBannerLeftArtwork } from '../LiveBannerLeftArtwork';
import { LiveBannerStructuredStatusRow } from '../LiveBannerStructuredStatusRow';
import { GO_TO_RIGHT_ICON } from '../assets';
import { BANNER_STRUCTURED_FRAME_H, CARD_W, LIVE_BANNER_RADIUS } from '../layout';
import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function LiveBannerSlide({ banner }: Props) {
  const coverUri = banner.cover?.trim() ?? '';
  const circleD = Math.round(Math.min(120, BANNER_STRUCTURED_FRAME_H * 0.54));

  return (
    <View style={[styles.root, { borderRadius: LIVE_BANNER_RADIUS }]}>
      <View style={styles.row}>
        <LiveBannerLeftArtwork coverUri={coverUri} avatarDiameter={circleD} />
        <View style={styles.right}>
          <LiveBannerStructuredStatusRow />
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {banner.name}
          </Text>
          <HomeBannerCtaPill
            label="INGRESAR"
            trailingIcon={GO_TO_RIGHT_ICON}
            appearance="liveBanner"
            style={styles.cta}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.tertiary,
    width: CARD_W,
    height: BANNER_STRUCTURED_FRAME_H,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 8,
    paddingRight: 16,
    gap: 14,
  },
  title: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.25,
  },
  cta: {
    marginTop: 2,
  },
});
