import { useBannerCardRootStyle } from '../useBannerCardRootStyle';
import { BANNER_STRUCTURED_FRAME_H } from '../layout';
import {
  ScheduledBannerLeftColumn,
  ScheduledBannerRightColumn,
} from '../slideColumns/ScheduledBannerSlideColumns';
import type { HomeBannerItem } from '@/src/core/api/types';
import { View } from 'react-native';

type Props = {
  banner: HomeBannerItem;
};

export function ScheduledBannerSlide({ banner }: Props) {
  const styles = useBannerCardRootStyle();
  const coverUri = banner.cover?.trim() ?? '';
  const circleD = Math.round(Math.min(120, BANNER_STRUCTURED_FRAME_H * 0.54));

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <ScheduledBannerLeftColumn coverUri={coverUri} circleDiameter={circleD} />
        <ScheduledBannerRightColumn eventName={banner.name} />
      </View>
    </View>
  );
}
