import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export function LiveBannerStructuredStatusRow() {
  return (
    <View style={styles.row}>
      <Image source={images.common.live} style={styles.icon} resizeMode="contain" />
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
