'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const SCROLL_THRESHOLD_PX = 400;

/**
 * Throttles a function to run at most once per `limitMs`.
 */
function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const elapsed = now - lastRun;
    if (elapsed >= limitMs) {
      lastRun = now;
      fn.apply(this, args);
    } else if (timeoutId === null) {
      timeoutId = setTimeout(
        () => {
          lastRun = Date.now();
          timeoutId = null;
          fn.apply(this, args);
        },
        limitMs - elapsed
      );
    }
  };
}

/**
 * Returns the scroll visibility threshold: 400px or one viewport height, whichever is smaller.
 * So on short viewports we show after ~1 viewport; on larger ones after 400px.
 */
function getScrollThreshold(): number {
  if (typeof window === 'undefined') return SCROLL_THRESHOLD_PX;
  return Math.min(SCROLL_THRESHOLD_PX, window.innerHeight);
}

/**
 * Global hook for "Scroll to Top" button visibility.
 * - Hidden on initial load.
 * - Shown only after scrolling down 400px (or one viewport height, whichever is smaller).
 * - Uses throttled scroll listener for performance.
 */
export function useScrollToTopVisibility(throttleMs = 100): boolean {
  const [visible, setVisible] = useState(false);
  const thresholdRef = useRef(getScrollThreshold());
  const rafRef = useRef<number | null>(null);

  const updateVisibility = useCallback(() => {
    if (typeof window === 'undefined') return;
    thresholdRef.current = getScrollThreshold();
    const show = window.scrollY >= thresholdRef.current;
    setVisible(show);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Set initial state from current scroll (e.g. after client nav)
    updateVisibility();

    const throttledUpdate = throttle(updateVisibility, throttleMs);

    const handleScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        throttledUpdate();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateVisibility, throttleMs]);

  return visible;
}
