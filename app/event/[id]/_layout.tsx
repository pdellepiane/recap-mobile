import { EventDetailRouteProvider } from '@/src/features/event-detail/presentation/context/EventDetailRouteContext';
import { UserToastOverlay } from '@/src/ui';
import { Stack, useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Event detail stack: stories use a modal presentation (not a full-screen push).
 * {@link EventDetailRouteProvider} shares event load + guest-list toggle across index and modal routes.
 */
export default function EventIdLayout() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const eventId = firstString(id) ?? '';

  return (
    <EventDetailRouteProvider eventId={eventId}>
      <UserToastOverlay>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="camera"
            options={{
              presentation: 'modal',
              gestureEnabled: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="map" />
          <Stack.Screen name="challenge-quiz" />
          <Stack.Screen
            name="challenge-quiz-create"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="challenge-photo-create"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="challenge-photo" />
          <Stack.Screen
            name="challenge-photo-camera"
            options={{
              presentation: 'modal',
              gestureEnabled: false,
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="challenge-photo-completed" />
          <Stack.Screen
            name="participants"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
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
      </UserToastOverlay>
    </EventDetailRouteProvider>
  );
}
