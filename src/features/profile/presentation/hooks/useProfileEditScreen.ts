import { useProfile } from './useProfile';
import { authRepository } from '@/src/core/di/container';
import { getAuthAccessToken } from '@/src/core/http/authSession';
import { persistSessionSnapshot } from '@/src/features/auth/data/sessionStorage';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export function useProfileEditScreen() {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { profile, isLoading } = useProfile();
  const { refreshUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setFirstName(profile.firstName ?? '');
    setLastName(profile.lastName ?? '');
  }, [profile]);

  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  const hasChanges =
    trimmedFirst !== (profile?.firstName ?? '').trim() ||
    trimmedLast !== (profile?.lastName ?? '').trim();
  const canSave = trimmedFirst.length > 0 && trimmedLast.length > 0 && hasChanges && !isSaving;

  const handleSave = useCallback(async () => {
    if (!canSave) {
      return;
    }
    setIsSaving(true);
    try {
      const user = await authRepository.updateProfile(trimmedFirst, trimmedLast);
      const token = getAuthAccessToken()?.trim();
      if (token) {
        await persistSessionSnapshot(token, user);
      }
      await refreshUser();
      goBack();
    } catch {
      Alert.alert(t('profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  }, [canSave, goBack, refreshUser, t, trimmedFirst, trimmedLast]);

  return useMemo(
    () => ({
      isLoading,
      firstName,
      lastName,
      setFirstName,
      setLastName,
      isSaving,
      canSave,
      handleSave,
      handleGoBack: goBack,
    }),
    [canSave, firstName, handleSave, isLoading, isSaving, lastName, goBack],
  );
}
