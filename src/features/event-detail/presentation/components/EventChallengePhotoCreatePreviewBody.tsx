import {
  EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE,
  EventChallengePhotoCameraHero,
} from './EventChallengePhotoCameraHero';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const CARD_W = 364;
const CARD_H = 300;
const PHOTO_HERO_H = EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE;

type Props = {
  title: string;
};

export function EventChallengePhotoCreatePreviewBody({ title }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.cardShell}>
      <View style={styles.card}>
        <View style={styles.cardBackgroundClip} pointerEvents="none">
          <Image
            source={images.eventDetail.challenges.photoCardBg}
            style={styles.cardBgImage}
            resizeMode="cover"
            accessibilityElementsHidden
          />
        </View>

        <View style={styles.cardInner}>
          <View style={styles.heroRow} pointerEvents="none">
            <EventChallengePhotoCameraHero />
          </View>
          <Text style={styles.kicker}>{t('eventDetail.createPhotoPreviewKicker')}</Text>
          <Text style={styles.challengeTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
    width: CARD_W,
    height: CARD_H,
    alignSelf: 'center',
    marginTop: 80,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 22,
    paddingTop: 80,
    paddingBottom: 28,
    alignItems: 'center',
    zIndex: 1,
  },
  cardBackgroundClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardBgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  heroRow: {
    alignSelf: 'center',
    marginTop: -PHOTO_HERO_H,
    marginBottom: 20,
    marginLeft: 35,
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
