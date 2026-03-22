// Hook for using safe area insets

import { useState, useEffect } from 'react';
import { getSafeAreaInsets, onOrientationChange, SafeAreaInsets } from '@/lib/accessibility/safe-area-handler';

export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>(getSafeAreaInsets());

  useEffect(() => {
    const updateInsets = () => {
      setInsets(getSafeAreaInsets());
    };

    // Update on orientation change
    const cleanup = onOrientationChange(updateInsets);

    // Update on mount
    updateInsets();

    return cleanup;
  }, []);

  return insets;
}
