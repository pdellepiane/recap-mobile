import type { QuizCreateAddedQuestion } from '../hooks/useEventChallengeQuizCreateScreen';
import {
  countFilledAnswerOptions,
  questionHasValidAnswers,
} from '../hooks/useEventChallengeQuizCreateScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  questions: QuizCreateAddedQuestion[];
  onPressChallenge: (questionId: string) => void;
};

/** “Retos agregados” list: warning row if incomplete, “Reto:” + answer count when valid, then question + chevron. */
export function EventChallengeQuizCreateAddedQuestionsSection({
  questions,
  onPressChallenge,
}: Props) {
  const { t } = useTranslation();

  if (questions.length === 0) {
    return null;
  }

  return (
    <View style={styles.addedBlock}>
      <Text style={styles.sectionHeading}>{t('eventDetail.createQuizAddedHeading')}</Text>
      {questions.map((q) => (
        <Pressable
          key={q.id}
          style={styles.addedCard}
          onPress={() => onPressChallenge(q.id)}
          accessibilityRole="button"
          accessibilityLabel={q.text}
        >
          <Image
            source={images.eventDetail.challenges.createdQuestionIcon}
            style={styles.addedWatermark}
            resizeMode="contain"
          />
          <View style={styles.addedCardInner}>
            <View style={styles.addedCardBody}>
              <View style={styles.addedCardTextCol}>
                {!questionHasValidAnswers(q) ? (
                  <View style={styles.warningRow}>
                    <Image
                      source={images.common.info}
                      style={styles.warningInfoIcon}
                      resizeMode="contain"
                      accessibilityElementsHidden
                    />
                    <Text style={styles.warningText}>
                      {t('eventDetail.createQuizMissingOptions')}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.validMetaRow}>
                    <Image
                      source={images.common.check}
                      style={styles.validMetaCheckIcon}
                      resizeMode="contain"
                      accessibilityElementsHidden
                    />
                    <Text style={styles.validMetaText} numberOfLines={2}>
                      <Text style={styles.validMetaLabel}>
                        {t('eventDetail.createQuizAddedChallengeLabel')}{' '}
                      </Text>
                      <Text style={styles.validMetaValue}>
                        {t('eventDetail.createQuizAddedAnswerOptionsCount', {
                          count: countFilledAnswerOptions(q),
                        })}
                      </Text>
                    </Text>
                  </View>
                )}
                <Text style={styles.addedQuestionText}>{q.text}</Text>
              </View>
              <Image
                source={images.common.caretRight}
                style={styles.chevron}
                resizeMode="contain"
                accessibilityElementsHidden
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  addedBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    color: colors.neutral.lightest,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    marginBottom: 12,
  },
  addedCard: {
    borderRadius: 16,
    backgroundColor: colors.quizCreate.addedCard,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 92,
  },
  addedWatermark: {
    position: 'absolute',
    left: -8,
    bottom: -16,
    width: 140,
    height: 140,
    opacity: 0.07,
  },
  addedCardInner: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  addedCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedCardTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  warningInfoIcon: {
    width: 20,
    height: 20,
    tintColor: colors.states.error,
  },
  warningText: {
    color: colors.states.error,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  validMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  validMetaCheckIcon: {
    width: 20,
    height: 20,
  },
  validMetaText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  validMetaLabel: {
    color: colors.brand[300],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  validMetaValue: {
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
  addedQuestionText: {
    color: colors.neutral.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
  chevron: {
    width: 14,
    height: 24,
    tintColor: colors.neutral.primary,
  },
});
