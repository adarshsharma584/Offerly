// Gesture hooks for swipe, drag, and other touch interactions

import { useEffect, useRef, useCallback } from 'react';
import { SwipeHandler, SwipeCallbacks, SwipeConfig } from '@/lib/gestures/swipe-handler';

/**
 * Hook for detecting swipe gestures on an element
 */
export function useSwipe(callbacks: SwipeCallbacks, config?: SwipeConfig) {
  const elementRef = useRef<HTMLElement | null>(null);
  const handlerRef = useRef<SwipeHandler | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Create swipe handler
    handlerRef.current = new SwipeHandler(elementRef.current, callbacks, config);

    // Cleanup on unmount
    return () => {
      handlerRef.current?.destroy();
      handlerRef.current = null;
    };
  }, [callbacks, config]);

  // Update callbacks when they change
  useEffect(() => {
    if (handlerRef.current) {
      handlerRef.current.updateCallbacks(callbacks);
    }
  }, [callbacks]);

  // Update config when it changes
  useEffect(() => {
    if (handlerRef.current && config) {
      handlerRef.current.updateConfig(config);
    }
  }, [config]);

  return elementRef;
}

/**
 * Hook for getting swipe event handlers (alternative approach)
 * Returns handlers that can be spread onto an element
 */
export function useSwipeHandlers(callbacks: SwipeCallbacks, config?: SwipeConfig) {
  const handlerRef = useRef<SwipeHandler | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const attachHandler = useCallback((element: HTMLElement | null) => {
    if (!element) {
      handlerRef.current?.destroy();
      handlerRef.current = null;
      elementRef.current = null;
      return;
    }

    if (elementRef.current === element) return;

    // Destroy previous handler
    handlerRef.current?.destroy();

    // Create new handler
    elementRef.current = element;
    handlerRef.current = new SwipeHandler(element, callbacks, config);
  }, [callbacks, config]);

  useEffect(() => {
    return () => {
      handlerRef.current?.destroy();
      handlerRef.current = null;
    };
  }, []);

  return attachHandler;
}
