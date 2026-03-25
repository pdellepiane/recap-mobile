import { useCoordinator } from "@/src/navigation/useCoordinator";
import { Button, Form, InputField } from "@/src/ui";
import { StyleSheet } from "react-native";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";
import { useLogin } from "../hooks/useLogin";

export const LoginScreenPage = () => {
  const keyboardVisible = useKeyboardVisible();
  const { goToVerifyCode } = useCoordinator();
  const {
    email,
    hasError,
    errorMessage,
    isLoading,
    handleEmailChange,
    handleContinue,
  } = useLogin();

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
        onPress={() => handleContinue(goToVerifyCode)}
        style={[styles.button, { marginBottom: keyboardVisible ? 8 : 48 }]}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: "auto",
  },
});
