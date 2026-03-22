// Safe area utilities for handling notched devices and system UI

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Gets the current safe area insets from CSS environment variables
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseSafeAreaValue(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
    right: parseSafeAreaValue(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
    bottom: parseSafeAreaValue(style.getPropertyValue('env(safe-area-inset-bottom)')) || 12,
    left: parseSafeAreaValue(style.getPropertyValue('env(safe-area-inset-left)')) || 0,
  };
}

/**
 * Parses a safe area CSS value to a number
 */
function parseSafeAreaValue(value: string): number {
  if (!value) return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Applies safe area padding to an element
 */
export function applySafeAreaPadding(
  element: HTMLElement,
  sides: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left']
): void {
  sides.forEach(side => {
    element.style.setProperty(
      `padding-${side}`,
      `max(${element.style.getPropertyValue(`padding-${side}`) || '0px'}, env(safe-area-inset-${side}, 12px))`
    );
  });
}

/**
 * Gets CSS string for safe area padding
 */
export function getSafeAreaPaddingCSS(
  side: 'top' | 'right' | 'bottom' | 'left',
  fallback: string = '12px'
): string {
  return `env(safe-area-inset-${side}, ${fallback})`;
}

/**
 * Checks if the device has a notch or safe area
 */
export function hasNotch(): boolean {
  if (typeof window === 'undefined') return false;
  
  const insets = getSafeAreaInsets();
  return insets.top > 20 || insets.bottom > 20;
}

/**
 * Gets the orientation of the device
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Listens for orientation changes
 */
export function onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOrientationChange = () => {
    callback(getOrientation());
  };

  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('orientationchange', handleOrientationChange);

  return () => {
    window.removeEventListener('resize', handleOrientationChange);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
}
