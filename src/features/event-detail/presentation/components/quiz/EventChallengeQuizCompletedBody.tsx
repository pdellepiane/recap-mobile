import { EventChallengeQuizResultCorrectCard } from './EventChallengeQuizResultCorrectCard';
import { EventChallengeQuizResultOutcomeIcon } from './EventChallengeQuizResultOutcomeIcon';
import { EventChallengeQuizResultWrongCard } from './EventChallengeQuizResultWrongCard';
import { images } from '@/src/assets';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  quizNumber: number;
  question: string;
  isCorrect: boolean;
  selectedLabel: string;
  correctLabel: string;
  pointsEarned: number;
  resultCircleMarginTop: number;
  onOpenRanking: () => void;
};

export function EventChallengeQuizCompletedBody({
  quizNumber,
  question,
  isCorrect,
  selectedLabel,
  correctLabel,
  pointsEarned,
  resultCircleMarginTop,
  onOpenRanking,
}: Props) {
  const { t } = useTranslation();
  const rankingLabel = t('common.viewRanking');

  return (
    <View style={styles.resultContent}>
      <EventChallengeQuizResultOutcomeIcon isCorrect={isCorrect} />

      <Text style={styles.resultChallenge}>
        {t('challenges.challengeNumberLabel', { n: quizNumber })}
      </Text>
      <Text style={styles.resultTitle}>{isCorrect ? t('quiz.correct') : t('quiz.incorrect')}</Text>

      {isCorrect ? (
        <EventChallengeQuizResultCorrectCard question={question} selectedLabel={selectedLabel} />
      ) : (
        <EventChallengeQuizResultWrongCard
          question={question}
          selectedLabel={selectedLabel}
          correctLabel={correctLabel}
        />
      )}

      <View style={[styles.pointsPill, !isCorrect && styles.pointsPillWrong]} pointerEvents="none">
        <Text style={styles.pointsText}>
          {isCorrect
            ? t('quiz.pointsCorrect', { points: pointsEarned })
            : t('challenges.gotZeroPoints')}
        </Text>
      </View>

      <Button
        title={rankingLabel}
        onPress={onOpenRanking}
        accessibilityLabel={rankingLabel}
        style={styles.rankingBtn}
        rightIconSource={images.common.goToRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  resultChallenge: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    color: colors.background.primary,
    marginBottom: 10,
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: colors.background.primary,
    marginBottom: 18,
    fontFamily: fontFamilies.medium,
    lineHeight: 36,
    textAlign: 'center',
  },
  pointsPill: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.brand[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  pointsPillWrong: { backgroundColor: colors.brand[500] },
  pointsText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.semiBold,
  },
  rankingBtn: {
    width: '100%',
    backgroundColor: colors.neutral.primary,
  },
});
