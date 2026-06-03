import { authRepository } from '@/src/core/di/container';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useTranslation } from '@/src/i18n';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

/**
 * Picks a photo from the library and uploads it via POST /api/user/avatar.
 */
export function useProfileAvatarUpload() {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleChangeAvatar = useCallback(async () => {
    if (isUploadingAvatar) {
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('profile.avatarPermissionTitle'), t('profile.avatarPermissionMessage'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled || !result.assets?.[0]?.uri) {
      return;
    }
    setIsUploadingAvatar(true);
    try {
      await authRepository.uploadAvatar(result.assets[0].uri);
      await refreshUser();
    } catch {
      Alert.alert(t('profile.updateError'));
    } finally {
      setIsUploadingAvatar(false);
    }
  }, [isUploadingAvatar, refreshUser, t]);

  return { isUploadingAvatar, handleChangeAvatar };
}
