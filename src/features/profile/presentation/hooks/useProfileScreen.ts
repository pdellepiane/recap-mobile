import { useProfile } from './useProfile';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCallback, useState } from 'react';

/**
 * Profile screen orchestration: profile data loading and logout action state.
 */
export function useProfileScreen() {
  const { profile, isLoading } = useProfile();
  const { logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  }, [logout]);

  return { profile, isLoading, isSigningOut, handleLogout };
}
