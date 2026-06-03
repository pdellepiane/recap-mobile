import type { QuizCreateQuestionSuggestion } from '../../hooks/useEventChallengeQuizCreateScreen';
import { EventChallengeQuizCreateSuggestionCard } from './EventChallengeQuizCreateSuggestionCard';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  suggestions: readonly QuizCreateQuestionSuggestion[];
  onSelectSuggestion: (suggestion: QuizCreateQuestionSuggestion) => void;
};

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
      {suggestions.map((suggestion) => (
        <EventChallengeQuizCreateSuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          onPress={onSelectSuggestion}
        />
      ))}
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
});
