import { BANNER_STRUCTURED_FRAME_H, CARD_W } from '../layout';
import { parseGuestImageUris } from '../parseGuestImageUris';
import {
  FinishedBannerLeftColumn,
  FinishedBannerRightColumn,
} from '../slideColumns/FinishedBannerSlideColumns';
import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function FinishedBannerSlide({ banner }: Props) {
  const coverFb = banner.cover?.trim() ?? '';
  const faces = parseGuestImageUris(banner.guest_images, coverFb);

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <FinishedBannerLeftColumn eventName={banner.name} />
        <FinishedBannerRightColumn faceUris={faces} />
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
