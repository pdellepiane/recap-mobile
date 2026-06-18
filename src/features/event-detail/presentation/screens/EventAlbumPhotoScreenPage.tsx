import { useEventAlbumPhotoScreen } from '../hooks/useEventAlbumPhotoScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import {
  CloseButton,
  ScreenLoading,
  ScreenNotFoundFallback,
  appendRemoteImageEpoch,
  colors,
  useRemoteImageCacheEpoch,
} from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  eventId: string;
  mediaId: string;
};

export function EventAlbumPhotoScreenPage({ eventId, mediaId }: Props) {
  const { t } = useTranslation();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const { photo, isLoading, goBack, onLikePress } = useEventAlbumPhotoScreen({
    eventId,
    mediaId,
  });

  const photoUri = useMemo(
    () => (photo ? appendRemoteImageEpoch(photo.uri, mediaCacheEpoch) : null),
    [mediaCacheEpoch, photo],
  );
  const authorAvatarUri = useMemo(
    () =>
      photo?.authorAvatarUrl
        ? appendRemoteImageEpoch(photo.authorAvatarUrl, mediaCacheEpoch)
        : null,
    [mediaCacheEpoch, photo?.authorAvatarUrl],
  );

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!photo || !photoUri) {
    return (
      <ScreenNotFoundFallback title={t('eventDetail.albumPhotoNotFound')} onBackPress={goBack} />
    );
  }

  const liked = photo.likedByMe === true;
  const canLike = !photo.id.startsWith('local-');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <CloseButton onPress={goBack} accessibilityLabel={t('common.close')} />
      </View>

      <View style={styles.imageWrap}>
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={150}
          accessibilityLabel={t('eventDetail.photoA11y', { author: photo.authorShort })}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.author}>
          {authorAvatarUri ? (
            <Image
              source={{ uri: authorAvatarUri }}
              style={styles.authorAvatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={[styles.authorAvatar, styles.authorAvatarPh]}>
              <Text style={styles.authorAvatarLetter}>
                {photo.authorShort.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.authorName} numberOfLines={1}>
            {photo.authorShort}
          </Text>
        </View>

        {canLike ? (
          <Pressable
            style={styles.likes}
            onPress={onLikePress}
            accessibilityRole="button"
            accessibilityLabel={t('eventDetail.albumLikeA11y')}
            hitSlop={8}
          >
            <Image
              source={images.common.heart}
              style={styles.heartIcon}
              contentFit="contain"
              tintColor={liked ? colors.states.error : colors.neutral.primary}
            />
            <Text style={styles.likesCount}>{String(photo.likes)}</Text>
          </Pressable>
        ) : (
          <View style={styles.likes}>
            <Image
              source={images.common.heart}
              style={styles.heartIcon}
              contentFit="contain"
              tintColor={liked ? colors.states.error : colors.neutral.primary}
            />
            <Text style={styles.likesCount}>{String(photo.likes)}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  author: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorAvatarPh: {
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarLetter: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  authorName: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heartIcon: {
    width: 22,
    height: 22,
  },
  likesCount: {
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
});
