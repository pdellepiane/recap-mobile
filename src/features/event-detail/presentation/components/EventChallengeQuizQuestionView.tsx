import { EventChallengeQuizOptionsList } from './EventChallengeQuizOptionsList';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

/** Design tokens (quiz mock: dark surface #121212, card #2B2B2B, kicker #9D59FF). */
const QUIZ = {
  kicker: '#9D59FF',
  card: '#2B2B2B',
} as const;

type Props = {
  quiz: { number: number; question: string; options: string[] };
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizQuestionView({ quiz, selectedIndex, onToggleOption }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.content}>
      <View style={styles.cardSection}>
        <View style={styles.card}>
          <Image
            source={images.eventDetail.challenges.cardDecorUnion}
            style={styles.cardDecor}
            resizeMode="contain"
            accessibilityElementsHidden
          />

          <Text style={styles.challengeKicker}>
            {t('challenges.challengeNumberLabel', { n: quiz.number })}
          </Text>
          <Text style={styles.question}>{quiz.question}</Text>

          <EventChallengeQuizOptionsList
            options={quiz.options}
            selectedIndex={selectedIndex}
            onToggleOption={onToggleOption}
          />
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

const BUBBLE_W = 170;
const BUBBLE_H = 120;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'center',
  },
  /** Bubble overlaps top edge of card; card owns inner padding for text below artwork. */
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
    borderRadius: 22,
    backgroundColor: QUIZ.card,
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 22,
    overflow: 'hidden',
  },
  cardDecor: {
    position: 'absolute',
    left: -18,
    top: -22,
    width: 220,
    height: 220,
    opacity: 0.28,
  },
  challengeKicker: {
    color: QUIZ.kicker,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    textAlign: 'center',
    marginBottom: 10,
  },
  question: {
    color: colors.neutral.primary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: fontFamilies.bold,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
});
