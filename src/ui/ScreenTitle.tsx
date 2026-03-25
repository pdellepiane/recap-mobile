import { StyleSheet, Text } from "react-native";

type ScreenTitleProps = {
  children: string;
  style?: object;
};

export function ScreenTitle({ children, style }: ScreenTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "600",
    lineHeight: 44,
    marginBottom: 24,
  },
});
