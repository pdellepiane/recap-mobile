import { EventChallengeQuizQuestionView } from '../components/EventChallengeQuizQuestionView';
import { EventChallengeQuizResultView } from '../components/EventChallengeQuizResultView';
import { useEventChallengeQuizScreen } from '../hooks/useEventChallengeQuizScreen';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

export function EventChallengeQuizScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const {
    goBack,
    quiz,
    selectedIndex,
    showResult,
    canFinish,
    isCorrect,
    selectedLabel,
    correctLabel,
    pointsEarned,
    resultCircleMarginTop,
    contentTopInset,
    closeResult,
    openRanking,
    toggleOption,
    finalize,
  } = useEventChallengeQuizScreen({ eventId, challengeId, challengeNumber });

  if (showResult && selectedIndex !== null) {
    return (
      <EventChallengeQuizResultView
        quizNumber={quiz.number}
        question={quiz.question}
        isCorrect={isCorrect}
        selectedLabel={selectedLabel}
        correctLabel={correctLabel}
        pointsEarned={pointsEarned}
        resultCircleMarginTop={resultCircleMarginTop}
        onClose={closeResult}
        onOpenRanking={openRanking}
      />
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={26} color={colors.neutral.primary} />
          </Pressable>
          <View style={styles.headerSide} />
        </View>
      </SafeAreaView>

      <View style={{ paddingTop: contentTopInset, flex: 1 }}>
        <EventChallengeQuizQuestionView
          quiz={quiz}
          selectedIndex={selectedIndex}
          onToggleOption={toggleOption}
        />
      </View>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <Pressable
          disabled={!canFinish}
          onPress={finalize}
          style={({ pressed }) => [
            styles.finishBtn,
            canFinish ? styles.finishBtnEnabled : styles.finishBtnDisabled,
            pressed && canFinish && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Finalizar"
        >
          <Text
            style={[
              styles.finishText,
              canFinish ? styles.finishTextEnabled : styles.finishTextDisabled,
            ]}
          >
            Finalizar
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 44,
    height: 44,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  pressed: {
    opacity: 0.85,
  },
  footerSafe: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  finishBtn: {
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  finishBtnEnabled: {
    backgroundColor: colors.states.active,
  },
  finishBtnDisabled: {
    backgroundColor: colors.background.elevated,
    opacity: 0.6,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 16,
    fontFamily: fontFamilies.bold,
  },
  finishTextEnabled: {
    color: colors.background.primary,
  },
  finishTextDisabled: {
    color: colors.neutral.tertiary,
  },
});
