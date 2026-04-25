import { EventChallengeQuizRankingButton } from './EventChallengeQuizRankingButton';
import { EventChallengeQuizResultCorrectCard } from './EventChallengeQuizResultCorrectCard';
import { EventChallengeQuizResultOutcomeIcon } from './EventChallengeQuizResultOutcomeIcon';
import { EventChallengeQuizResultWrongCard } from './EventChallengeQuizResultWrongCard';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  quizNumber: number;
  question: string;
  isCorrect: boolean;
  selectedLabel: string;
  correctLabel: string;
  pointsEarned: number;
  resultCircleMarginTop: number;
  onClose: () => void;
  onOpenRanking: () => void;
};

export function EventChallengeQuizResultView({
  quizNumber,
  question,
  isCorrect,
  selectedLabel,
  correctLabel,
  pointsEarned,
  resultCircleMarginTop,
  onClose,
  onOpenRanking,
}: Props) {
  const { t } = useTranslation();
  return (
    <View style={[styles.root, isCorrect ? styles.rootCorrect : styles.rootWrong]}>
      {isCorrect && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCannon
            count={120}
            origin={{ x: 0, y: 0 }}
            fadeOut
            fallSpeed={2600}
            explosionSpeed={420}
          />
        </View>
      )}
      <SafeAreaView edges={['top']} style={styles.resultHeaderSafe}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeCircle, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={12}
        >
          <Ionicons name="close" size={22} color={colors.neutral.primary} />
        </Pressable>
      </SafeAreaView>

      <View style={styles.resultContent}>
        <EventChallengeQuizResultOutcomeIcon
          isCorrect={isCorrect}
          marginTop={resultCircleMarginTop}
        />

        <Text style={styles.resultChallenge}>
          {t('challenges.challengeNumberLabel', { n: quizNumber })}
        </Text>
        <Text style={styles.resultTitle}>
          {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
        </Text>

        {isCorrect ? (
          <EventChallengeQuizResultCorrectCard question={question} selectedLabel={selectedLabel} />
        ) : (
          <EventChallengeQuizResultWrongCard
            question={question}
            selectedLabel={selectedLabel}
            correctLabel={correctLabel}
          />
        )}

        <View
          style={[styles.pointsPill, !isCorrect && styles.pointsPillWrong]}
          pointerEvents="none"
        >
          <Text style={styles.pointsText}>
            {isCorrect
              ? t('quiz.pointsCorrect', { points: pointsEarned })
              : t('challenges.gotZeroPoints')}
          </Text>
        </View>

        <EventChallengeQuizRankingButton onPress={onOpenRanking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  rootCorrect: { backgroundColor: colors.brand[600] },
  rootWrong: { backgroundColor: colors.brand[400] },
  resultHeaderSafe: { backgroundColor: 'transparent' },
  closeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay.black35,
    marginLeft: 10,
    marginTop: 6,
  },
  resultContent: { flex: 1, alignItems: 'center', paddingHorizontal: 18 },
  resultChallenge: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    color: colors.background.primary,
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.background.primary,
    marginBottom: 18,
    fontFamily: fontFamilies.signikaRegular,
    lineHeight: 36,
    textAlign: 'center',
  },
  pointsPill: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pointsPillWrong: { backgroundColor: colors.brand[500] },
  pointsText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  pressed: { opacity: 0.85 },
});
