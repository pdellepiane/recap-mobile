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

const BUBBLE_W = 170;
const BUBBLE_H = 120;

type Props = {
  /** e.g. challenge number label (guest) or “Reto nuevo” (organizer). */
  kicker: string;
  kickerColor?: string;
  question: string;
  /** Option rows or editor slots rendered inside the card. */
  children: ReactNode;
  /** When true, card column does not stretch with `flex:1` (host editor layout). */
  compact?: boolean;
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
  compact = false,
}: Props) {
  return (
    <View style={[styles.content, compact && styles.contentCompact]}>
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Image
            source={images.eventDetail.challenges.cardDecorUnion}
            style={styles.cardDecor}
            resizeMode="contain"
            accessibilityElementsHidden
          />

          <Text style={[styles.challengeKicker, { color: kickerColor }]}>{kicker}</Text>
          <Text style={styles.question}>{question}</Text>
          {children}
        </View>

        <Image
          source={images.eventDetail.challenges.triviaBubbles}
          style={styles.triviaBubbles}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 180,
    alignItems: 'center',
  },
  contentCompact: {
    flexGrow: 0,
    flexShrink: 0,
    flex: 0,
    alignSelf: 'stretch',
  },
  cardSection: {
    width: '100%',
    position: 'relative',
    marginTop: 8,
  },
  triviaBubbles: {
    position: 'absolute',
    width: BUBBLE_W,
    height: BUBBLE_H,
    top: -56,
    alignSelf: 'center',
    zIndex: 2,
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
  cardDecor: {
    position: 'absolute',
    top: -22,
    width: '100%',
    height: '100%',
  },
  challengeKicker: {
    color: colors.brand[300],
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
    marginBottom: 14,
  },
  question: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
});
