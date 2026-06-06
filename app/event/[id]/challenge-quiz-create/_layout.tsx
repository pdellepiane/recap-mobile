import { QuizCreateDraftProvider } from '@/src/features/event-detail/presentation/context/QuizCreateDraftContext';
import { UserToastOverlay } from '@/src/ui';
import { Stack, useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengeQuizCreateLayout() {
  const { id, challengeId } = useLocalSearchParams<{
    id?: string | string[];
    challengeId?: string | string[];
  }>();
  const eventId = firstString(id) ?? '';
  const editRemoteChallengeId = firstString(challengeId);

  return (
    <QuizCreateDraftProvider eventId={eventId} editRemoteChallengeId={editRemoteChallengeId}>
      <UserToastOverlay>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="question" />
        </Stack>
      </UserToastOverlay>
    </QuizCreateDraftProvider>
  );
}
