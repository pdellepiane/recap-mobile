import {
  useEventChallengeQuizCreateScreen,
  type QuizCreateDraftContextValue,
} from '../hooks/useEventChallengeQuizCreateScreen';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

const QuizCreateDraftContext = createContext<QuizCreateDraftContextValue | null>(null);

export function QuizCreateDraftProvider({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) {
  const value = useEventChallengeQuizCreateScreen({ eventId });
  return <QuizCreateDraftContext.Provider value={value}>{children}</QuizCreateDraftContext.Provider>;
}

export function useQuizCreateDraft(): QuizCreateDraftContextValue {
  const ctx = useContext(QuizCreateDraftContext);
  if (!ctx) {
    throw new Error('useQuizCreateDraft must be used within QuizCreateDraftProvider');
  }
  return ctx;
}
