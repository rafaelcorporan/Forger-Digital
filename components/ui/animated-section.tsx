"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"
import { fadeInUp, defaultViewport } from "@/lib/animations"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variants?: Variants
  delay?: number
}

/**
 * Reusable animated section component
 * Wraps content with scroll-triggered fade-in animation
 */
export function AnimatedSection({
  children,
  className = "",
  variants = fadeInUp,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

