// Hook for subscribing to reduced motion preferences

import { useState, useEffect } from 'react';
import { motionPreference } from '@/lib/accessibility/motion-preference';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(
    motionPreference.isReducedMotion()
  );

  useEffect(() => {
    const unsubscribe = motionPreference.subscribe(setReducedMotion);
    return unsubscribe;
  }, []);

  return reducedMotion;
}
