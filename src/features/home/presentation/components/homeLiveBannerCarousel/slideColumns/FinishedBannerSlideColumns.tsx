import { useBannerLayout } from '../BannerLayoutContext';
import { FinishedBannerGuestCollage } from '../FinishedBannerGuestCollage';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { FINISHED_GUEST_COLLAGE_FRAME } from '../layout';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type LeftProps = {
  eventName: string;
};

export function FinishedBannerLeftColumn({ eventName }: LeftProps) {
  const { t } = useTranslation();
  const { cardWidth } = useBannerLayout();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        left: {
          width: Math.round(cardWidth * 0.63),
          paddingLeft: 18,
          paddingRight: 10,
          paddingVertical: 20,
          justifyContent: 'center',
        },
        statusRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        },
        checkIcon: {
          width: 14,
          height: 14,
        },
        statusLabel: {
          color: colors.neutral.lightest,
          fontFamily: fontFamilies.signikaRegular,
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 20,
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
      }),
    [cardWidth],
  );

  return (
    <View style={styles.left}>
      <View style={styles.statusRow}>
        <Image source={images.common.checkGrey} style={styles.checkIcon} resizeMode="contain" />
        <Text style={styles.statusLabel}>{t('home.bannerMemoryLabel')}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill label={t('home.bannerViewMemoryCta')} style={styles.ctaSpacing} />
    </View>
  );
}

type RightProps = {
  faceUris: string[];
};

const rightStyles = StyleSheet.create({
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPanel: {
    backgroundColor: colors.background.tertiary,
    borderRadius: '50%',
    width: FINISHED_GUEST_COLLAGE_FRAME,
    height: FINISHED_GUEST_COLLAGE_FRAME,
    marginRight: -40,
    alignSelf: 'center',
  },
});

export function FinishedBannerRightColumn({ faceUris }: RightProps) {
  return (
    <View style={rightStyles.right}>
      <View style={rightStyles.rightPanel}>
        <FinishedBannerGuestCollage faceUris={faceUris} />
      </View>
    </View>
  );
}
