import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  canConfirm?: boolean;
  loading?: boolean;
  onConfirm: () => void;
};

/** Bottom safe area + finish CTA for the guest quiz challenge screen. */
export function EventChallengeQuizFooterView({ canConfirm, loading = false, onConfirm }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isDisabled = !canConfirm;

  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Button
        title={t('common.finish')}
        loading={loading}
        loadingText={t('quiz.submittingAnswer')}
        onPress={onConfirm}
        disabled={isDisabled}
        style={isDisabled ? styles.buttonDisabled : undefined}
        textStyle={isDisabled ? styles.buttonTextDisabled : undefined}
        accessibilityLabel={loading ? t('quiz.submittingAnswer') : t('common.finish')}
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
