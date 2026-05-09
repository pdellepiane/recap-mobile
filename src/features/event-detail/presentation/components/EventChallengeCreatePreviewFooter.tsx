import { Button } from '@/src/ui';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onConfirm: () => void;
  finishButtonTitle: string;
};

export function EventChallengeCreatePreviewFooter({ onConfirm, finishButtonTitle }: Props) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
      <Button title={finishButtonTitle} onPress={onConfirm} variant="brand" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerSafe: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
