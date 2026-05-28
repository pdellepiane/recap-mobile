import { useBannerLayout } from '../BannerLayoutContext';
import { BannerSlideCoverCircle } from '../BannerSlideCoverCircle';
import { BannerSlideStatusRow } from '../BannerSlideStatusRow';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { BANNER_STRUCTURED_FRAME_H } from '../layout';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type LeftProps = {
  coverUri: string;
  circleDiameter: number;
};

export function ScheduledBannerLeftColumn({ coverUri, circleDiameter }: LeftProps) {
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
          ...StyleSheet.absoluteFillObject,
          width: Math.round(cardWidth * 0.48),
          height: BANNER_STRUCTURED_FRAME_H,
        },
      }),
    [cardWidth],
  );

  return (
    <View style={styles.left}>
      <Image source={images.homeBanner.state2.decor} style={styles.leftImage} resizeMode="cover" />
      <BannerSlideCoverCircle diameter={circleDiameter} uri={coverUri} variant="scheduled" />
    </View>
  );
}

type RightProps = {
  eventName: string;
};

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
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});

export function ScheduledBannerRightColumn({ eventName }: RightProps) {
  const { t } = useTranslation();
  return (
    <View style={rightStyles.right}>
      <BannerSlideStatusRow
        icon={images.common.scheduled}
        label={t('home.scheduleBadgeStartingSoon')}
        variant="scheduled"
      />
      <Text style={rightStyles.title} numberOfLines={2} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill
        label={t('home.bannerEnterCta')}
        trailingIcon={images.common.goToRight}
        style={rightStyles.ctaSpacing}
      />
    </View>
  );
}
