import { useLoginScreen } from '../hooks/useLoginScreen';
import { useTranslation } from '@/src/i18n';
import { Button, Form, InputField } from '@/src/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LoginScreenPage = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    keyboardVisible,
    email,
    hasError,
    errorMessage,
    isLoading,
    handleEmailChange,
    handlePressContinue,
  } = useLoginScreen();

  return (
    <Form title={t('auth.loginTitle')} includesGoBack>
      <InputField
        value={email}
        onChangeText={handleEmailChange}
        placeholder={t('auth.emailPlaceholder')}
        keyboardType="email-address"
        error={hasError ? errorMessage : undefined}
      />

      <Button
        title={t('common.continue')}
        loadingText={t('auth.loading')}
        loading={isLoading}
        onPress={handlePressContinue}
        style={[styles.button, { marginBottom: keyboardVisible ? 8 : Math.max(insets.bottom, 20) }]}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 'auto',
  },
});
