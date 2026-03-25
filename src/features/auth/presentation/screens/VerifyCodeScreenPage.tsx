import { useCoordinator } from "@/src/navigation/useCoordinator";
import { Form } from "@/src/ui";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useVerifyCode } from "../hooks/useVerifyCode";

export const VerifyCodeScreenPage = () => {
  const { sentAt } = useLocalSearchParams<{ sentAt?: string }>();
  const { goToHome } = useCoordinator();
  const onSuccess = useCallback(() => goToHome(), [goToHome]);
  const codeSentAt = sentAt ? parseInt(sentAt, 10) : undefined;
  const {
    digits,
    resendCooldown,
    hasError,
    errorMessage,
    isLoading,
    inputRefs,
    updateDigit,
    handleKeyPress,
    handleResend,
    focusInput,
  } = useVerifyCode(onSuccess, codeSentAt);

  return (
    <Form includesGoBack>
      <View style={styles.digitRow}>
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChangeText={(text) => updateDigit(index, text)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(index, nativeEvent.key)
            }
            keyboardType="number-pad"
            maxLength={6}
            style={[styles.digitInput, hasError && styles.digitInputError]}
            selectTextOnFocus
            onFocus={() => focusInput(index)}
          />
        ))}
      </View>
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>¿No recibiste el código? </Text>
        <Pressable
          onPress={handleResend}
          disabled={resendCooldown > 0}
          hitSlop={8}
        >
          <Text
            style={[
              styles.resendLink,
              resendCooldown > 0 && styles.resendLinkDisabled,
            ]}
          >
            Enviar nuevamente
          </Text>
        </Pressable>
      </View>
      <Text style={styles.cooldownText}>
        {resendCooldown > 0
          ? `Reenviar nuevo código en ${String(Math.floor(resendCooldown / 60)).padStart(2, "0")}:${String(resendCooldown % 60).padStart(2, "0")}s`
          : "Puedes reenviar el código"}
      </Text>

      {isLoading && <Text style={styles.loadingText}>Verificando...</Text>}
    </Form>
  );
};

const styles = StyleSheet.create({
  digitRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  digitInput: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 12,
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  digitInputError: {
    borderColor: "#e53935",
  },
  errorText: {
    color: "#e53935",
    fontSize: 14,
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  resendText: {
    color: "#888",
    fontSize: 14,
  },
  resendLink: {
    color: "#c6e000",
    fontSize: 14,
    fontWeight: "600",
  },
  resendLinkDisabled: {
    color: "#555",
  },
  cooldownText: {
    color: "#666",
    fontSize: 13,
    marginBottom: 24,
  },
  loadingText: {
    color: "#c6e000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 24,
  },
});
