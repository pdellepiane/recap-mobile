import type { QuizCreateAddedQuestion } from '../../hooks/useEventChallengeQuizCreateScreen';
import {
  countFilledAnswerOptions,
  questionHasValidAnswers,
} from '../../hooks/useEventChallengeQuizCreateScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  question: QuizCreateAddedQuestion;
  onPress: (questionId: string) => void;
};

export function EventChallengeQuizCreateAddedQuestionCard({ question, onPress }: Props) {
  const { t } = useTranslation();
  const isValid = questionHasValidAnswers(question);

  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(question.id)}
      accessibilityRole="button"
      accessibilityLabel={question.text}
    >
      <Image
        source={images.eventDetail.challenges.createdQuestionIcon}
        style={styles.watermark}
        resizeMode="contain"
      />
      <View style={styles.inner}>
        <View style={styles.body}>
          <View style={styles.textCol}>
            {!isValid ? (
              <View style={styles.warningRow}>
                <Image
                  source={images.common.info}
                  style={styles.warningInfoIcon}
                  resizeMode="contain"
                  accessibilityElementsHidden
                />
                <Text style={styles.warningText}>{t('eventDetail.createQuizMissingOptions')}</Text>
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
                      count: countFilledAnswerOptions(question),
                    })}
                  </Text>
                </Text>
              </View>
            )}
            <Text style={styles.questionText}>{question.text}</Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.quizCreate.addedCard,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 92,
  },
  watermark: {
    position: 'absolute',
    left: -8,
    bottom: -16,
    width: 140,
    height: 140,
    opacity: 0.07,
  },
  inner: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCol: {
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
  questionText: {
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
