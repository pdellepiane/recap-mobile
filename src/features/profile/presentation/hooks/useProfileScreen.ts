import { useProfile } from './useProfile';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Profile screen orchestration: profile data loading and logout action state.
 */
export function useProfileScreen() {
  const { profile, isLoading } = useProfile();
  const { logout, refreshUser } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser]),
  );

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
