// Hook for scroll-based animations

import { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollAnimator, ScrollAnimatorConfig } from '@/lib/animations/scroll-animator';

export interface UseScrollAnimationOptions extends ScrollAnimatorConfig {
  enabled?: boolean; // Enable/disable animation (default: true)
}

/**
 * Hook for detecting when an element enters the viewport
 * Returns a ref to attach to the element and isVisible state
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const animatorRef = useRef<ScrollAnimator | null>(null);
  const { enabled = true, ...config } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    // Create animator instance
    animatorRef.current = new ScrollAnimator(
      {
        onEnter: () => {
          setIsVisible(true);
        },
        onExit: () => {
          if (!config.once) {
            setIsVisible(false);
          }
        },
      },
      config
    );

    // Observe the element
    animatorRef.current.observe(elementRef.current);

    // Cleanup
    return () => {
      animatorRef.current?.destroy();
      animatorRef.current = null;
    };
  }, [enabled, config.threshold, config.rootMargin, config.once, config.root]);

  return { ref: elementRef, isVisible };
}

/**
 * Hook for scroll animations with more control
 * Returns ref, isVisible state, and control functions
 */
export function useScrollAnimationControl(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const animatorRef = useRef<ScrollAnimator | null>(null);
  const { enabled = true, ...config } = options;

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    animatorRef.current = new ScrollAnimator(
      {
        onEnter: (_, observerEntry) => {
          setIsVisible(true);
          setEntry(observerEntry);
        },
        onExit: (_, observerEntry) => {
          if (!config.once) {
            setIsVisible(false);
            setEntry(observerEntry);
          }
        },
        onChange: (_, observerEntry) => {
          setEntry(observerEntry);
        },
      },
      config
    );

    animatorRef.current.observe(elementRef.current);

    return () => {
      animatorRef.current?.destroy();
      animatorRef.current = null;
    };
  }, [enabled, config.threshold, config.rootMargin, config.once, config.root]);

  const reset = useCallback(() => {
    if (elementRef.current && animatorRef.current) {
      animatorRef.current.reset(elementRef.current);
      setIsVisible(false);
      setEntry(null);
    }
  }, []);

  const forceVisible = useCallback(() => {
    setIsVisible(true);
  }, []);

  const forceHidden = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    ref: elementRef,
    isVisible,
    entry,
    reset,
    forceVisible,
    forceHidden,
  };
}

/**
 * Hook for observing multiple elements with stagger
 */
export function useScrollAnimationList(
  count: number,
  options: UseScrollAnimationOptions = {}
) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const animatorRef = useRef<ScrollAnimator | null>(null);
  const { enabled = true, ...config } = options;

  useEffect(() => {
    if (!enabled) return;

    animatorRef.current = new ScrollAnimator(
      {
        onEnter: (element) => {
          const index = elementRefs.current.indexOf(element as HTMLElement);
          if (index !== -1) {
            setVisibleIndices((prev) => new Set(prev).add(index));
          }
        },
        onExit: (element) => {
          if (!config.once) {
            const index = elementRefs.current.indexOf(element as HTMLElement);
            if (index !== -1) {
              setVisibleIndices((prev) => {
                const next = new Set(prev);
                next.delete(index);
                return next;
              });
            }
          }
        },
      },
      config
    );

    // Observe all elements
    elementRefs.current.forEach((element) => {
      if (element) {
        animatorRef.current?.observe(element);
      }
    });

    return () => {
      animatorRef.current?.destroy();
      animatorRef.current = null;
    };
  }, [enabled, count, config.threshold, config.rootMargin, config.once, config.stagger, config.root]);

  const setRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      elementRefs.current[index] = element;
      if (element && animatorRef.current) {
        animatorRef.current.observe(element);
      }
    };
  }, []);

  const isVisible = useCallback((index: number) => {
    return visibleIndices.has(index);
  }, [visibleIndices]);

  const reset = useCallback(() => {
    animatorRef.current?.reset();
    setVisibleIndices(new Set());
  }, []);

  return {
    setRef,
    isVisible,
    visibleIndices,
    reset,
  };
}
