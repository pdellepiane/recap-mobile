import { images } from '@/src/assets/images';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { CARD_W } from '../layout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export function NoBannerLeftColumn() {
  return (
    <View style={styles.left}>
      <Image source={images.homeBanner.state1.left} style={styles.leftImage} resizeMode="cover" />
    </View>
  );
}

export function NoBannerRightColumn() {
  return (
    <View style={styles.right}>
      <Text style={styles.title}>Crea tu primer evento en</Text>
      <Image source={images.homeBanner.state1.logo} style={styles.logo} resizeMode="contain" />
      <HomeBannerCtaPill
        label="IR A CREAR"
        trailingIcon={images.common.goToRight}
        style={styles.ctaSpacing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    width: Math.round(CARD_W * 0.46),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftImage: {
    width: '100%',
    height: '100%',
  },
  right: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 16,
    left: -20,
  },
  title: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 28,
  },
  logo: {
    width: 168,
    height: 36,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});
