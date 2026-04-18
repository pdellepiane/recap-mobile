import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

/** Live dot + “Evento en vivo” for the structured live banner (matches banner-state-3 spec). */
export function LiveBannerStructuredStatusRow() {
  return (
    <View style={styles.row}>
      <View style={styles.dotOuter}>
        <View style={styles.dotInner} />
      </View>
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
  dotOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.events.homeBannerLiveDotHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.events.homeBannerLiveLime,
  },
  label: {
    color: colors.events.homeBannerLiveLime,
    fontFamily: fontFamilies.signikaMedium,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.15,
  },
});
