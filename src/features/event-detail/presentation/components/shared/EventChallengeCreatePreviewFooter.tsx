import { Button } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onConfirm: () => void;
  finishButtonTitle: string;
};

export function EventChallengeCreatePreviewFooter({ onConfirm, finishButtonTitle }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <Button title={finishButtonTitle} onPress={onConfirm} variant="brand" />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 4,
  },
});
