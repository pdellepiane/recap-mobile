import { EventChallengeQuizCreateAddedQuestionsSection } from '../components/EventChallengeQuizCreateAddedQuestionsSection';
import { EventChallengeQuizCreateComposerIdle } from '../components/EventChallengeQuizCreateComposerIdle';
import { EventChallengeQuizCreateComposerOpen } from '../components/EventChallengeQuizCreateComposerOpen';
import { EventChallengeQuizCreateSuggestionsSection } from '../components/EventChallengeQuizCreateSuggestionsSection';
import { useEventChallengeQuizCreateScreenPage } from '../hooks/useEventChallengeQuizCreateScreenPage';
import { useTranslation } from '@/src/i18n';
import { CloseButton, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
};

export function EventChallengeQuizCreateScreenPage({ eventId }: Props) {
  const { t } = useTranslation();
  const {
    inputRef,
    onPressChallenge,
    canCommitDraft,
    composerOpen,
    draft,
    setDraft,
    addedQuestions,
    availableSuggestions,
    openComposer,
    commitDraftQuestion,
    addQuestionFromSuggestion,
    goBack,
  } = useEventChallengeQuizCreateScreenPage({ eventId });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <CloseButton
          onPress={goBack}
          style={styles.closeCircle}
          accessibilityLabel={t('common.close')}
        />
      </SafeAreaView>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.typeSub}>
          {t('eventDetail.createQuizTypeSub', { type: t('eventDetail.challengeTypeQuizTitle') })}
        </Text>
        <Text style={styles.heroTitle}>{t('eventDetail.createQuizInviteTitle')}</Text>

        {composerOpen ? (
          <EventChallengeQuizCreateComposerOpen
            inputRef={inputRef}
            draft={draft}
            setDraft={setDraft}
            canCommitDraft={canCommitDraft}
            onCommit={commitDraftQuestion}
          />
        ) : (
          <EventChallengeQuizCreateComposerIdle onPress={openComposer} />
        )}

        <EventChallengeQuizCreateAddedQuestionsSection
          questions={addedQuestions}
          onPressChallenge={onPressChallenge}
        />

        <EventChallengeQuizCreateSuggestionsSection
          suggestions={availableSuggestions}
          onSelectSuggestion={addQuestionFromSuggestion}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
  closeCircle: {
    marginVertical: 10,
  },
  typeSub: {
    color: colors.brand[300],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.neutral.primary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    marginBottom: 24,
  },
});
