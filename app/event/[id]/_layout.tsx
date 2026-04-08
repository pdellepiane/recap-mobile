import { Stack } from 'expo-router';

/**
 * Event detail stack: stories use a modal presentation (not a full-screen push).
 */
export default function EventIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
      <Stack.Screen name="challenge-quiz" />
      <Stack.Screen name="challenge-photo" />
      <Stack.Screen name="challenge-photo-camera" />
      <Stack.Screen name="challenge-photo-completed" />
      <Stack.Screen
        name="stories"
        options={{
          /** Transparent modal: dragging down reveals event detail outside the circle. */
          presentation: 'transparentModal',
          gestureEnabled: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
          animationDuration: 260,
        }}
      />
    </Stack>
  );
}
