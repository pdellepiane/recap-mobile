import { BANNER_STRUCTURED_FRAME_H, CARD_W } from '../layout';
import { NoBannerLeftColumn, NoBannerRightColumn } from '../slideColumns/NoBannerSlideColumns';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

export function NoBannerSlide() {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <NoBannerLeftColumn />
        <NoBannerRightColumn />
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
