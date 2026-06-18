import { EventDetailTab } from './eventDetailTabs';
import { useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const ALBUM_LOAD_MORE_THRESHOLD_PX = 320;

type Params = {
  activeTab: EventDetailTab;
  albumHasMore: boolean;
  isLoadingMoreAlbum: boolean;
  onAlbumLoadMore?: () => void;
};

export function useEventDetailAlbumScrollLoadMore({
  activeTab,
  albumHasMore,
  isLoadingMoreAlbum,
  onAlbumLoadMore,
}: Params) {
  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        activeTab !== EventDetailTab.Album ||
        !onAlbumLoadMore ||
        !albumHasMore ||
        isLoadingMoreAlbum
      ) {
        return;
      }
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      if (distanceFromBottom <= ALBUM_LOAD_MORE_THRESHOLD_PX) {
        onAlbumLoadMore();
      }
    },
    [activeTab, albumHasMore, isLoadingMoreAlbum, onAlbumLoadMore],
  );
}
