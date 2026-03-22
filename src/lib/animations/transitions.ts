// Common transition configurations

import { Transition } from 'framer-motion';
import { ANIMATION_CONFIG } from './config';

export const springTransition: Transition = {
  type: 'spring',
  stiffness: ANIMATION_CONFIG.easing.spring.stiffness,
  damping: ANIMATION_CONFIG.easing.spring.damping,
};

export const smoothTransition: Transition = {
  duration: ANIMATION_CONFIG.duration.normal,
  ease: ANIMATION_CONFIG.easing.smooth,
};

export const bounceTransition: Transition = {
  type: 'spring',
  stiffness: ANIMATION_CONFIG.easing.bounce.stiffness,
  damping: ANIMATION_CONFIG.easing.bounce.damping,
};

export const fastTransition: Transition = {
  duration: ANIMATION_CONFIG.duration.fast,
  ease: ANIMATION_CONFIG.easing.default,
};

export const slowTransition: Transition = {
  duration: ANIMATION_CONFIG.duration.slow,
  ease: ANIMATION_CONFIG.easing.default,
};

export const instantTransition: Transition = {
  duration: ANIMATION_CONFIG.duration.instant,
};
