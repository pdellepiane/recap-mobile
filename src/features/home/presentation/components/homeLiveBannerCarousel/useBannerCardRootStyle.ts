import { useBannerLayout } from './BannerLayoutContext';
import { BANNER_STRUCTURED_FRAME_H } from './layout';
import { colors } from '@/src/ui';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

/** Shared structured banner card shell (width tracks window size). */
export function useBannerCardRootStyle() {
  const { cardWidth } = useBannerLayout();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: colors.background.elevated,
          width: cardWidth,
          height: BANNER_STRUCTURED_FRAME_H,
          overflow: 'hidden',
          borderRadius: 16,
        },
        row: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
        },
      }),
    [cardWidth],
  );
}
