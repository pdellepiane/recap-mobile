import { EventStoriesChrome } from '../components/EventStoriesChrome';
import { EventStoriesFallback } from '../components/EventStoriesFallback';
import { useEventStoriesScreen } from '../hooks/useEventStoriesScreen';
import { appendRemoteImageEpoch, useRemoteImageCacheEpoch } from '@/src/ui';
import { Image as ExpoImage } from 'expo-image';
import { StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

type Props = {
  eventId: string;
};

/**
 * Full-screen WhatsApp-style stories: photos, segmented progress, like / dislike.
 */
export function EventStoriesScreenPage({ eventId }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const {
    insets,
    goBack,
    bundle,
    slideCount,
    currentIndex,
    progress,
    goPrev,
    goNext,
    panGesture,
    dimmerStyle,
    mediaShellStyle,
    chromeStyle,
    vote,
    slide,
    tapStripTop,
    tapStripBottom,
    setVote,
  } = useEventStoriesScreen(eventId);

  if (!bundle || slideCount === 0) {
    return <EventStoriesFallback topInset={insets.top} onBack={goBack} />;
  }

  const slideImageUrl = slide?.imageUrl
    ? appendRemoteImageEpoch(slide.imageUrl, mediaCacheEpoch)
    : undefined;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.root, { width: screenW, height: screenH }]} collapsable={false}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Animated.View style={dimmerStyle} pointerEvents="none" />
        <Animated.View style={mediaShellStyle}>
          <ExpoImage
            source={slideImageUrl ? { uri: slideImageUrl } : undefined}
            style={styles.mediaFill}
            contentFit="cover"
            recyclingKey={slide?.id}
            cachePolicy="memory-disk"
          />
        </Animated.View>

        <EventStoriesChrome
          chromeStyle={chromeStyle}
          tapStripTop={tapStripTop}
          tapStripBottom={tapStripBottom}
          topInset={insets.top}
          bottomInset={insets.bottom}
          authorAvatarUrl={bundle.authorAvatarUrl}
          authorName={bundle.authorName}
          slideIds={bundle.slides.map((s) => s.id)}
          currentIndex={currentIndex}
          progress={progress}
          vote={vote}
          onGoPrev={goPrev}
          onGoNext={goNext}
          onBack={goBack}
          onVote={setVote}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  mediaFill: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});
