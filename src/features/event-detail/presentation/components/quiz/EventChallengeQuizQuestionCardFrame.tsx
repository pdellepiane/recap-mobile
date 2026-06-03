import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

/** Shared quiz card chrome (guest + organizer flows). */
export const QUIZ_CARD = {
  kickerGuest: '#9D59FF',
  card: '#2B2B2B',
} as const;

const CARD_TOP = 118;
const ICON_TOP_W = 170;
const ICON_TOP_H = 120;

type Props = {
  /** e.g. challenge number label (guest) or “Reto nuevo” (organizer). */
  kicker: string;
  kickerColor?: string;
  question: string;
  /** Option rows or editor slots rendered inside the card. */
  children: ReactNode;
};

/**
 * Shared layout: trivia bubbles + rounded card + kicker + question + footer slot.
 * Guest flow uses {@link EventChallengeQuizOptionsList}; organizer uses answer slot rows.
 */
export function EventChallengeQuizQuestionCardFrame({
  kicker,
  kickerColor = QUIZ_CARD.kickerGuest,
  question,
  children,
}: Props) {
  return (
    <View style={styles.cardSection}>
      <View style={styles.card}>
        <Image
          source={images.eventDetail.challenges.cardDecorUnion}
          style={styles.cardBgImage}
          resizeMode="contain"
          accessibilityElementsHidden
        />

        <Text style={[styles.kicker, { color: kickerColor }]}>{kicker}</Text>
        <Text style={styles.challengeTitle}>{question}</Text>
        {children}
      </View>

      <Image
        source={images.eventDetail.challenges.triviaBubbles}
        style={styles.triviaBubbles}
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
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 22,
    overflow: 'hidden',
  },
  cardBgImage: {
    position: 'absolute',
    width: '80%',
    height: '90%',
  },
  kicker: {
    color: colors.brand[300],
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
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  triviaBubbles: {
    position: 'absolute',
    width: ICON_TOP_W,
    height: ICON_TOP_H,
    top: -80,
    alignSelf: 'center',
    zIndex: 2,
  },
});
