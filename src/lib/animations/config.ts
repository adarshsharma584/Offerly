// Animation configuration and constants for the UI Enhancement Suite

export const ANIMATION_CONFIG = {
  // Duration presets (in seconds)
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
    verySlow: 0.6,
  },
  
  // Easing functions
  easing: {
    default: [0.22, 1, 0.36, 1] as const,        // Smooth ease-out
    spring: { type: 'spring' as const, stiffness: 300, damping: 30 },
    bounce: { type: 'spring' as const, stiffness: 400, damping: 10 },
    smooth: [0.4, 0, 0.2, 1] as const,           // Material Design standard
  },
  
  // Stagger delays (in seconds)
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.1,
  },
  
  // Transform values
  transform: {
    slideDistance: 20,
    liftDistance: 4,
    scaleDown: 0.95,
    scaleUp: 1.05,
    tiltMax: 5,
  },
  
  // Performance thresholds
  performance: {
    maxParticles: 30,
    maxGlassLayers: 5,
    maxGlowElements: 7,
    scrollThrottle: 16, // ~60fps
    minFPS: 50,
  },
} as const;

export const REDUCED_MOTION_CONFIG = {
  duration: {
    instant: 0,
    fast: 0.1,
    normal: 0.1,
    slow: 0.1,
    verySlow: 0.1,
  },
  disableParallax: true,
  disableParticles: true,
  disable3D: true,
  disableMorphing: true,
} as const;

// Type exports for better TypeScript support
export type AnimationDuration = keyof typeof ANIMATION_CONFIG.duration;
export type AnimationEasing = keyof typeof ANIMATION_CONFIG.easing;
export type StaggerDelay = keyof typeof ANIMATION_CONFIG.stagger;
