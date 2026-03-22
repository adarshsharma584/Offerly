// General-purpose Intersection Observer hook

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number | number[]; // Visibility threshold (0-1, default: 0)
  rootMargin?: string; // Root margin (default: '0px')
  root?: Element | null; // Root element (default: viewport)
  enabled?: boolean; // Enable/disable observer (default: true)
  freezeOnceVisible?: boolean; // Stop observing once visible (default: false)
}

export interface IntersectionObserverResult {
  ref: React.RefObject<HTMLElement>;
  entry: IntersectionObserverEntry | null;
  isIntersecting: boolean;
  intersectionRatio: number;
}

/**
 * Hook for general viewport detection using Intersection Observer
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverResult {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    enabled = true,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const frozen = useRef(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    // Don't create observer if frozen
    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);
        setIntersectionRatio(observerEntry.intersectionRatio);

        // Freeze if configured and element is visible
        if (freezeOnceVisible && observerEntry.isIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, root, freezeOnceVisible]);

  return {
    ref: elementRef,
    entry,
    isIntersecting,
    intersectionRatio,
  };
}

/**
 * Hook with callback support
 */
export function useIntersectionObserverCallback(
  callback: (entry: IntersectionObserverEntry) => void,
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    enabled = true,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const frozen = useRef(false);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        callbackRef.current(entry);

        if (freezeOnceVisible && entry.isIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, root, freezeOnceVisible]);

  return elementRef;
}

/**
 * Hook for observing multiple elements
 */
export function useIntersectionObserverMultiple(
  count: number,
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    rootMargin = '0px',
    root = null,
    enabled = true,
  } = options;

  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const [entries, setEntries] = useState<Map<number, IntersectionObserverEntry>>(new Map());
  const [intersectingIndices, setIntersectingIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        observerEntries.forEach((entry) => {
          const index = elementRefs.current.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            setEntries((prev) => {
              const next = new Map(prev);
              next.set(index, entry);
              return next;
            });

            setIntersectingIndices((prev) => {
              const next = new Set(prev);
              if (entry.isIntersecting) {
                next.add(index);
              } else {
                next.delete(index);
              }
              return next;
            });
          }
        });
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    elementRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, count, threshold, rootMargin, root]);

  const setRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      elementRefs.current[index] = element;
    };
  }, []);

  const getEntry = useCallback((index: number) => {
    return entries.get(index) ?? null;
  }, [entries]);

  const isIntersecting = useCallback((index: number) => {
    return intersectingIndices.has(index);
  }, [intersectingIndices]);

  return {
    setRef,
    getEntry,
    isIntersecting,
    intersectingIndices,
    entries,
  };
}

/**
 * Hook for proximity detection (element is near viewport)
 */
export function useProximityDetection(
  proximityMargin: string = '200px',
  options: Omit<UseIntersectionObserverOptions, 'rootMargin'> = {}
) {
  return useIntersectionObserver({
    ...options,
    rootMargin: proximityMargin,
  });
}
