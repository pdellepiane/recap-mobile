import type { AlbumPhoto } from '../../../data/eventAlbum';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { appendRemoteImageEpoch, colors, useRemoteImageCacheEpoch } from '@/src/ui';
import { Image } from 'expo-image';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const COL_GAP = 8;
const TILE_RADIUS = 12;

type Props = {
  photo: AlbumPhoto;
  width: number;
  onAlbumPhotoLike?: (photoId: string) => void;
};

export const EventDetailAlbumTile = memo(function EventDetailAlbumTile({
  photo,
  width,
  onAlbumPhotoLike,
}: Props) {
  const { t } = useTranslation();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const onLikePress = useCallback(() => {
    if (!onAlbumPhotoLike || photo.id.startsWith('local-')) {
      return;
    }
    onAlbumPhotoLike(photo.id);
  }, [onAlbumPhotoLike, photo.id]);
  const canLike = useMemo(
    () => Boolean(onAlbumPhotoLike && !photo.id.startsWith('local-')),
    [onAlbumPhotoLike, photo.id],
  );
  const tileH = useMemo(() => width / photo.aspectRatio, [photo.aspectRatio, width]);
  const photoUri = useMemo(
    () => appendRemoteImageEpoch(photo.uri, mediaCacheEpoch),
    [mediaCacheEpoch, photo.uri],
  );
  const liked = photo.likedByMe === true;
  const heartColor = useMemo(
    () => (liked ? colors.states.error : colors.neutral.primary),
    [liked],
  );
  const authorAvatarUri = useMemo(
    () =>
      photo.authorAvatarUrl
        ? appendRemoteImageEpoch(photo.authorAvatarUrl, mediaCacheEpoch)
        : null,
    [mediaCacheEpoch, photo.authorAvatarUrl],
  );
  const tileWrapStyle = useMemo(
    () => [styles.tileWrap, { width, marginBottom: COL_GAP }],
    [width],
  );
  const tileImageStyle = useMemo(
    () => [styles.tileImage, { width, height: tileH }],
    [tileH, width],
  );
  return (
    <View style={tileWrapStyle}>
      <Image
        source={{ uri: photoUri }}
        style={tileImageStyle}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
        accessibilityLabel={t('eventDetail.photoA11y', { author: photo.authorShort })}
      />
      <View style={styles.tileOverlay} pointerEvents="box-none">
        <View style={styles.tileMetaRow} pointerEvents="box-none">
          <View style={styles.author} pointerEvents="none">
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
                tintColor={heartColor}
              />
              <Text style={styles.likesCount}>{String(photo.likes)}</Text>
            </Pressable>
          ) : (
            <View style={styles.likes} pointerEvents="none">
              <Image
                source={images.common.heart}
                style={styles.heartIcon}
                contentFit="contain"
                tintColor={heartColor}
              />
              <Text style={styles.likesCount}>{String(photo.likes)}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  tileWrap: {
    borderRadius: TILE_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
  },
  tileImage: {
    backgroundColor: colors.background.tertiary,
  },
  tileOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.overlay.black55,
  },
  tileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  author: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorAvatarPh: {
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarLetter: {
    color: colors.neutral.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  authorName: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heartIcon: {
    width: 16,
    height: 16,
  },
  likesCount: {
    color: colors.neutral.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
