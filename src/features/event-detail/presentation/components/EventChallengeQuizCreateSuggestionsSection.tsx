import type { QuizCreateQuestionSuggestion } from '../hooks/useEventChallengeQuizCreateScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  suggestions: readonly QuizCreateQuestionSuggestion[];
  onSelectSuggestion: (suggestion: QuizCreateQuestionSuggestion) => void;
};

/** “Sugerencias” heading + tappable cards for keys still in the pool. */
export function EventChallengeQuizCreateSuggestionsSection({
  suggestions,
  onSelectSuggestion,
}: Props) {
  const { t } = useTranslation();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionHeading}>{t('eventDetail.createQuizSuggestionsHeading')}</Text>
      {suggestions.map((suggestion) => {
        const line = suggestion.question;
        return (
          <Pressable
            key={suggestion.id}
            style={({ pressed }) => [
              styles.suggestionCard,
              pressed && styles.suggestionCardPressed,
            ]}
            onPress={() => onSelectSuggestion(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={line}
          >
            <View style={styles.suggestionCardBody}>
              <View style={styles.suggestionCardTextCol}>
                <View style={styles.suggestionTopRow}>
                  <Image
                    source={images.common.questionIcon}
                    style={styles.suggestionQuestionIcon}
                    resizeMode="contain"
                    accessibilityElementsHidden
                  />
                  <Text style={styles.suggestionBadge}>
                    {t('eventDetail.createQuizSuggestedBadge')}
                  </Text>
                </View>
                <Text style={styles.suggestionQuestion}>{line}</Text>
              </View>
              <Image
                source={images.eventDetail.challenges.addIcon}
                style={styles.suggestionAddIcon}
                resizeMode="contain"
                accessibilityElementsHidden
              />
            </View>
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    color: colors.neutral.lightest,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 4,
  },

  suggestionCard: {
    borderRadius: 8,
    backgroundColor: colors.quizCreate.suggestionCard,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
    minHeight: 92,
  },
  suggestionCardPressed: {
    opacity: 0.92,
  },
  suggestionCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionCardTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  suggestionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  suggestionQuestionIcon: {
    width: 20.18,
    height: 20.18,
  },
  suggestionAddIcon: {
    width: 24,
    height: 24,
  },
  suggestionBadge: {
    color: colors.brand[300],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  suggestionQuestion: {
    color: colors.neutral.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
});
