import { useBannerCardRootStyle } from '../useBannerCardRootStyle';
import { LiveBannerLeftColumn } from '../LiveBannerLeftColumn';
import { BANNER_STRUCTURED_FRAME_H } from '../layout';
import { LiveBannerRightColumn } from '../slideColumns/LiveBannerSlideColumns';
import type { HomeBannerItem } from '@/src/core/api/types';
import { View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function LiveBannerSlide({ banner }: Props) {
  const styles = useBannerCardRootStyle();
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
