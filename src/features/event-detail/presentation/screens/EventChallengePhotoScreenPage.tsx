import { EventChallengePhotoBodyView } from '../components/photo/EventChallengePhotoBodyView';
import { EventChallengePhotoOpenCameraButton } from '../components/photo/EventChallengePhotoOpenCameraButton';
import { EventChallengeHeaderView } from '../components/shared/EventChallengeHeaderView';
import { useEventChallengePhotoScreen } from '../hooks/useEventChallengePhotoScreen';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

export function EventChallengePhotoScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const { kicker, title, handleOpenCamera } = useEventChallengePhotoScreen({
    eventId,
    challengeId,
    challengeNumber,
  });

  return (
    <View style={styles.root}>
      <EventChallengeHeaderView />
      <EventChallengePhotoBodyView
        kicker={kicker}
        title={title}
        openCameraButton={<EventChallengePhotoOpenCameraButton onPress={handleOpenCamera} />}
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
