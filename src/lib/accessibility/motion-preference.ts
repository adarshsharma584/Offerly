// Motion preference manager for detecting and managing reduced motion preferences

import { ANIMATION_CONFIG, REDUCED_MOTION_CONFIG } from '../animations/config';

export class MotionPreferenceManager {
  private static instance: MotionPreferenceManager;
  private reducedMotion: boolean = false;
  private listeners: Set<(reduced: boolean) => void> = new Set();
  private mediaQuery: MediaQueryList | null = null;

  private constructor() {
    this.initialize();
  }

  static getInstance(): MotionPreferenceManager {
    if (!MotionPreferenceManager.instance) {
      MotionPreferenceManager.instance = new MotionPreferenceManager();
    }
    return MotionPreferenceManager.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Check for prefers-reduced-motion
    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = this.mediaQuery.matches;

    // Listen for changes
    this.mediaQuery.addEventListener('change', this.handleChange);

    // Check localStorage override
    const override = localStorage.getItem('offerly_reduced_motion');
    if (override !== null) {
      this.reducedMotion = override === 'true';
    }
  }

  private handleChange = (e: MediaQueryListEvent): void => {
    this.reducedMotion = e.matches;
    this.notifyListeners();
  };

  isReducedMotion(): boolean {
    return this.reducedMotion;
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    localStorage.setItem('offerly_reduced_motion', String(reduced));
    this.notifyListeners();
  }

  subscribe(callback: (reduced: boolean) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.reducedMotion));
  }

  getConfig() {
    return this.reducedMotion ? REDUCED_MOTION_CONFIG : ANIMATION_CONFIG;
  }

  cleanup(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleChange);
    }
    this.listeners.clear();
  }
}

export const motionPreference = MotionPreferenceManager.getInstance();
