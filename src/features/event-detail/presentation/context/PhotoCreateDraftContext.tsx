import {
  useEventChallengePhotoCreateScreen,
  type PhotoCreateDraftContextValue,
} from '../hooks/useEventChallengePhotoCreateScreen';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

const PhotoCreateDraftContext = createContext<PhotoCreateDraftContextValue | null>(null);

export function PhotoCreateDraftProvider({
  eventId,
  editRemoteChallengeId,
  children,
}: {
  eventId: string;
  editRemoteChallengeId?: string;
  children: ReactNode;
}) {
  const value = useEventChallengePhotoCreateScreen({ eventId, editRemoteChallengeId });
  return (
    <PhotoCreateDraftContext.Provider value={value}>{children}</PhotoCreateDraftContext.Provider>
  );
}

export function usePhotoCreateDraft(): PhotoCreateDraftContextValue {
  const ctx = useContext(PhotoCreateDraftContext);
  if (!ctx) {
    throw new Error('usePhotoCreateDraft must be used within PhotoCreateDraftProvider');
  }
  return ctx;
}
