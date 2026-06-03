import { useCallback, useEffect, useRef, useState } from 'react';

const STORY_DURATION_MS = 5500;

type SegmentTiming = {
  segmentStartMs: number;
  segmentOffsetMs: number;
  isPaused: boolean;
  raf: number;
};

/**
 * Advances the stories carousel with a progress bar; calls `onFinish` after the last slide.
 * Hold to pause via {@link pauseProgress} / {@link resumeProgress}.
 */
export function useEventStoriesViewer(slideCount: number, onFinish: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const indexRef = useRef(0);
  const timingRef = useRef<SegmentTiming>({
    segmentStartMs: 0,
    segmentOffsetMs: 0,
    isPaused: false,
    raf: 0,
  });

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const pauseProgress = useCallback(() => {
    const timing = timingRef.current;
    if (timing.isPaused) {
      return;
    }
    timing.isPaused = true;
    timing.segmentOffsetMs += Date.now() - timing.segmentStartMs;
  }, []);

  const resumeProgress = useCallback(() => {
    const timing = timingRef.current;
    if (!timing.isPaused) {
      return;
    }
    timing.isPaused = false;
    timing.segmentStartMs = Date.now();
  }, []);

  useEffect(() => {
    if (slideCount <= 0) {
      return;
    }

    let cancelled = false;
    const timing = timingRef.current;
    timing.segmentStartMs = Date.now();
    timing.segmentOffsetMs = 0;
    timing.isPaused = false;

    const tick = () => {
      if (cancelled) {
        return;
      }

      if (timing.isPaused) {
        timing.raf = requestAnimationFrame(tick);
        return;
      }

      const elapsedMs = timing.segmentOffsetMs + (Date.now() - timing.segmentStartMs);
      const p = elapsedMs / STORY_DURATION_MS;

      if (p >= 1) {
        const idx = indexRef.current;
        if (idx >= slideCount - 1) {
          onFinish();
        } else {
          setCurrentIndex(idx + 1);
        }
        return;
      }

      setProgress(p);
      timing.raf = requestAnimationFrame(tick);
    };

    setProgress(0);
    timing.raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(timing.raf);
    };
  }, [currentIndex, slideCount, onFinish]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => {
      if (i <= 0) {
        return i;
      }
      return i - 1;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      if (i >= slideCount - 1) {
        onFinish();
        return i;
      }
      return i + 1;
    });
  }, [slideCount, onFinish]);

  return { currentIndex, progress, goPrev, goNext, pauseProgress, resumeProgress };
}
