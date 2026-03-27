import { AuthSync } from '@/src/features/auth/presentation/AuthSync';
import { AuthProvider } from '@/src/features/auth/presentation/context/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, TextInput, type TextInputProps, type TextProps } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

type ComponentWithDefaultProps<TProps extends object> = {
  defaultProps?: Partial<TProps> & { style?: unknown };
};

export default function RootLayout() {
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-Italic': require('../assets/fonts/PlusJakartaSans-Italic.ttf'),
    'PlusJakartaSans-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'Signika-Light': require('../assets/fonts/Signika-Light.ttf'),
  });

  useEffect(() => {
    if (!loaded) {
      return;
    }

    // Default global typography (para acercarnos a los pantallazos sin tocar cada Text).
    const textWithDefaults = Text as typeof Text & ComponentWithDefaultProps<TextProps>;
    textWithDefaults.defaultProps = textWithDefaults.defaultProps ?? {};
    const prevTextStyle = textWithDefaults.defaultProps.style;
    textWithDefaults.defaultProps.style = [
      prevTextStyle,
      { fontFamily: 'PlusJakartaSans-Regular' },
    ];

    const textInputWithDefaults = TextInput as typeof TextInput &
      ComponentWithDefaultProps<TextInputProps>;
    textInputWithDefaults.defaultProps = textInputWithDefaults.defaultProps ?? {};
    const prevInputStyle = textInputWithDefaults.defaultProps.style;
    textInputWithDefaults.defaultProps.style = [
      prevInputStyle,
      { fontFamily: 'PlusJakartaSans-Regular' },
    ];

    void SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthSync />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="verify-code" />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
