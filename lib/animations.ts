/**
 * Animation configuration and variants for Framer Motion
 * Centralized animation definitions for consistent UX across the app
 */

import { Variants } from "framer-motion"

/**
 * Standard animation durations (in seconds)
 */
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  verySlow: 1.2,
} as const

/**
 * Standard easing curves
 */
export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: { type: "spring", stiffness: 100, damping: 15 },
} as const

/**
 * Fade in from bottom animation
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
}

/**
 * Fade in from left animation
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
}

/**
 * Fade in from right animation
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: EASING.easeOut,
    },
  },
}

/**
 * Scale in (zoom in) animation
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: EASING.easeOut,
    },
  },
}

/**
 * Simple fade in animation
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.slow,
    },
  },
}

/**
 * Stagger container for child animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

/**
 * Stagger item (used with staggerContainer)
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal,
    },
  },
}

/**
 * Button hover animation
 */
export const buttonHover = {
  scale: 1.05,
  transition: { duration: ANIMATION_DURATION.fast },
}

/**
 * Button tap animation
 */
export const buttonTap = {
  scale: 0.95,
}

/**
 * Card hover animation
 */
export const cardHover = {
  y: -8,
  transition: {
    duration: ANIMATION_DURATION.fast,
    ease: EASING.easeOut,
  },
}

/**
 * Default viewport configuration for scroll animations
 */
export const defaultViewport = {
  once: true, // Animate only once when entering viewport
  amount: 0.3, // Trigger when 30% of element is visible
  margin: "0px 0px -100px 0px", // Trigger slightly before element enters viewport
}

