import { resolveEditRemotePhotoChallengeId } from '@/src/features/event-detail/data/eventChallengePhotoEdit';
import { PhotoCreateDraftProvider } from '@/src/features/event-detail/presentation/context/PhotoCreateDraftContext';
import { UserToastOverlay } from '@/src/ui';
import { Stack, useLocalSearchParams } from 'expo-router';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function ChallengePhotoCreateLayout() {
  const { id, remoteChallengeId, challengeId, challengeNumber } = useLocalSearchParams<{
    id?: string | string[];
    remoteChallengeId?: string | string[];
    challengeId?: string | string[];
    challengeNumber?: string | string[];
  }>();
  const eventId = firstString(id) ?? '';
  const editRemoteChallengeId =
    firstString(remoteChallengeId) ??
    resolveEditRemotePhotoChallengeId({ challengeId: firstString(challengeId) });

  return (
    <PhotoCreateDraftProvider eventId={eventId} editRemoteChallengeId={editRemoteChallengeId}>
      <UserToastOverlay>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="challenge" />
        </Stack>
      </UserToastOverlay>
    </PhotoCreateDraftProvider>
  );
}
