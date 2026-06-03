import type { QuizCreateQuestionSuggestion } from '../../hooks/useEventChallengeQuizCreateScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  suggestion: QuizCreateQuestionSuggestion;
  onPress: (suggestion: QuizCreateQuestionSuggestion) => void;
};

export function EventChallengeQuizCreateSuggestionCard({ suggestion, onPress }: Props) {
  const { t } = useTranslation();
  const line = suggestion.question;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(suggestion)}
      accessibilityRole="button"
      accessibilityLabel={line}
    >
      <View style={styles.body}>
        <View style={styles.textCol}>
          <View style={styles.topRow}>
            <Image
              source={images.common.questionIcon}
              style={styles.questionIcon}
              resizeMode="contain"
              accessibilityElementsHidden
            />
            <Text style={styles.badge}>{t('eventDetail.createQuizSuggestedBadge')}</Text>
          </View>
          <Text style={styles.question}>{line}</Text>
        </View>
        <Image
          source={images.eventDetail.challenges.addIcon}
          style={styles.addIcon}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: colors.quizCreate.suggestionCard,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    minHeight: 92,
  },
  cardPressed: {
    opacity: 0.92,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  questionIcon: {
    width: 20.18,
    height: 20.18,
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  badge: {
    color: colors.brand[300],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  question: {
    color: colors.neutral.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
});
