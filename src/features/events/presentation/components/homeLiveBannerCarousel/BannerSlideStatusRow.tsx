import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

export type BannerSlideStatusRowProps = {
  icon: ImageSourcePropType;
  label: string;
  variant: 'scheduled' | 'live';
};

export function BannerSlideStatusRow({ icon, label, variant }: BannerSlideStatusRowProps) {
  const isLive = variant === 'live';

  return (
    <View style={styles.row}>
      <Image source={icon} style={isLive ? styles.iconLive : styles.iconScheduled} resizeMode="contain" />
      <Text style={[styles.label, isLive ? styles.labelLive : styles.labelScheduled]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconScheduled: {
    width: 16,
    height: 16,
  },
  iconLive: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 14,
  },
  labelScheduled: {
    color: colors.states.warning,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
  labelLive: {
    color: colors.accent[500],
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
