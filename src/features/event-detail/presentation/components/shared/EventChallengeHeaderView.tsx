import { useTranslation } from '@/src/i18n';
import { BackButton } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** {@link BackButton} circle size in challenge flow headers. */
export const CHALLENGE_FLOW_BACK_BUTTON_SIZE = 50;

/** Y coordinate of the bottom edge of the floating back header. */
export function challengeFlowBackHeaderBottom(insetTop: number): number {
  return insetTop + CHALLENGE_FLOW_BACK_BUTTON_SIZE;
}

type Props = {
  onBack?: () => void;
  accessibilityLabel?: string;
};

/** Floating back control aligned to the top safe area (does not consume layout height). */
export function EventChallengeHeaderView({ onBack, accessibilityLabel }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.root, { top: insets.top }]}>
      <BackButton
        style={styles.backButton}
        onPress={onBack}
        accessibilityLabel={accessibilityLabel ?? t('common.back')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  backButton: {
    marginBottom: 0,
  },
});
