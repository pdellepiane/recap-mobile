import { LiveBannerLeftColumn } from '../LiveBannerLeftColumn';
import { BANNER_STRUCTURED_FRAME_H, CARD_W } from '../layout';
import { LiveBannerRightColumn } from '../slideColumns/LiveBannerSlideColumns';
import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function LiveBannerSlide({ banner }: Props) {
  const coverUri = banner.cover?.trim() ?? '';
  const circleD = Math.round(Math.min(120, BANNER_STRUCTURED_FRAME_H * 0.58));

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <LiveBannerLeftColumn coverUri={coverUri} avatarDiameter={circleD} />
        <LiveBannerRightColumn eventName={banner.name} />
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
    borderRadius: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
