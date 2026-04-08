import type { AlbumPhoto } from '../data/eventAlbum';
import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

const COL_GAP = 8;
const TILE_RADIUS = 12;

type EventDetailAlbumTileProps = {
  photo: AlbumPhoto;
  width: number;
};

export function EventDetailAlbumTile({ photo, width }: EventDetailAlbumTileProps) {
  const tileH = width / photo.aspectRatio;
  return (
    <View style={[styles.tileWrap, { width, marginBottom: COL_GAP }]}>
      <Image
        source={{ uri: photo.uri }}
        style={[styles.tileImage, { width, height: tileH }]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={150}
        accessibilityLabel={`Foto de ${photo.authorShort}`}
      />
      <View style={styles.tileOverlay} pointerEvents="none">
        <View style={styles.tileMetaRow}>
          <View style={styles.author}>
            {photo.authorAvatarUrl ? (
              <Image
                source={{ uri: photo.authorAvatarUrl }}
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
          <View style={styles.likes}>
            <Ionicons name="heart-outline" size={16} color={colors.neutral.primary} />
            <Text style={styles.likesCount}>{String(photo.likes)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

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
  likesCount: {
    color: colors.neutral.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
