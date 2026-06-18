import { EVENT_STORIES_BOTTOM_CHROME_HEIGHT } from '../components/stories/EventStoriesChrome';
import { buildEventStoriesBundle, type EventStoriesBundle } from '../../data/eventStories';
import { hostsLineForDetailView } from '../../data/eventDetailDerived';
import { isEventOrganizerForUser } from '../../data/eventOrganizer';
import { useEventDetailRoute } from '../context/EventDetailRouteContext';
import { useEventStoriesViewer } from './useEventStoriesViewer';
import { useSwipeDownToClose } from './useSwipeDownToClose';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Vote = 'like' | 'dislike';

/**
 * Owns stories-viewer state and interactions (progress, swipe-close, voting).
 */
export function useEventStoriesScreen(eventId: string) {
  const insets = useSafeAreaInsets();
  const { goBack } = useCoordinator();
  const { event } = useEventDetailRoute();
  const { session } = useAuth();
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const [isLoading, setIsLoading] = useState(true);
  const [bundle, setBundle] = useState<EventStoriesBundle | null>(null);
  const slideCount = bundle?.slides.length ?? 0;
  const [votes, setVotes] = useState<Partial<Record<number, Vote>>>({});

  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      setBundle(null);
      return undefined;
    }
    const controller = beginRequest();
    void (async () => {
      setIsLoading(true);
      try {
        const slides = await eventRepository.fetchEventStorySlides(eventId, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) {
          return;
        }
        const isOrganizer = isEventOrganizerForUser(event, session?.user.id);
        const authorName =
          event && session
            ? hostsLineForDetailView(event, {
                isOrganizer,
                sessionUserName: session.user.name,
              })
            : '';
        setBundle(
          buildEventStoriesBundle(slides, {
            name: authorName,
            avatarUrl: event?.coverImageUrl,
          }),
        );
      } catch (e) {
        if (!isAbortError(e) && !controller.signal.aborted) {
          setBundle(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
        endRequest(controller);
      }
    })();
    return () => {
      abortAll();
    };
  }, [abortAll, beginRequest, endRequest, event, eventId, session]);

  const onFinish = useCallback(() => {
    goBack();
  }, [goBack]);

  const { currentIndex, progress, goPrev, goNext, pauseProgress, resumeProgress } =
    useEventStoriesViewer(slideCount, onFinish);
  const { panGesture, dimmerStyle, mediaShellStyle, chromeStyle } = useSwipeDownToClose(
    onFinish,
    currentIndex,
  );

  const vote = votes[currentIndex];
  const slide = bundle?.slides[currentIndex];
  const tapStripTop = insets.top + 100;
  const tapStripBottom = insets.bottom + EVENT_STORIES_BOTTOM_CHROME_HEIGHT;

  const setVote = (v: Vote) => {
    setVotes((prev) => ({
      ...prev,
      [currentIndex]: prev[currentIndex] === v ? undefined : v,
    }));
  };

  return {
    insets,
    goBack,
    isLoading,
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
    pauseProgress,
    resumeProgress,
  };
}
