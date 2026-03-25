import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useCoordinator } from "../navigation/useCoordinator";

type BackButtonProps = {
  style?: ViewStyle | ViewStyle[];
  icon?: string;
  hitSlop?: number;
};

export function BackButton({
  style,
  icon = "‹",
  hitSlop = 12,
}: BackButtonProps) {
  const { goBack } = useCoordinator();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
        style,
      ]}
      onPress={goBack}
      hitSlop={hitSlop}
    >
      <Text style={[styles.backArrow]}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonPressed: {
    opacity: 0.75,
  },
  backArrow: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
});
