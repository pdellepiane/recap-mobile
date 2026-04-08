import { useCallback, useEffect, useRef, useState } from 'react';

const STORY_DURATION_MS = 5500;

/**
 * Advances the stories carousel with a progress bar; calls `onFinish` after the last slide.
 */
export function useEventStoriesViewer(slideCount: number, onFinish: () => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (slideCount <= 0) {
      return;
    }
    let cancelled = false;
    let raf = 0;
    const start = Date.now();

    const tick = () => {
      if (cancelled) {
        return;
      }
      const p = (Date.now() - start) / STORY_DURATION_MS;
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
      raf = requestAnimationFrame(tick);
    };

    setProgress(0);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
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

  return { currentIndex, progress, goPrev, goNext };
}
