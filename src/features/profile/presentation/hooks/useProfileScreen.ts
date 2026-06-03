import { useProfile } from './useProfile';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useTranslation } from '@/src/i18n';
import { initialsFromFullName } from '@/src/ui/HostInitialsAvatar';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Profile menu screen orchestration: profile data, logout, and menu actions.
 */
export function useProfileScreen() {
  const { t } = useTranslation();
  const { profile, isLoading } = useProfile();
  const { logout, refreshUser } = useAuth();
  const { goToProfileEditName } = useCoordinator();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = profile?.name ?? '-';
  const initials = useMemo(() => initialsFromFullName(displayName), [displayName]);

  const version = useMemo(() => {
    const v = Constants.expoConfig?.version;
    if (!v) return 'unknown';
    return String(v);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser]),
  );

  const performLogout = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
    }
  }, [logout]);

  const handleLogout = useCallback(() => {
    Alert.alert(t('profile.logoutConfirmTitle'), t('profile.logoutConfirmMessage'), [
      { text: t('profile.logoutConfirmNo'), style: 'cancel' },
      {
        text: t('profile.logoutConfirmYes'),
        style: 'destructive',
        onPress: () => {
          void performLogout();
        },
      },
    ]);
  }, [performLogout, t]);

  const handleAccountPress = useCallback(() => {
    goToProfileEditName();
  }, [goToProfileEditName]);

  const handleRate = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }
    try {
      // Expo Store Review shows the native rating prompt.
      await StoreReview.requestReview();
    } catch {
      // Best-effort: if the prompt can't be shown, we don't block the user.
    }
  }, []);

  const handleLegal = useCallback(async () => {
    await Linking.openURL('https://sinenvolturas.com/legal/terms-and-conditions');
  }, []);

  return {
    isLoading,
    isSigningOut,
    displayName,
    initials,
    version,
    handleLogout,
    handleAccountPress,
    handleRate,
    handleLegal,
  };
}
