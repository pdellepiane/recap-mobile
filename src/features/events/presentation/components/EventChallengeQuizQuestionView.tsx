import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const CHALLENGE_TRIVIA_BUBBLES = require('../../../../../assets/images/event-detail/challenges/reto-trivia-bubbles.png');
const CHALLENGE_CARD_DECOR = require('../../../../../assets/images/event-detail/challenges/reto-card-decor-union.png');

type EventChallengeQuizQuestionViewProps = {
  quiz: { number: number; question: string; options: string[] };
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizQuestionView({
  quiz,
  selectedIndex,
  onToggleOption,
}: EventChallengeQuizQuestionViewProps) {
  return (
    <View style={styles.content}>
      <Image
        source={CHALLENGE_TRIVIA_BUBBLES}
        style={styles.triviaBubbles}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <View style={styles.card}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image source={CHALLENGE_CARD_DECOR} style={styles.cardDecor} resizeMode="contain" />
        </View>
        <Text style={styles.challengeKicker}>{`Challenge ${String(quiz.number)}`}</Text>
        <Text style={styles.question}>{quiz.question}</Text>

        <View style={styles.options}>
          {quiz.options.map((label, idx) => {
            const selected = idx === selectedIndex;
            return (
              <Pressable
                key={label}
                onPress={() => onToggleOption(idx)}
                style={({ pressed }) => [
                  styles.optionRow,
                  selected && styles.optionRowSelected,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={label}
              >
                <Text style={styles.optionText}>{label}</Text>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  triviaBubbles: {
    width: 170,
    height: 120,
    marginBottom: 14,
    marginTop: 4,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  cardDecor: {
    position: 'absolute',
    left: -18,
    top: -22,
    width: 220,
    height: 220,
    opacity: 0.35,
  },
  challengeKicker: {
    color: colors.brand[300],
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
    marginBottom: 6,
  },
  question: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    marginBottom: 16,
  },
  options: {
    gap: 12,
    paddingBottom: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.overlay.white22,
    backgroundColor: colors.overlay.black08,
  },
  optionRowSelected: {
    borderColor: colors.neutral.primary,
  },
  optionText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.overlay.white65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.neutral.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral.secondary,
  },
  pressed: {
    opacity: 0.85,
  },
});
