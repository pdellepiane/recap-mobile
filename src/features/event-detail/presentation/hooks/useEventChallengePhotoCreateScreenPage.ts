import { usePhotoCreateDraft } from '../context/PhotoCreateDraftContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useRef } from 'react';
import type { TextInput } from 'react-native';

type Params = {
  eventId: string;
};

export function useEventChallengePhotoCreateScreenPage({ eventId }: Params) {
  const { goToEventChallengePhotoCreateChallenge } = useCoordinator();
  const inputRef = useRef<TextInput>(null);
  const photoDraft = usePhotoCreateDraft();

  const { composerOpen } = photoDraft;

  useEffect(() => {
    if (!composerOpen) {
      return;
    }
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [composerOpen]);

  const canCommitDraft = photoDraft.draft.trim().length > 0;

  const onPressChallenge = useCallback(
    (challengeId: string) => {
      goToEventChallengePhotoCreateChallenge(eventId, challengeId);
    },
    [eventId, goToEventChallengePhotoCreateChallenge],
  );

  return {
    inputRef,
    onPressChallenge,
    canCommitDraft,
    ...photoDraft,
  };
}
