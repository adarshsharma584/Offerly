// Hook for using haptic feedback

import { useCallback } from 'react';
import { hapticFeedback, HapticPattern } from '@/lib/accessibility/haptic-feedback';

export function useHapticFeedback() {
  const trigger = useCallback((pattern: HapticPattern) => {
    hapticFeedback.trigger(pattern);
  }, []);

  return {
    trigger,
    isSupported: hapticFeedback.isSupported(),
    isEnabled: hapticFeedback.isEnabled(),
  };
}
