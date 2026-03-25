import { Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: object;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : title;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={styles.buttonText}>{displayText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c6e000",
    borderRadius: 24,
    paddingVertical: 16,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
});
