import { usePhotoCreateDraft } from '../context/PhotoCreateDraftContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useEffect, useRef } from 'react';
import type { TextInput } from 'react-native';

type Params = {
  eventId: string;
};

export function useEventChallengePhotoCreateScreenPage({ eventId: _eventId }: Params) {
  const { goBack } = useCoordinator();
  const inputRef = useRef<TextInput>(null);
  const photoDraft = usePhotoCreateDraft();

  const { composerOpen, isPublishing } = photoDraft;

  useEffect(() => {
    if (!composerOpen) {
      return;
    }
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [composerOpen]);

  const canCommitDraft = photoDraft.draft.trim().length > 0 && !isPublishing;

  return {
    inputRef,
    canCommitDraft,
    goBack,
    ...photoDraft,
  };
}
