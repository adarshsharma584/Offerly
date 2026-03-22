// Reusable Framer Motion animation variants

import { Variants } from 'framer-motion';
import { ANIMATION_CONFIG } from './config';

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: ANIMATION_CONFIG.duration.normal }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_CONFIG.duration.fast }
  },
};

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: ANIMATION_CONFIG.transform.slideDistance },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.default
    }
  },
  exit: { 
    opacity: 0, 
    y: -ANIMATION_CONFIG.transform.slideDistance,
    transition: { duration: ANIMATION_CONFIG.duration.fast }
  },
};

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: ANIMATION_CONFIG.transform.scaleDown },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.default
    }
  },
  exit: { 
    opacity: 0, 
    scale: ANIMATION_CONFIG.transform.scaleDown,
    transition: { duration: ANIMATION_CONFIG.duration.fast }
  },
};

export const slideInVariants: Variants = {
  initial: { x: '100%' },
  animate: { 
    x: 0,
    transition: { 
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.default
    }
  },
  exit: { 
    x: '100%',
    transition: { duration: ANIMATION_CONFIG.duration.fast }
  },
};

export const staggerContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.normal,
    },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.98,
    y: ANIMATION_CONFIG.transform.slideDistance 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.easing.default
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.98,
    transition: { duration: ANIMATION_CONFIG.duration.fast }
  },
};
