import { EventChallengePhotoBody } from '../components/photo/EventChallengePhotoBody';
import { EventChallengeFlowBackHeader } from '../components/shared/EventChallengeFlowBackHeader';
import { useEventChallengePhotoScreen } from '../hooks/useEventChallengePhotoScreen';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo challenge: card with decorative camera and “Take photo” action.
 */
export function EventChallengePhotoScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const { kicker, instructionParagraphs, handleOpenCamera } = useEventChallengePhotoScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  return (
    <View style={styles.root}>
      <EventChallengeFlowBackHeader />

      <EventChallengePhotoBody
        kicker={kicker}
        instructionParagraphs={instructionParagraphs}
        onOpenCamera={handleOpenCamera}
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
