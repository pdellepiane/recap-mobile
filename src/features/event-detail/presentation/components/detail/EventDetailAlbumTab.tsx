import type { AlbumPhoto } from '../../../data/eventAlbum';
import { EventDetailAlbumTile } from './EventDetailAlbumTile';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const SCROLL_PADDING_X = 20;
const COL_GAP = 8;

type Props = {
  photos: AlbumPhoto[];
  onAlbumPhotoLike?: (photoId: string) => void;
};

/** Splits photos into two columns by approximate height (masonry-style). */
function splitIntoColumns(items: AlbumPhoto[]): [AlbumPhoto[], AlbumPhoto[]] {
  const left: AlbumPhoto[] = [];
  const right: AlbumPhoto[] = [];
  let leftWeight = 0;
  let rightWeight = 0;
  for (const item of items) {
    const weight = 1 / item.aspectRatio;
    if (leftWeight <= rightWeight) {
      left.push(item);
      leftWeight += weight;
    } else {
      right.push(item);
      rightWeight += weight;
    }
  }
  return [left, right];
}

/**
 * Album tab: title + two-column grid with author and likes on each photo.
 */
export function EventDetailAlbumTab({ photos, onAlbumPhotoLike }: Props) {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const contentW = winW - SCROLL_PADDING_X * 2;
  const colW = (contentW - COL_GAP) / 2;
  const [left, right] = splitIntoColumns(photos);

  return (
    <View>
      <Text style={styles.sectionTitle}>{t('eventDetail.albumTitle')}</Text>

      {photos.length === 0 ? (
        <Text style={styles.empty}>{t('eventDetail.albumEmpty')}</Text>
      ) : (
        <View style={styles.masonryRow}>
          <View style={{ width: colW }}>
            {left.map((p) => (
              <EventDetailAlbumTile
                key={p.id}
                photo={p}
                width={colW}
                onLikePress={
                  onAlbumPhotoLike && !p.id.startsWith('local-')
                    ? () => onAlbumPhotoLike(p.id)
                    : undefined
                }
              />
            ))}
          </View>
          <View style={{ width: colW, marginLeft: COL_GAP }}>
            {right.map((p) => (
              <EventDetailAlbumTile
                key={p.id}
                photo={p}
                width={colW}
                onLikePress={
                  onAlbumPhotoLike && !p.id.startsWith('local-')
                    ? () => onAlbumPhotoLike(p.id)
                    : undefined
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 16,
  },
  empty: {
    color: colors.neutral.secondary,
    fontSize: 15,
  },
  masonryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
