import { EventChallengeQuizCompletedBody } from '../components/EventChallengeQuizCompletedBody';
import { useTranslation } from '@/src/i18n';
import { CloseButton, colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
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

export function EventChallengeQuizCompletedScreenPage({
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
            fallSpeed={2800}
            explosionSpeed={400}
          />
        </View>
      )}
      <SafeAreaView edges={['top']}>
        <CloseButton
          onPress={onClose}
          style={styles.closeCircle}
          iconStyle={styles.closeIcon}
          accessibilityLabel={t('common.close')}
          hitSlop={12}
        />
      </SafeAreaView>

      <EventChallengeQuizCompletedBody
        quizNumber={quizNumber}
        question={question}
        isCorrect={isCorrect}
        selectedLabel={selectedLabel}
        correctLabel={correctLabel}
        pointsEarned={pointsEarned}
        resultCircleMarginTop={resultCircleMarginTop}
        onOpenRanking={onOpenRanking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  rootCorrect: { backgroundColor: colors.brand[600] },
  rootWrong: { backgroundColor: colors.brand[400] },
  closeCircle: {
    marginLeft: 20,
    marginTop: 6,
  },
  closeIcon: {},
});
