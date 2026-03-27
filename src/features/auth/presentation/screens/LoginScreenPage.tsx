import { useLoginScreen } from '../hooks/useLoginScreen';
import { Button, Form, InputField } from '@/src/ui';
import { StyleSheet } from 'react-native';

export const LoginScreenPage = () => {
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
    <Form title="Escribe tu correo" includesGoBack>
      <InputField
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Coloca aquí tu correo"
        keyboardType="email-address"
        error={hasError ? errorMessage : undefined}
      />

      <Button
        title="Continuar"
        loadingText="Cargando..."
        loading={isLoading}
        onPress={handlePressContinue}
        style={[styles.button, { marginBottom: keyboardVisible ? 8 : 48 }]}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 'auto',
  },
});
