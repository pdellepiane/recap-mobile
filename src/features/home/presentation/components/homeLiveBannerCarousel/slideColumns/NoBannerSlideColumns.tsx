import { useBannerLayout } from '../BannerLayoutContext';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export function NoBannerLeftColumn() {
  const { cardWidth } = useBannerLayout();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        left: {
          width: Math.round(cardWidth * 0.46),
          justifyContent: 'center',
          alignItems: 'center',
        },
        leftImage: {
          width: '100%',
          height: '100%',
        },
      }),
    [cardWidth],
  );

  return (
    <View style={styles.left}>
      <Image source={images.homeBanner.state1.left} style={styles.leftImage} resizeMode="cover" />
    </View>
  );
}

const rightStyles = StyleSheet.create({
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

export function NoBannerRightColumn() {
  const { t } = useTranslation();

  return (
    <View style={rightStyles.right}>
      <Text style={rightStyles.title}>{t('home.noBannerTitle')}</Text>
      <Image source={images.homeBanner.state1.logo} style={rightStyles.logo} resizeMode="contain" />
      <HomeBannerCtaPill
        label={t('home.noBannerCta')}
        trailingIcon={images.common.goToRight}
        style={rightStyles.ctaSpacing}
      />
    </View>
  );
}
