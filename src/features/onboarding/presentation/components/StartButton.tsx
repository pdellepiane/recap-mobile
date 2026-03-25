import { Pressable, StyleSheet, Text, View } from "react-native";

type StartButtonProps = {
  onPress: () => void;
  bottomInset: number;
};

export function StartButton({ onPress, bottomInset }: StartButtonProps) {
  return (
    <View style={[styles.buttonContainer, { paddingBottom: bottomInset + 48 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Empezar</Text>
        <Text style={styles.buttonArrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    minWidth: 200,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
  },
});
