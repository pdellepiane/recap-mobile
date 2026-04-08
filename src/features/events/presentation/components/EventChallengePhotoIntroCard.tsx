import {
  EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE,
  EventChallengePhotoCameraHero,
} from './EventChallengePhotoCameraHero';
import { colors } from '@/src/ui';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const CHALLENGE_PHOTO_CARD_BG = require('../../../../../assets/images/event-detail/challenges/reto-photo-card-bg.png');
const CHALLENGE_PHOTO_CTA_IMG = require('../../../../../assets/images/event-detail/challenges/reto-photo-tomar-foto-button.png');

const CHALLENGE_PHOTO_CTA_W = 200;
const CHALLENGE_PHOTO_CTA_H = Math.round((CHALLENGE_PHOTO_CTA_W * 240) / 585);
const CARD_W = 364;
const CARD_H = 511;
const CARD_TOP = 118;
const PHOTO_HERO_H = EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE;
const PHOTO_HERO_HALF_UP = Math.round(PHOTO_HERO_H / 2);

type EventChallengePhotoIntroCardProps = {
  numberLabel: string;
  instructionParagraphs: string[];
  onOpenCamera: () => void;
};

export function EventChallengePhotoIntroCard({
  numberLabel,
  instructionParagraphs,
  onOpenCamera,
}: EventChallengePhotoIntroCardProps) {
  return (
    <View style={styles.cardShell}>
      <View style={styles.card}>
        <View style={styles.cardBackgroundClip} pointerEvents="none">
          <Image
            source={CHALLENGE_PHOTO_CARD_BG}
            style={styles.cardBgImage}
            resizeMode="cover"
            accessibilityElementsHidden
          />
        </View>

        <View style={styles.cardInner}>
          <View style={styles.heroRow} pointerEvents="none">
            <EventChallengePhotoCameraHero />
          </View>
          <View style={styles.cardBodyMiddle}>
            <Text style={styles.challengeLabel}>{numberLabel}</Text>
            {instructionParagraphs.map((line, i) => (
              <Text
                key={`${String(i)}-${line}`}
                style={[
                  styles.instruction,
                  i < instructionParagraphs.length - 1
                    ? styles.instructionParaSpacing
                    : styles.instructionParaLast,
                ]}
              >
                {line}
              </Text>
            ))}
          </View>
          <Pressable
            onPress={onOpenCamera}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            accessibilityRole="button"
            accessibilityLabel="Tomar foto"
          >
            <Image
              source={CHALLENGE_PHOTO_CTA_IMG}
              style={styles.ctaImage}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShell: {
    marginTop: CARD_TOP,
    width: CARD_W,
    height: CARD_H,
    alignSelf: 'center',
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    position: 'relative',
    overflow: 'visible',
  },
  cardBackgroundClip: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
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
    marginTop: -PHOTO_HERO_HALF_UP,
    marginBottom: 20,
  },
  cardBodyMiddle: {
    flex: 1,
  },
  challengeLabel: {
    color: colors.states.active,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  instruction: {
    color: colors.neutral.primary,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 4,
  },
  instructionParaSpacing: {
    marginBottom: 10,
  },
  instructionParaLast: {
    marginBottom: 16,
  },
  cta: {
    alignSelf: 'center',
    marginTop: -250,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  ctaImage: {
    width: CHALLENGE_PHOTO_CTA_W,
    height: CHALLENGE_PHOTO_CTA_H,
  },
});
