"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface SplineHeroComponentProps {
  sceneUrl?: string
  title?: string
  subtitle?: string
  description?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export function SplineHeroComponent({
  sceneUrl = 'https://my.spline.design/interactiveaiwebsite-3lum05amhbPWBKUXhwxEzA1I/',
  title,
  subtitle,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick
}: SplineHeroComponentProps) {
  const { t } = useTranslation('hero')
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  // Use translations or fallback to props/defaults
  const heroTitle = title || t('title')
  const heroSubtitle = subtitle || t('subtitle')
  const heroDescription = description || t('description')
  const heroPrimaryButton = primaryButtonText || t('primaryButton')
  const heroSecondaryButton = secondaryButtonText || t('secondaryButton')

  useEffect(() => {
    setText("") // Reset text when subtitle changes
    let index = 0
    const typingInterval = setInterval(() => {
      if (index < heroSubtitle.length) {
        setText(heroSubtitle.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
    }
  }, [heroSubtitle])

  return (
    <section className="relative min-h-[85vh] md:h-screen w-full overflow-hidden bg-gray-900">
      {/* Very Dark Grey Background */}
      <div className="absolute inset-0 z-0 bg-gray-900"></div>
      
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-1">
        <iframe 
          src={sceneUrl} 
          frameBorder="0" 
          width="100%" 
          height="100%"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            border: 'none',
            zIndex: 1
          }}
        />
        {/* Overlay to hide Spline watermark badge */}
        <div 
          className="absolute bottom-0 left-0 w-48 h-16 bg-gray-900 pointer-events-none"
          style={{ zIndex: 2 }}
          aria-hidden="true"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full items-center justify-start py-8 md:py-0">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <motion.div 
            className="mx-auto max-w-4xl text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >

            {/* Main Title */}
            <motion.h1 
              variants={staggerItem}
              className="mb-4 text-5xl font-bold leading-tight tracking-tight text-orange-500 md:text-7xl"
            >
              {heroTitle}
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.h2 
              variants={staggerItem}
              className="mb-6 min-h-[80px] text-2xl text-white/90 md:min-h-[160px] md:text-4xl"
            >
              {text.length > 0 && text.startsWith('Forger Digital:') ? (
                <>
                  <span className="font-bold">Forger Digital:</span>
                  {text.length > 'Forger Digital:'.length && (
                    <span className="font-normal"> {text.substring('Forger Digital:'.length)}</span>
                  )}
                </>
              ) : text.length > 0 && text.length <= 'Forger Digital:'.length ? (
                <span className="font-bold">{text}</span>
              ) : (
                text
              )}
              {showCursor && <span className="text-orange-500">|</span>}
            </motion.h2>

            {/* Description */}
            <motion.p 
              variants={staggerItem}
              className="mb-8 text-lg text-orange-500 md:text-xl"
            >
              {heroDescription.startsWith('Forge Digital:') ? (
                <>
                  <span className="font-bold">Forge Digital:</span>
                  <span className="font-normal"> {heroDescription.replace('Forge Digital:', '')}</span>
                </>
              ) : (
                heroDescription
              )}
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              variants={staggerItem}
              className="flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-start w-full sm:w-auto"
            >
              <Link href="/get-started" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button 
                    variant="primary-action"
                    size="xl"
                    className="group gap-2 w-full sm:w-auto"
                  >
                    {heroPrimaryButton}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button 
                    variant="secondary-action"
                    size="xl"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Play className="h-5 w-5" />
                    {heroSecondaryButton}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Statistics Section - Animated Counters */}
            <motion.div 
              variants={staggerItem}
              className="flex items-center justify-center space-x-6 sm:space-x-8 md:space-x-12 pt-8 md:pt-12"
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={50} suffix="+" duration={2.5} />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 font-medium">{t('stats.projects')}</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={98} suffix="%" duration={2.5} />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 font-medium">{t('stats.satisfaction')}</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={21} suffix="+" duration={2.5} />
                </div>
                <div className="text-xs sm:text-sm md:text-base text-white/80 font-medium">{t('stats.experience')}</div>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
    </section>
  )
}
