import { EventChallengePhotoBodyView } from '../components/photo/EventChallengePhotoBodyView';
import { EventChallengeHeaderView } from '../components/shared/EventChallengeHeaderView';
import { usePhotoCreateDraft } from '../context/PhotoCreateDraftContext';
import { colors } from '@/src/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

type Props = {
  challengeId: string;
};

export function EventChallengePhotoCreatePreviewScreenPage({ challengeId }: Props) {
  const { addedChallenges } = usePhotoCreateDraft();
  const { t } = useTranslation();

  const challenge = useMemo(
    () => addedChallenges.find((c) => c.id === challengeId),
    [addedChallenges, challengeId],
  );

  if (!challenge) {
    return null;
  }

  return (
    <View style={styles.root}>
      <EventChallengeHeaderView />
      <EventChallengePhotoBodyView
        kicker={t('eventDetail.createPhotoPreviewKicker')}
        title={challenge.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
});
