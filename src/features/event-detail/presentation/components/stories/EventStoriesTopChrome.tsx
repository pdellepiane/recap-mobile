import { appendRemoteImageEpoch, colors, useRemoteImageCacheEpoch } from '@/src/ui';
import { Image as ExpoImage } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  chromeStyle: object;
  topInset: number;
  authorAvatarUrl: string;
  authorName: string;
  slideIds: string[];
  currentIndex: number;
  progress: number;
};

export function EventStoriesTopChrome({
  chromeStyle,
  topInset,
  authorAvatarUrl,
  authorName,
  slideIds,
  currentIndex,
  progress,
}: Props) {
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const cachedAuthorAvatarUrl = appendRemoteImageEpoch(authorAvatarUrl, mediaCacheEpoch);

  return (
    <Animated.View
      style={[styles.root, chromeStyle, { paddingTop: topInset + 8 }]}
      pointerEvents="box-none"
    >
      <View style={styles.progressRow}>
        {slideIds.map((id, i) => (
          <View key={id} style={styles.progressSegment}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      i < currentIndex
                        ? '100%'
                        : i === currentIndex
                          ? `${Math.round(progress * 100)}%`
                          : '0%',
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.headerRow}>
        <ExpoImage
          source={{ uri: cachedAuthorAvatarUrl }}
          style={styles.headerAvatar}
          cachePolicy="memory-disk"
        />
        <Text style={styles.headerName} numberOfLines={1}>
          {authorName}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 4,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  progressSegment: {
    flex: 1,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.overlay.white35,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.neutral.primary,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.overlay.white60,
  },
  headerName: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
