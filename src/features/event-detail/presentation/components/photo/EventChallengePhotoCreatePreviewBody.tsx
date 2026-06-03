import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const CARD_H = 511;
const CARD_TOP = 118;
const ICON_TOP_W = 170;
const ICON_TOP_H = 120;

type Props = {
  title: string;
};

export function EventChallengePhotoCreatePreviewBody({ title }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.cardSection}>
      <View style={styles.card}>
        <Image
          source={images.eventDetail.challenges.challengePhotoCardBg}
          style={styles.cardBgImage}
          resizeMode="cover"
          accessibilityElementsHidden
        />

        <View style={styles.cardInner}>
          <Text style={styles.kicker}>{t('eventDetail.createPhotoPreviewKicker')}</Text>
          <Text style={styles.challengeTitle}>{title}</Text>
        </View>
      </View>
      <Image
        source={images.eventDetail.challenges.photoCameraHero}
        style={styles.takePhotoIcon}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    marginTop: CARD_TOP,
    alignSelf: 'center',
    width: '80%',
  },
  card: {
    width: '100%',
    height: CARD_H,
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 22,
    overflow: 'hidden',
  },
  cardBgImage: {
    position: 'absolute',
    left: 0,
    top: 18,
    width: '100%',
    height: '100%',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  takePhotoIcon: {
    position: 'absolute',
    width: ICON_TOP_W,
    height: ICON_TOP_H,
    top: -56,
    left: 3,
    alignSelf: 'center',
    zIndex: 2,
  },
  kicker: {
    color: colors.accent[700],
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
    marginBottom: 14,
  },
  challengeTitle: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
  },
});
