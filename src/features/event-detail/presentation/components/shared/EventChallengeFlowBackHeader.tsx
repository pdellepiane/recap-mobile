import { useTranslation } from '@/src/i18n';
import { BackButton } from '@/src/ui';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onBack?: () => void;
  accessibilityLabel?: string;
};

/** Top safe area + back control for challenge flow screens (photo intro, etc.). */
export function EventChallengeFlowBackHeader({ onBack, accessibilityLabel }: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <BackButton
        style={styles.backButton}
        onPress={onBack}
        accessibilityLabel={accessibilityLabel ?? t('common.back')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  /** {@link BackButton} default `marginBottom` is for form layouts; header row uses none. */
  backButton: {
    marginBottom: 0,
  },
});
