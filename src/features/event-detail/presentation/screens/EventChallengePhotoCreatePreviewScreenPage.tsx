import { EventChallengeCreatePreviewFooter } from '../components/shared/EventChallengeCreatePreviewFooter';
import { EventChallengeCreateHeaderView } from '../components/shared/EventChallengeCreateHeaderView';
import { EventChallengePhotoCreatePreviewBody } from '../components/photo/EventChallengePhotoCreatePreviewBody';
import { useEventChallengePhotoCreatePreviewScreen } from '../hooks/useEventChallengePhotoCreatePreviewScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  challengeId: string;
};

export function EventChallengePhotoCreatePreviewScreenPage({ challengeId }: Props) {
  const { t } = useTranslation();
  const { challenge, onTrash, onConfirm, goBack } = useEventChallengePhotoCreatePreviewScreen({
    challengeId,
  });

  if (!challenge) {
    return null;
  }

  return (
    <View style={styles.root}>
      <EventChallengeCreateHeaderView
        onBack={goBack}
        onTrash={onTrash}
        backAccessibilityLabel={t('common.back')}
        trashAccessibilityLabel={t('eventDetail.createPhotoPreviewTrashA11y')}
      />
      <EventChallengePhotoCreatePreviewBody title={challenge.title} />
      <EventChallengeCreatePreviewFooter
        onConfirm={onConfirm}
        finishButtonTitle={t('eventDetail.createPhotoPreviewConfirm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
