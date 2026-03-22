// Hook for parallax scroll effects

import { useEffect, useRef } from 'react';
import { getGlobalParallaxController, ParallaxConfig } from '@/lib/animations/parallax-controller';
import { motionPreference } from '@/lib/accessibility/motion-preference';

export interface UseParallaxOptions extends ParallaxConfig {
  enabled?: boolean; // Enable/disable parallax (default: true)
}

/**
 * Hook for adding parallax scroll effect to an element
 * Returns a ref to attach to the element
 */
export function useParallax(options: UseParallaxOptions = {}) {
  const elementRef = useRef<HTMLElement | null>(null);
  const { enabled = true, ...config } = options;

  useEffect(() => {
    // Don't register if disabled or reduced motion is preferred
    if (!enabled || motionPreference.isReducedMotion() || !elementRef.current) {
      return;
    }

    const controller = getGlobalParallaxController();
    const element = elementRef.current;

    // Register element with controller
    controller.register(element, config);

    // Cleanup
    return () => {
      controller.unregister(element);
    };
  }, [
    enabled,
    config.speed,
    config.direction,
    config.maxOffset,
    config.proximity,
    config.smooth,
    config.smoothFactor,
  ]);

  return elementRef;
}

/**
 * Hook for parallax with control functions
 */
export function useParallaxControl(options: UseParallaxOptions = {}) {
  const elementRef = useRef<HTMLElement | null>(null);
  const { enabled = true, ...config } = options;

  useEffect(() => {
    if (!enabled || motionPreference.isReducedMotion() || !elementRef.current) {
      return;
    }

    const controller = getGlobalParallaxController();
    const element = elementRef.current;

    controller.register(element, config);

    return () => {
      controller.unregister(element);
    };
  }, [
    enabled,
    config.speed,
    config.direction,
    config.maxOffset,
    config.proximity,
    config.smooth,
    config.smoothFactor,
  ]);

  const reset = () => {
    if (elementRef.current) {
      const controller = getGlobalParallaxController();
      controller.reset(elementRef.current);
    }
  };

  const updateConfig = (newConfig: Partial<ParallaxConfig>) => {
    if (elementRef.current) {
      const controller = getGlobalParallaxController();
      controller.updateConfig(elementRef.current, newConfig);
    }
  };

  return {
    ref: elementRef,
    reset,
    updateConfig,
  };
}

/**
 * Hook for multiple parallax elements with different speeds
 */
export function useParallaxMultiple(
  count: number,
  getConfig: (index: number) => ParallaxConfig = (index) => ({ speed: 0.5 + index * 0.1 })
) {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (motionPreference.isReducedMotion()) {
      return;
    }

    const controller = getGlobalParallaxController();

    // Register all elements
    elementRefs.current.forEach((element, index) => {
      if (element) {
        controller.register(element, getConfig(index));
      }
    });

    // Cleanup
    return () => {
      elementRefs.current.forEach((element) => {
        if (element) {
          controller.unregister(element);
        }
      });
    };
  }, [count, getConfig]);

  const setRef = (index: number) => {
    return (element: HTMLElement | null) => {
      elementRefs.current[index] = element;
    };
  };

  return { setRef };
}
