import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type VerifyCodeResendSectionProps = {
  resendCooldown: number;
  resendDisabled: boolean;
  onResend: () => void;
};

export function VerifyCodeResendSection({
  resendCooldown,
  resendDisabled,
  onResend,
}: VerifyCodeResendSectionProps) {
  const { t } = useTranslation();
  const mm = String(Math.floor(resendCooldown / 60)).padStart(2, '0');
  const ss = String(resendCooldown % 60).padStart(2, '0');
  const cooldownLabel = resendCooldown > 0 ? t('auth.resendCooldown', { mm, ss }) : '';

  return (
    <>
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>{t('auth.resendQuestion')}</Text>
        <Button
          title={t('auth.resendAction')}
          onPress={onResend}
          disabled={resendDisabled}
          variant="link"
          hitSlop={8}
          accessibilityLabel={t('auth.resendAction')}
          textStyle={[styles.resendLink, resendDisabled && styles.resendLinkDisabled]}
        />
      </View>

      <Text style={styles.cooldownText}>{cooldownLabel}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  resendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
    columnGap: 4,
    marginBottom: 8,
  },
  resendText: {
    color: colors.neutral.primary,
    fontFamily: fontFamilies.light,
    fontSize: 13,
    lineHeight: 18,
  },
  resendLink: {
    color: colors.neutral.primary,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  resendLinkDisabled: {
    color: colors.neutral.disabled,
  },
  cooldownText: {
    color: colors.overlay.white50,
    fontFamily: fontFamilies.arial,
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center',
  },
});
