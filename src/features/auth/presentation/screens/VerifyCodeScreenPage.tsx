import { VerifyCodeDigitInputs } from '../components/VerifyCodeDigitInputs';
import { VerifyCodeResendSection } from '../components/VerifyCodeResendSection';
import { useVerifyCodeScreen } from '../hooks/useVerifyCodeScreen';
import { useTranslation } from '@/src/i18n';
import { Form, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

export const VerifyCodeScreenPage = () => {
  const { t } = useTranslation();
  const {
    email,
    digits,
    resendCooldown,
    resendDisabled,
    hasError,
    isCodeValid,
    errorMessage,
    isLoading,
    inputRefs,
    updateDigit,
    handleKeyPress,
    handleResend,
    focusInput,
  } = useVerifyCodeScreen();

  if (!email) {
    return null;
  }

  return (
    <Form includesGoBack title={t('auth.verifyTitle')}>
      <Text style={styles.subtitle}>{t('auth.verifySubtitle')}</Text>
      <VerifyCodeDigitInputs
        digits={digits}
        inputRefs={inputRefs}
        hasError={hasError}
        isCodeValid={isCodeValid}
        onUpdateDigit={updateDigit}
        onHandleKeyPress={handleKeyPress}
        onFocusInput={focusInput}
      />
      <View style={styles.messagesContainer}>
        {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
        <VerifyCodeResendSection
          resendCooldown={resendCooldown}
          resendDisabled={resendDisabled}
          onResend={handleResend}
        />

        {isLoading && <Text style={styles.loadingText}>{t('auth.verifying')}</Text>}
      </View>
    </Form>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontFamily: fontFamilies.signikaLight,
    marginBottom: 32,
    alignSelf: 'flex-start',
    textAlign: 'left',
    lineHeight: 21,
  },
  errorText: {
    color: colors.states.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messagesContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: colors.states.active,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
});
