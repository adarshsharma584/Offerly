// Haptic feedback manager for providing tactile feedback on supported devices

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export interface HapticConfig {
  enabled?: boolean;
  patterns?: Record<HapticPattern, number | number[]>;
}

export class HapticFeedbackManager {
  private static instance: HapticFeedbackManager;
  private enabled: boolean = true;
  private supported: boolean = false;

  private patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    error: [30, 50, 30],
  };

  private constructor() {
    this.initialize();
  }

  static getInstance(): HapticFeedbackManager {
    if (!HapticFeedbackManager.instance) {
      HapticFeedbackManager.instance = new HapticFeedbackManager();
    }
    return HapticFeedbackManager.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Check for vibration API support
    this.supported = 'vibrate' in navigator;

    // Check user preference
    const preference = localStorage.getItem('offerly_haptic_enabled');
    if (preference !== null) {
      this.enabled = preference === 'true';
    }
  }

  isSupported(): boolean {
    return this.supported;
  }

  isEnabled(): boolean {
    return this.enabled && this.supported;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('offerly_haptic_enabled', String(enabled));
  }

  trigger(pattern: HapticPattern): void {
    if (!this.isEnabled()) return;

    const vibrationPattern = this.patterns[pattern];
    
    try {
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  cleanup(): void {
    // Stop any ongoing vibration
    if (this.supported) {
      navigator.vibrate(0);
    }
  }
}

export const hapticFeedback = HapticFeedbackManager.getInstance();
