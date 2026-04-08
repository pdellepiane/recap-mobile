import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

type EventStoriesChromeProps = {
  chromeStyle: object;
  tapStripTop: number;
  tapStripBottom: number;
  topInset: number;
  bottomInset: number;
  authorAvatarUrl: string;
  authorName: string;
  slideIds: string[];
  currentIndex: number;
  progress: number;
  vote: 'like' | 'dislike' | null | undefined;
  onGoPrev: () => void;
  onGoNext: () => void;
  onBack: () => void;
  onVote: (value: 'like' | 'dislike') => void;
};

export function EventStoriesChrome({
  chromeStyle,
  tapStripTop,
  tapStripBottom,
  topInset,
  bottomInset,
  authorAvatarUrl,
  authorName,
  slideIds,
  currentIndex,
  progress,
  vote,
  onGoPrev,
  onGoNext,
  onBack,
  onVote,
}: EventStoriesChromeProps) {
  return (
    <>
      <Animated.View
        style={[styles.tapStrip, chromeStyle, { top: tapStripTop, bottom: tapStripBottom }]}
        pointerEvents="box-none"
      >
        <Pressable
          style={styles.tapThird}
          onPress={onGoPrev}
          accessibilityRole="button"
          accessibilityLabel="Estado anterior"
        />
        <View style={styles.tapThird} pointerEvents="none" />
        <Pressable
          style={styles.tapThird}
          onPress={onGoNext}
          accessibilityRole="button"
          accessibilityLabel="Siguiente estado"
        />
      </Animated.View>

      <Animated.View
        style={[styles.topChrome, chromeStyle, { paddingTop: topInset + 8 }]}
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
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Cerrar estados"
          >
            <Ionicons name="close" size={28} color={colors.neutral.primary} />
          </Pressable>
          <ExpoImage source={{ uri: authorAvatarUrl }} style={styles.headerAvatar} />
          <Text style={styles.headerName} numberOfLines={1}>
            {authorName}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.bottomChrome, chromeStyle, { paddingBottom: bottomInset + 20 }]}
        pointerEvents="box-none"
      >
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => onVote('like')}
            style={[styles.actionBtn, vote === 'like' && styles.actionBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Me gusta"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={vote === 'like' ? 'heart' : 'heart-outline'}
              size={32}
              color={colors.neutral.primary}
            />
          </Pressable>
          <Pressable
            onPress={() => onVote('dislike')}
            style={[styles.actionBtn, vote === 'dislike' && styles.actionBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="No me gusta"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={vote === 'dislike' ? 'thumbs-down' : 'thumbs-down-outline'}
              size={30}
              color={colors.neutral.primary}
            />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  tapStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 3,
  },
  tapThird: {
    flex: 1,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 4,
    backgroundColor: colors.overlay.black35,
    paddingBottom: 12,
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
  bottomChrome: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 40,
    paddingHorizontal: 24,
    zIndex: 4,
    backgroundColor: colors.overlay.black45,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 28,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 999,
  },
  actionBtnActive: {
    backgroundColor: colors.overlay.white20,
  },
});
