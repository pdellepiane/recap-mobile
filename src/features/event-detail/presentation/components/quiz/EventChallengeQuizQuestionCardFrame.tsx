import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const ICON_TOP_W = 170;

type Props = {
  /** e.g. challenge number label (guest) or “Reto nuevo” (organizer). */
  kicker: string;
  kickerColor?: string;
  question: string;
  /** Option rows or editor slots rendered inside the card. */
  children: ReactNode;
  /** Top inset so content centers below a floating header (guest quiz flow). */
  contentInsetTop?: number;
  /** Bottom inset when the footer overlays content instead of pushing layout. */
  contentInsetBottom?: number;
};

/**
 * Shared layout: trivia bubbles + rounded card + kicker + question + footer slot.
 * Guest flow uses {@link EventChallengeQuizOptionsList}; organizer uses answer slot rows.
 */
export function EventChallengeQuizQuestionCardFrame({
  kicker,
  question,
  children,
  contentInsetTop = 0,
  contentInsetBottom = 0,
}: Props) {
  return (
    <View
      style={[
        styles.cardSection,
        { paddingTop: contentInsetTop, paddingBottom: contentInsetBottom },
      ]}
    >
      <View>
        <Image
          source={images.eventDetail.challenges.triviaBubbles}
          style={styles.triviaBubbles}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.card}>
          <Image
            source={images.eventDetail.challenges.cardDecorUnion}
            style={styles.cardBgImage}
            resizeMode="contain"
            accessibilityElementsHidden
          />

          <Text style={styles.kicker}>{kicker}</Text>
          <Text style={styles.challengeTitle}>{question}</Text>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    padding: 20,
    overflow: 'hidden',
    width: '100%',
  },
  cardBgImage: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    left: '-20%',
  },
  kicker: {
    color: colors.brand[300],
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
    marginBottom: 14,
    marginTop: 40,
  },
  challengeTitle: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    marginBottom: 20,
  },
  triviaBubbles: {
    position: 'absolute',
    width: ICON_TOP_W,
    height: 120,
    top: -75,
    alignSelf: 'center',
    zIndex: 2,
  },
});
