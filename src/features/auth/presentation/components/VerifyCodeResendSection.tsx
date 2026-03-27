import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const cooldownLabel =
    resendCooldown > 0
      ? `Reenviar nuevo código en ${String(Math.floor(resendCooldown / 60)).padStart(2, '0')}:${String(resendCooldown % 60).padStart(2, '0')}s`
      : '';

  return (
    <>
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>¿No recibiste el código? </Text>
        <Pressable onPress={onResend} disabled={resendDisabled} hitSlop={8}>
          <Text style={[styles.resendLink, resendDisabled && styles.resendLinkDisabled]}>
            Enviar nuevamente
          </Text>
        </Pressable>
      </View>

      <Text style={styles.cooldownText}>{cooldownLabel}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  resendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resendText: {
    color: colors.neutral.primary,
    fontFamily: fontFamilies.light,
    fontSize: 13,
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
