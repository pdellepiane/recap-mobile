import type { EventChallengeApiItem } from '@/src/core/api/types';
import { mapChallengeApiTypeToKind } from '@/src/features/events/data/eventChallengesMap';
import { EventChallengeKind } from '@/src/features/event-detail/data/eventChallenges';
import type { PhotoCreateAddedChallenge } from '@/src/features/event-detail/presentation/hooks/useEventChallengePhotoCreateScreen';

export function photoDraftFromRemoteChallenge(
  remoteChallengeId: string,
  item: EventChallengeApiItem,
): PhotoCreateAddedChallenge | null {
  if (mapChallengeApiTypeToKind(item.type) !== EventChallengeKind.Photo) {
    return null;
  }
  const title = item.question?.trim() || item.title?.trim();
  if (!title) {
    return null;
  }
  return {
    id: `edit-${remoteChallengeId}`,
    title,
    remoteChallengeId,
  };
}

export function resolveEditRemotePhotoChallengeId(opts: {
  remoteChallengeId?: string;
  challengeId?: string;
}): string | undefined {
  const fromQuery = opts.remoteChallengeId?.trim();
  if (fromQuery) {
    return fromQuery;
  }
  const cid = opts.challengeId?.trim();
  if (!cid?.startsWith('edit-')) {
    return undefined;
  }
  const remote = cid.slice('edit-'.length).trim();
  return remote.length > 0 ? remote : undefined;
}
