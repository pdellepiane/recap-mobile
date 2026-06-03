import { EventStoriesBottomChrome } from './EventStoriesBottomChrome';
import { EventStoriesTapStrip } from './EventStoriesTapStrip';
import { EventStoriesTopChrome } from './EventStoriesTopChrome';

type Props = {
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
  onPauseProgress: () => void;
  onResumeProgress: () => void;
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
  onPauseProgress,
  onResumeProgress,
  onVote,
}: Props) {
  return (
    <>
      <EventStoriesTapStrip
        chromeStyle={chromeStyle}
        tapStripTop={tapStripTop}
        tapStripBottom={tapStripBottom}
        onGoPrev={onGoPrev}
        onGoNext={onGoNext}
        onPauseProgress={onPauseProgress}
        onResumeProgress={onResumeProgress}
      />

      <EventStoriesTopChrome
        chromeStyle={chromeStyle}
        topInset={topInset}
        authorAvatarUrl={authorAvatarUrl}
        authorName={authorName}
        slideIds={slideIds}
        currentIndex={currentIndex}
        progress={progress}
      />

      <EventStoriesBottomChrome
        chromeStyle={chromeStyle}
        bottomInset={bottomInset}
        vote={vote}
        onVote={onVote}
      />
    </>
  );
}

export { EVENT_STORIES_BOTTOM_CHROME_HEIGHT } from './EventStoriesBottomChrome';
