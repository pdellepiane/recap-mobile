import { useBannerCardRootStyle } from '../useBannerCardRootStyle';
import { parseGuestImageUris } from '../parseGuestImageUris';
import {
  FinishedBannerLeftColumn,
  FinishedBannerRightColumn,
} from '../slideColumns/FinishedBannerSlideColumns';
import type { HomeBannerItem } from '@/src/core/api/types';
import { View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function FinishedBannerSlide({ banner }: Props) {
  const styles = useBannerCardRootStyle();
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
