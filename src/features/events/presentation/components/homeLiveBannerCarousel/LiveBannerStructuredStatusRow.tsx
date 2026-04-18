import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const LIVE_ICON = require('@/assets/images/common/live-icon.png');

export function LiveBannerStructuredStatusRow() {
  return (
    <View style={styles.row}>
      <Image source={LIVE_ICON} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>Evento en vivo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 14,
    height: 14,
  },
  label: {
    color: colors.accent[500],
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    fontWeight: '400',
  },
});
