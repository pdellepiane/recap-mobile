import { Stack } from 'expo-router';

import { routeNames } from '@/src/navigation/routes';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen
        name="home"
        options={{ headerShown: true, title: routeNames.home }}
      />
      <Stack.Screen
        name="event/[id]"
        options={{ headerShown: true, title: routeNames.eventDetail }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: true, title: routeNames.profile }}
      />
    </Stack>
  );
}
