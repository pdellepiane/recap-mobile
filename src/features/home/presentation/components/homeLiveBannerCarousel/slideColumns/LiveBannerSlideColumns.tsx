import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { LiveBannerStructuredStatusRow } from '../LiveBannerStructuredStatusRow';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type RightProps = {
  eventName: string;
};

export function LiveBannerRightColumn({ eventName }: RightProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.right}>
      <LiveBannerStructuredStatusRow />
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill
        label={t('home.bannerEnterCta')}
        trailingIcon={images.common.goToRight}
        style={styles.ctaSpacing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  right: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});
