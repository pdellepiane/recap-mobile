import { EventChallengeQuizFinishButton } from '../components/EventChallengeQuizFinishButton';
import { EventChallengeQuizQuestionView } from '../components/EventChallengeQuizQuestionView';
import { useEventChallengeQuizScreen } from '../hooks/useEventChallengeQuizScreen';
import { EventChallengeQuizCompletedScreenPage } from './EventChallengeQuizCompletedScreenPage';
import { useTranslation } from '@/src/i18n';
import { BackButton, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

export function EventChallengeQuizScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const { t } = useTranslation();
  const {
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

  if (!quiz) {
    return (
      <View style={styles.root}>
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerRow}>
            <BackButton
              style={styles.backCircle}
              iconStyle={styles.backIcon}
              accessibilityLabel={t('common.back')}
              hitSlop={12}
            />
            <View style={styles.headerSide} />
          </View>
        </SafeAreaView>
        <View
          style={{
            paddingTop: contentTopInset,
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
        >
          <Text style={styles.unavailableText}>{t('quiz.unavailable')}</Text>
        </View>
      </View>
    );
  }

  if (showResult && selectedIndex !== null) {
    return (
      <EventChallengeQuizCompletedScreenPage
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
          <BackButton
            style={styles.backCircle}
            iconStyle={styles.backIcon}
            accessibilityLabel={t('common.back')}
            hitSlop={12}
          />
          <View style={styles.headerSide} />
        </View>
      </SafeAreaView>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <EventChallengeQuizQuestionView
          quiz={quiz}
          selectedIndex={selectedIndex}
          onToggleOption={toggleOption}
        />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <EventChallengeQuizFinishButton canFinish={canFinish} onPress={finalize} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
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
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  footerSafe: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  unavailableText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral.secondary,
    textAlign: 'center',
    fontFamily: fontFamilies.regular,
  },
});
