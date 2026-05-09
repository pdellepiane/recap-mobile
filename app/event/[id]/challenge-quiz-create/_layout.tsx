import { QuizCreateDraftProvider } from '@/src/features/event-detail/presentation/context/QuizCreateDraftContext';
import { Stack, useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengeQuizCreateLayout() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const eventId = firstString(id) ?? '';

  return (
    <QuizCreateDraftProvider eventId={eventId}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="question" />
      </Stack>
    </QuizCreateDraftProvider>
  );
}
