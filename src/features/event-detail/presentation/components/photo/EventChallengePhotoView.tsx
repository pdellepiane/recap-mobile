import { EventChallengeHeaderView } from '../shared/EventChallengeHeaderView';
import { EventChallengePhotoBodyView } from './EventChallengePhotoBodyView';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  kicker: string;
  instructionParagraphs: string[];
  onOpenCamera: () => void;
};

export function EventChallengePhotoView({ kicker, instructionParagraphs, onOpenCamera }: Props) {
  return (
    <View style={styles.root}>
      <EventChallengeHeaderView />

      <EventChallengePhotoBodyView
        kicker={kicker}
        instructionParagraphs={instructionParagraphs}
        onOpenCamera={onOpenCamera}
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
