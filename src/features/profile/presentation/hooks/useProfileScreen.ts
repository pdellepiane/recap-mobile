import { useProfile } from './useProfile';
import { useProfileAvatarUpload } from './useProfileAvatarUpload';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { initialsFromFullName } from '@/src/ui/HostInitialsAvatar';
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
  const { goToProfileEdit } = useCoordinator();
  const { isUploadingAvatar, handleChangeAvatar } = useProfileAvatarUpload();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const displayName = profile?.name ?? '-';
  const avatarUrl = profile?.avatarUrl;
  const initials = useMemo(() => initialsFromFullName(displayName), [displayName]);

  const version = useMemo(() => {
    const v = Constants.expoConfig?.version;
    if (!v) return 'unknown';
    return String(v);
  }, []);

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
    goToProfileEdit();
  }, [goToProfileEdit]);

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshUser();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUser]);

  return {
    isLoading,
    isRefreshing,
    isSigningOut,
    displayName,
    initials,
    avatarUrl,
    isUploadingAvatar,
    handleChangeAvatar,
    version,
    handleLogout,
    handleAccountPress,
    handleRate,
    handleLegal,
    handleRefresh,
  };
}
