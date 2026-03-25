import { BackButton, ScreenTitle } from "@/src/ui";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Form = ({
  children,
  title,
  includesGoBack,
}: {
  children: React.ReactNode;
  title?: string;
  includesGoBack?: boolean;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View style={[styles.inner, { paddingTop: insets.top + 16 }]}>
          {includesGoBack && <BackButton />}
          {title && <ScreenTitle>{title}</ScreenTitle>}
          {children}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
