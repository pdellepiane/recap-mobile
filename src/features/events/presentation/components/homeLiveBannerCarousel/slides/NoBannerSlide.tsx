import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { BANNER_STATE1_LEFT, BANNER_STATE1_LOGO, GO_TO_RIGHT_ICON } from '../assets';
import { BANNER_STRUCTURED_FRAME_H, CARD_W, PROMO_RADIUS } from '../layout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

export function NoBannerSlide() {
  return (
    <View style={[styles.root, { borderRadius: PROMO_RADIUS }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Image source={BANNER_STATE1_LEFT} style={styles.leftImage} resizeMode="cover" />
        </View>
        <View style={styles.right}>
          <Text style={styles.title}>Crea tu primer evento en</Text>
          <Image source={BANNER_STATE1_LOGO} style={styles.logo} resizeMode="contain" />
          <HomeBannerCtaPill
            label="IR A CREAR"
            trailingIcon={GO_TO_RIGHT_ICON}
            style={styles.ctaSpacing}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.elevated,
    width: CARD_W,
    height: BANNER_STRUCTURED_FRAME_H,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
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
