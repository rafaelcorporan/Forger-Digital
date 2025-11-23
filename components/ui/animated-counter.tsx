"use client"

import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
  triggerOnView?: boolean
}

/**
 * Animated counter that counts up from 0 to target value
 * Uses Framer Motion's useSpring for smooth animation
 * @param triggerOnView - If true, animation starts when element is in viewport
 */
export function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
  className = "",
  triggerOnView = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const motionValue = useSpring(0, { duration: duration * 1000 })
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (triggerOnView) {
      // Only animate when in view
      if (isInView) {
        motionValue.set(value)
      }
    } else {
      // Animate immediately on mount
      motionValue.set(value)
    }
  }, [motionValue, value, isInView, triggerOnView])

  return (
    <motion.span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}

