import { images } from '@/src/assets/images';
import {
  scaledChallengeSize,
  useChallengeFlowScale,
} from '../../utils/challengeFlowLayout';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  /** e.g. challenge number label (guest) or “Reto nuevo” (organizer). */
  kicker: string;
  kickerColor?: string;
  question: string;
  /** Option rows or editor slots rendered inside the card. */
  children: ReactNode;
  /** Bottom inset when the footer overlays content instead of pushing layout. */
  contentInsetBottom?: number;
};

/**
 * Shared layout: trivia bubbles + rounded card + kicker + question + footer slot.
 * Guest flow uses {@link EventChallengeQuizOptionsList}; organizer uses answer slot rows.
 */
export function EventChallengeQuizQuestionCardFrame({
  kicker,
  kickerColor,
  question,
  children,
  contentInsetBottom = 0,
}: Props) {
  const scale = useChallengeFlowScale();

  const layout = useMemo(() => {
    const bubbleTop = scaledChallengeSize(-75, scale);
    const bubbleOverlap = Math.abs(bubbleTop);
    return {
      cardPadding: scaledChallengeSize(20, scale),
      kickerFontSize: scaledChallengeSize(20, scale),
      kickerLineHeight: scaledChallengeSize(28, scale),
      kickerMarginTop: scaledChallengeSize(40, scale),
      kickerMarginBottom: scaledChallengeSize(14, scale),
      titleFontSize: scaledChallengeSize(28, scale),
      titleLineHeight: scaledChallengeSize(36, scale),
      titleMarginBottom: scaledChallengeSize(20, scale),
      bubbleWidth: scaledChallengeSize(170, scale),
      bubbleHeight: scaledChallengeSize(120, scale),
      bubbleTop,
      bubbleOverlap,
      sectionPaddingVertical: scaledChallengeSize(12, scale),
    };
  }, [scale]);

  const sectionPaddingTop = layout.sectionPaddingVertical + layout.bubbleOverlap;

  return (
    <View
      style={[
        styles.cardSection,
        {
          paddingTop: sectionPaddingTop,
          paddingBottom: contentInsetBottom + layout.sectionPaddingVertical,
        },
      ]}
    >
      <View style={styles.cardWrap}>
        <View style={[styles.card, { padding: layout.cardPadding }]}>
          <Image
            source={images.eventDetail.challenges.cardDecorUnion}
            style={styles.cardBgImage}
            resizeMode="contain"
            accessibilityElementsHidden
          />

          <Text
            style={[
              styles.kicker,
              {
                color: kickerColor ?? colors.brand[300],
                fontSize: layout.kickerFontSize,
                lineHeight: layout.kickerLineHeight,
                marginTop: layout.kickerMarginTop,
                marginBottom: layout.kickerMarginBottom,
              },
            ]}
          >
            {kicker}
          </Text>
          <Text
            style={[
              styles.challengeTitle,
              {
                fontSize: layout.titleFontSize,
                lineHeight: layout.titleLineHeight,
                marginBottom: layout.titleMarginBottom,
              },
            ]}
          >
            {question}
          </Text>
          {children}
        </View>
        <Image
          source={images.eventDetail.challenges.triviaBubbles}
          style={[
            styles.triviaBubbles,
            {
              width: layout.bubbleWidth,
              height: layout.bubbleHeight,
              top: layout.bubbleTop,
            },
          ]}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    overflow: 'visible',
  },
  cardWrap: {
    width: '100%',
    overflow: 'visible',
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
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
    fontWeight: '400',
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
  },
  challengeTitle: {
    color: colors.neutral.primary,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: fontFamilies.medium,
  },
  triviaBubbles: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 3,
  },
});
