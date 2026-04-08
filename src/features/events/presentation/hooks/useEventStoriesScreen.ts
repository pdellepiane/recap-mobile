import { getEventStoriesBundle } from '../data/eventStories';
import { useEventStoriesViewer } from './useEventStoriesViewer';
import { useSwipeDownToClose } from './useSwipeDownToClose';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Vote = 'like' | 'dislike';

/**
 * Owns stories-viewer state and interactions (progress, swipe-close, voting).
 */
export function useEventStoriesScreen(eventId: string) {
  const insets = useSafeAreaInsets();
  const { goBack } = useCoordinator();
  const bundle = useMemo(() => getEventStoriesBundle(eventId), [eventId]);
  const slideCount = bundle?.slides.length ?? 0;
  const [votes, setVotes] = useState<Partial<Record<number, Vote>>>({});

  const onFinish = useCallback(() => {
    goBack();
  }, [goBack]);

  const { currentIndex, progress, goPrev, goNext } = useEventStoriesViewer(slideCount, onFinish);
  const { panGesture, dimmerStyle, mediaShellStyle, chromeStyle } = useSwipeDownToClose(
    onFinish,
    currentIndex,
  );

  const vote = votes[currentIndex];
  const slide = bundle?.slides[currentIndex];
  const tapStripTop = insets.top + 100;
  const tapStripBottom = insets.bottom + 100;

  const setVote = (v: Vote) => {
    setVotes((prev) => ({
      ...prev,
      [currentIndex]: prev[currentIndex] === v ? undefined : v,
    }));
  };

  return {
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
  };
}
