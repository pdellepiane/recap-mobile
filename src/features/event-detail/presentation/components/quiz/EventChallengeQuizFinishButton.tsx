import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  canFinish: boolean;
  loading?: boolean;
  onPress: () => void;
};

export function EventChallengeQuizFinishButton({ canFinish, loading = false, onPress }: Props) {
  const { t } = useTranslation();
  const enabled = canFinish && !loading;
  return (
    <Pressable
      disabled={!enabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.finishBtn,
        enabled ? styles.finishBtnEnabled : styles.finishBtnDisabled,
        pressed && enabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={t('common.finish')}
    >
      <Text
        style={[
          styles.finishText,
          enabled ? styles.finishTextEnabled : styles.finishTextDisabled,
        ]}
      >
        {loading ? t('challenges.uploading') : t('common.finish')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  finishBtn: {
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  finishBtnEnabled: {
    backgroundColor: '#D4FF37',
  },
  finishBtnDisabled: {
    backgroundColor: colors.background.elevated,
    opacity: 0.6,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 16,
    fontFamily: fontFamilies.bold,
  },
  finishTextEnabled: {
    color: colors.neutral.onLime,
  },
  finishTextDisabled: {
    color: colors.neutral.tertiary,
  },
  pressed: {
    opacity: 0.85,
  },
});
