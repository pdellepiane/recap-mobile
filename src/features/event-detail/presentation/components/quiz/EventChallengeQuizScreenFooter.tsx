import { EventChallengeQuizFinishButton } from './EventChallengeQuizFinishButton';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  canFinish: boolean;
  loading?: boolean;
  onPress: () => void;
};

/** Bottom safe area + finish CTA for the guest quiz challenge screen. */
export function EventChallengeQuizScreenFooter({ canFinish, loading = false, onPress }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <EventChallengeQuizFinishButton
        canFinish={canFinish}
        loading={loading}
        onPress={onPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
});
