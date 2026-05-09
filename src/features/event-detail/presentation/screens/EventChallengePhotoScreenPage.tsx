import { EventChallengePhotoIntroCard } from '../components/EventChallengePhotoIntroCard';
import { useEventChallengePhotoScreen } from '../hooks/useEventChallengePhotoScreen';
import { useTranslation } from '@/src/i18n';
import { BackButton, colors } from '@/src/ui';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const WIN_H = Dimensions.get('window').height;

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo challenge: card with decorative camera and “Take photo” action.
 */
export function EventChallengePhotoScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { numberLabel, instructionParagraphs, handleOpenCamera } = useEventChallengePhotoScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <BackButton style={styles.backButton} accessibilityLabel={t('common.back')} />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24, minHeight: WIN_H },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <EventChallengePhotoIntroCard
            numberLabel={numberLabel}
            instructionParagraphs={instructionParagraphs}
            onOpenCamera={handleOpenCamera}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safe: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  /** {@link BackButton} default `marginBottom` is for form layouts; header row uses none. */
  backButton: {
    marginBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
