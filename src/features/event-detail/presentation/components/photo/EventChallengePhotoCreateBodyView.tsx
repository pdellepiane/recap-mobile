import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const CARD_H = 511;
const ICON_TOP_W = 170;
const ICON_TOP_H = 120;
const CAMERA_ICON_OVERLAP = 80;

type Props = {
  title: string;
};

export function EventChallengePhotoCreateBodyView({ title }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.cardSection}>
      <View style={styles.cardWrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardWrap: {
    width: '100%',
  },
  card: {
    width: '100%',
    height: CARD_H,
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    paddingTop: 80,
    overflow: 'hidden',
  },
  cardBgImage: {
    position: 'absolute',
    width: '80%',
    height: '90%',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
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
    fontFamily: fontFamilies.signikaRegular,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  takePhotoIcon: {
    position: 'absolute',
    width: ICON_TOP_W,
    height: ICON_TOP_H,
    top: -CAMERA_ICON_OVERLAP,
    paddingLeft: 25,
    alignSelf: 'center',
    zIndex: 2,
  },
});
