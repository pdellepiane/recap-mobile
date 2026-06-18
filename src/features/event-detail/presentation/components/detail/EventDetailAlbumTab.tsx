import type { AlbumPhoto } from '../../../data/eventAlbum';
import { EventDetailAlbumTile } from './EventDetailAlbumTile';
import { useTranslation } from '@/src/i18n';
import { colors, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const SCROLL_PADDING_X = 20;
const COL_GAP = 8;

type Props = {
  photos: AlbumPhoto[];
  arePhotosLoaded?: boolean;
  isLoadingMore?: boolean;
  onAlbumPhotoLike?: (photoId: string) => void;
  onAlbumPhotoPress?: (photoId: string) => void;
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
export const EventDetailAlbumTab = memo(function EventDetailAlbumTab({
  photos,
  arePhotosLoaded = false,
  isLoadingMore = false,
  onAlbumPhotoLike,
  onAlbumPhotoPress,
}: Props) {
  const { t } = useTranslation();
  const { width: winW } = useWindowDimensions();
  const colW = useMemo(() => {
    const contentW = winW - SCROLL_PADDING_X * 2;
    return (contentW - COL_GAP) / 2;
  }, [winW]);
  const [left, right] = useMemo(() => splitIntoColumns(photos), [photos]);
  const showHostEmpty = useMemo(
    () => arePhotosLoaded && photos.length === 0,
    [arePhotosLoaded, photos.length],
  );
  const leftColStyle = useMemo(() => ({ width: colW }), [colW]);
  const rightColStyle = useMemo(() => ({ width: colW, marginLeft: COL_GAP }), [colW]);

  return (
    <View>
      <Text style={styles.sectionTitle}>{t('eventDetail.albumTitle')}</Text>

      {showHostEmpty ? (
        <Text style={styles.empty}>{t('eventDetail.albumEmpty')}</Text>
      ) : (
        <>
          <View style={styles.masonryRow}>
            <View style={leftColStyle}>
              {left.map((p) => (
                <EventDetailAlbumTile
                  key={p.id}
                  photo={p}
                  width={colW}
                  onAlbumPhotoLike={onAlbumPhotoLike}
                  onAlbumPhotoPress={onAlbumPhotoPress}
                />
              ))}
            </View>
            <View style={rightColStyle}>
              {right.map((p) => (
                <EventDetailAlbumTile
                  key={p.id}
                  photo={p}
                  width={colW}
                  onAlbumPhotoLike={onAlbumPhotoLike}
                  onAlbumPhotoPress={onAlbumPhotoPress}
                />
              ))}
            </View>
          </View>
          {isLoadingMore ? (
            <View style={styles.loadingMore}>
              <Spinner color={colors.states.active} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
});

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
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
