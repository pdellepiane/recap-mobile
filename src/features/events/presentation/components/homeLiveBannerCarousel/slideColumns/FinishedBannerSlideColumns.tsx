import { FinishedBannerGuestCollage } from '../FinishedBannerGuestCollage';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { CHECK_GREY_ICON } from '../assets';
import { CARD_W, FINISHED_GUEST_COLLAGE_FRAME } from '../layout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type LeftProps = {
  eventName: string;
};

export function FinishedBannerLeftColumn({ eventName }: LeftProps) {
  return (
    <View style={styles.left}>
      <View style={styles.statusRow}>
        <Image source={CHECK_GREY_ICON} style={styles.checkIcon} resizeMode="contain" />
        <Text style={styles.statusLabel}>Recuerdo</Text>
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill label="VER RECUERDO" style={styles.ctaSpacing} />
    </View>
  );
}

type RightProps = {
  faceUris: string[];
};

export function FinishedBannerRightColumn({ faceUris }: RightProps) {
  return (
    <View style={styles.right}>
      <View style={styles.rightPanel}>
        <FinishedBannerGuestCollage faceUris={faceUris} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    width: Math.round(CARD_W * 0.63),
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
