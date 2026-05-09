import { usePhotoCreateDraft } from '../context/PhotoCreateDraftContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo } from 'react';

type Params = {
  challengeId: string;
};

export function useEventChallengePhotoCreatePreviewScreen({ challengeId }: Params) {
  const { goBack } = useCoordinator();
  const {
    addedChallenges,
    deleteChallenge,
    restoreConsumedPhotoSuggestion,
    confirmSingleChallenge,
  } = usePhotoCreateDraft();

  const challenge = useMemo(
    () => addedChallenges.find((c) => c.id === challengeId),
    [addedChallenges, challengeId],
  );

  const onTrash = useCallback(() => {
    if (!challenge) {
      return;
    }
    const toRestore = challenge.consumedSuggestion;
    deleteChallenge(challenge.id);
    if (toRestore) {
      restoreConsumedPhotoSuggestion(toRestore);
    }
    goBack();
  }, [challenge, deleteChallenge, goBack, restoreConsumedPhotoSuggestion]);

  const onConfirm = useCallback(() => {
    if (!challenge) {
      return;
    }
    void confirmSingleChallenge(challenge.id);
  }, [challenge, confirmSingleChallenge]);

  return {
    challenge,
    onTrash,
    onConfirm,
    goBack,
  };
}
