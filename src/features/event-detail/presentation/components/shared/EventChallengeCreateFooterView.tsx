import { Button, colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  canConfirm?: boolean;
  finishButtonTitle: string;
  /** When false, the CTA stays disabled (e.g. quiz until required answers + correct option). */
  onConfirm: () => void;
};

export function EventChallengeCreateFooterView({
  onConfirm,
  finishButtonTitle,
  canConfirm = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const isDisabled = !canConfirm;

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Button
        title={finishButtonTitle}
        onPress={onConfirm}
        variant="brand"
        disabled={isDisabled}
        style={isDisabled ? styles.buttonDisabled : undefined}
        textStyle={isDisabled ? styles.buttonTextDisabled : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingTop: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.neutral.disabled,
    opacity: 1,
  },
  buttonTextDisabled: {
    color: colors.neutral.tertiary,
  },
});
