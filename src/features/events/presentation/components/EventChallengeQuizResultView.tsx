import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHALLENGE_CARD_DECOR = require('../../../../../assets/images/event-detail/challenges/reto-card-decor-union.png');

type EventChallengeQuizResultViewProps = {
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
}: EventChallengeQuizResultViewProps) {
  return (
    <View style={[styles.root, isCorrect ? styles.rootCorrect : styles.rootWrong]}>
      {isCorrect ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <ConfettiCannon
            count={120}
            origin={{ x: 0, y: 0 }}
            fadeOut
            fallSpeed={2600}
            explosionSpeed={420}
          />
        </View>
      ) : null}
      <SafeAreaView edges={['top']} style={styles.resultHeaderSafe}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeCircle, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={12}
        >
          <Ionicons name="close" size={22} color={colors.neutral.primary} />
        </Pressable>
      </SafeAreaView>

      <View style={styles.resultContent}>
        <View
          style={[styles.resultIconWrap, { marginTop: resultCircleMarginTop }]}
          pointerEvents="none"
        >
          <View style={styles.resultIconCircle}>
            {isCorrect ? (
              <View style={styles.resultCheckLayout}>
                <FontAwesome5 name="check" size={52} color={colors.states.active} solid />
              </View>
            ) : (
              <View style={styles.resultWrongIconLayout}>
                <FontAwesome5 name="times" size={44} color={colors.states.error} solid />
              </View>
            )}
          </View>
        </View>
        <Text style={styles.resultChallenge}>{`Challenge ${String(quizNumber)}`}</Text>
        <Text style={styles.resultTitle}>
          {isCorrect ? '¡Respuesta correcta!' : '¡Respuesta incorrecta!'}
        </Text>

        {isCorrect ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultQuestion}>{question}</Text>
            <View style={[styles.resultAnswerRow, styles.resultAnswerRowFeedback]}>
              <Ionicons name="checkmark" size={24} color={colors.states.active} />
              <Text
                style={[styles.resultAnswerText, styles.resultAnswerTextFlex]}
                numberOfLines={2}
              >
                {selectedLabel}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.resultCard, styles.resultCardWithDecor]}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Image
                source={CHALLENGE_CARD_DECOR}
                style={styles.resultCardDecor}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.resultQuestion}>{question}</Text>
            <View style={styles.resultFeedbackPills}>
              <View style={[styles.resultAnswerRow, styles.resultAnswerRowFeedback]}>
                <FontAwesome5 name="times" size={22} color={colors.states.error} solid />
                <Text
                  style={[styles.resultAnswerText, styles.resultAnswerTextFlex]}
                  numberOfLines={2}
                >
                  {selectedLabel}
                </Text>
              </View>
              <View style={styles.resultPillSpacer} />
              <View style={[styles.resultAnswerRow, styles.resultAnswerRowFeedback]}>
                <FontAwesome5 name="check" size={20} color={colors.states.active} solid />
                <Text
                  style={[styles.resultAnswerText, styles.resultAnswerTextFlex]}
                  numberOfLines={2}
                >
                  {correctLabel}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View
          style={[styles.pointsPill, !isCorrect && styles.pointsPillWrong]}
          pointerEvents="none"
        >
          <Text style={styles.pointsText}>
            {isCorrect ? `Obtuviste ${String(pointsEarned)} ptos` : 'Has obtenido 0 ptos'}
          </Text>
        </View>

        <Pressable
          onPress={onOpenRanking}
          style={({ pressed }) => [styles.rankingBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Ver ranking"
        >
          <Text style={styles.rankingBtnText}>Ver ranking</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.background.primary} />
        </Pressable>
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
  resultIconWrap: { width: 91, height: 91, marginBottom: 10 },
  resultIconCircle: {
    width: 91,
    height: 91,
    borderRadius: 45.5,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCheckLayout: {
    width: 68,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWrongIconLayout: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  resultCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 18,
  },
  resultCardWithDecor: { overflow: 'hidden' },
  resultCardDecor: {
    position: 'absolute',
    left: -18,
    top: -22,
    width: 220,
    height: 220,
    opacity: 0.35,
  },
  resultFeedbackPills: { alignSelf: 'stretch' },
  resultPillSpacer: { height: 12 },
  resultQuestion: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  resultAnswerRow: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: colors.neutral.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultAnswerText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  resultAnswerRowFeedback: { justifyContent: 'flex-start', paddingHorizontal: 16 },
  resultAnswerTextFlex: { flex: 1, flexShrink: 1 },
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
  rankingBtn: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  rankingBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background.primary,
    lineHeight: 16,
    fontFamily: fontFamilies.bold,
  },
  pressed: { opacity: 0.85 },
});
