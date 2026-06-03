import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Pressable,
  Image as RNImage,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ProfileMenuHeaderProps = {
  displayName: string;
  initials: string;
  avatarUrl?: string;
  isUploadingAvatar?: boolean;
  onChangeAvatar?: () => void;
};

export function ProfileMenuHeader({
  displayName,
  initials,
  avatarUrl,
  isUploadingAvatar = false,
  onChangeAvatar,
}: ProfileMenuHeaderProps) {
  const { t } = useTranslation();
  const avatarDisabled = isUploadingAvatar || !onChangeAvatar;

  return (
    <View style={styles.root}>
      <View style={styles.avatarWrap}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        {isUploadingAvatar ? (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator color={colors.neutral.primary} />
          </View>
        ) : null}
        <Pressable
          style={styles.cameraButton}
          onPress={onChangeAvatar}
          disabled={avatarDisabled}
          accessibilityRole="button"
          accessibilityLabel={t('profile.changeAvatarA11y')}
          hitSlop={8}
        >
          <RNImage
            source={images.common.camera.icon}
            style={styles.cameraIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <Text style={styles.userName}>{displayName}</Text>
    </View>
  );
}

const AVATAR_SIZE = 72;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 40,
    paddingBottom: 30,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.states.warning,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  avatarText: {
    fontFamily: fontFamilies.signikaSemiBold,
    fontSize: 36,
    color: colors.background.primary,
  },
  cameraButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent[600],
  },
  cameraIcon: {
    width: 13,
    height: 13,
  },
  userName: {
    fontFamily: fontFamilies.medium,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
    color: colors.neutral.primary,
    textAlign: 'center',
  },
});
