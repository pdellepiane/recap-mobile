import { EventChallengePhotoCreateAddedSection } from '../components/EventChallengePhotoCreateAddedSection';
import { EventChallengePhotoCreateComposerIdle } from '../components/EventChallengePhotoCreateComposerIdle';
import { EventChallengePhotoCreateComposerOpen } from '../components/EventChallengePhotoCreateComposerOpen';
import { EventChallengePhotoCreateSuggestionsSection } from '../components/EventChallengePhotoCreateSuggestionsSection';
import { useEventChallengePhotoCreateScreenPage } from '../hooks/useEventChallengePhotoCreateScreenPage';
import { useTranslation } from '@/src/i18n';
import { CloseButton, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
};

export function EventChallengePhotoCreateScreenPage({ eventId }: Props) {
  const { t } = useTranslation();
  const {
    inputRef,
    onPressChallenge,
    canCommitDraft,
    composerOpen,
    draft,
    setDraft,
    addedChallenges,
    availableSuggestions,
    openComposer,
    commitDraftChallenge,
    addChallengeFromSuggestion,
    goBack,
  } = useEventChallengePhotoCreateScreenPage({ eventId });

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
          {t('eventDetail.createQuizTypeSub', { type: t('eventDetail.challengeTypePhotoTitle') })}
        </Text>
        <Text style={styles.heroTitle}>{t('eventDetail.createPhotoInviteTitle')}</Text>

        {composerOpen ? (
          <EventChallengePhotoCreateComposerOpen
            inputRef={inputRef}
            draft={draft}
            setDraft={setDraft}
            canCommitDraft={canCommitDraft}
            onCommit={commitDraftChallenge}
          />
        ) : (
          <EventChallengePhotoCreateComposerIdle onPress={openComposer} />
        )}

        <EventChallengePhotoCreateAddedSection
          challenges={addedChallenges}
          onPressChallenge={onPressChallenge}
        />

        <EventChallengePhotoCreateSuggestionsSection
          suggestions={availableSuggestions}
          onSelectSuggestion={addChallengeFromSuggestion}
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
    color: colors.accent[300],
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
