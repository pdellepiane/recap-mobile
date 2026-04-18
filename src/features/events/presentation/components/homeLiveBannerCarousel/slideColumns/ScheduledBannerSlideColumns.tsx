import { BannerSlideCoverCircle } from '../BannerSlideCoverCircle';
import { BannerSlideStatusRow } from '../BannerSlideStatusRow';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { BANNER_STATE2_DECOR, GO_TO_RIGHT_ICON, SCHEDULED_ICON } from '../assets';
import { BANNER_STRUCTURED_FRAME_H, CARD_W } from '../layout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type LeftProps = {
  coverUri: string;
  circleDiameter: number;
};

export function ScheduledBannerLeftColumn({ coverUri, circleDiameter }: LeftProps) {
  return (
    <View style={styles.left}>
      <Image source={BANNER_STATE2_DECOR} style={styles.leftImage} resizeMode="cover" />
      <BannerSlideCoverCircle diameter={circleDiameter} uri={coverUri} variant="scheduled" />
    </View>
  );
}

type RightProps = {
  eventName: string;
};

export function ScheduledBannerRightColumn({ eventName }: RightProps) {
  return (
    <View style={styles.right}>
      <BannerSlideStatusRow
        icon={SCHEDULED_ICON}
        label="Evento por iniciar"
        variant="scheduled"
      />
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill
        label="INGRESAR"
        trailingIcon={GO_TO_RIGHT_ICON}
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
    ...StyleSheet.absoluteFillObject,
    width: Math.round(CARD_W * 0.48),
    height: BANNER_STRUCTURED_FRAME_H,
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
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});
