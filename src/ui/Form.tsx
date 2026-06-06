import { BackButton, colors, ScreenTitle } from '@/src/ui';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Form = ({
  children,
  title,
  includesGoBack,
  topPaddingExtra = 0,
}: {
  children: React.ReactNode;
  title?: string;
  includesGoBack?: boolean;
  /** Added below the top safe area (e.g. notch / Dynamic Island screens). */
  topPaddingExtra?: number;
}) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={[styles.inner, { paddingTop: insets.top + 16 + topPaddingExtra }]}>
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
    backgroundColor: colors.background.primary,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
