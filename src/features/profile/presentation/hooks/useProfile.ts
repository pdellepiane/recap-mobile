import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';

/** Profile tab reads the signed-in user from the active auth session. */
export const useProfile = () => {
  const { session, isReady } = useAuth();
  const profile = session?.user ?? null;
  return {
    profile,
    isLoading: !isReady,
  };
};
