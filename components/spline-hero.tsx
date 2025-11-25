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
      
      {/* Spline 3D Background - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block absolute inset-0 z-1">
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

      {/* Mobile Layout - NEW ORDER: 3D First, Then Text Content */}
      <div className="relative z-10 md:hidden flex flex-col h-full pt-16 pb-8">
        
        {/* 3D Animation at TOP - 70% Larger and Centered */}
        <div className="flex items-center justify-center min-h-[595px] py-6">
          <div className="relative w-full h-[595px] max-w-2xl mx-auto px-4">
            <iframe 
              src={sceneUrl} 
              frameBorder="0" 
              width="100%" 
              height="100%"
              className="rounded-lg"
              style={{
                minHeight: '595px',
                border: 'none',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* Text Content Below 3D Animation */}
        <div className="container mx-auto px-4 mt-6">
          <motion.div 
            className="text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >

            {/* Main Title */}
            <motion.h1 
              variants={staggerItem}
              className="mb-3 text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-orange-500"
            >
              {heroTitle}
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.h2 
              variants={staggerItem}
              className="mb-4 min-h-[60px] sm:min-h-[70px] text-lg sm:text-xl text-white/90"
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
              className="mb-6 text-base sm:text-lg text-orange-500"
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
              className="flex flex-col items-stretch justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-8"
            >
              <Link href="/get-started" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button 
                    variant="primary-action"
                    size="lg"
                    className="group gap-2 w-full sm:w-auto text-sm sm:text-base !rounded-full"
                  >
                    {heroPrimaryButton}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button 
                    variant="secondary-action"
                    size="lg"
                    className="gap-2 w-full sm:w-auto text-sm sm:text-base !rounded-full"
                  >
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                    {heroSecondaryButton}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

          </motion.div>
        </div>

        {/* Statistics Section at Bottom */}
        <div className="container mx-auto px-4 pt-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center space-x-4 sm:space-x-6"
          >
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                <AnimatedCounter value={50} suffix="+" duration={2.5} />
              </div>
              <div className="text-xs text-white/80 font-medium">{t('stats.projects')}</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                <AnimatedCounter value={98} suffix="%" duration={2.5} />
              </div>
              <div className="text-xs text-white/80 font-medium">{t('stats.satisfaction')}</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                <AnimatedCounter value={21} suffix="+" duration={2.5} />
              </div>
              <div className="text-xs text-white/80 font-medium">{t('stats.experience')}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout - Overlay style (text over 3D background) */}
      <div className="hidden md:flex relative z-10 h-full items-center justify-start py-0">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-4xl text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Main Title */}
            <motion.h1 
              variants={staggerItem}
              className="mb-4 text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-orange-500"
            >
              {heroTitle}
            </motion.h1>

            {/* Animated Subtitle */}
            <motion.h2 
              variants={staggerItem}
              className="mb-6 min-h-[160px] text-2xl lg:text-4xl text-white/90"
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
              className="mb-8 text-lg lg:text-xl text-orange-500"
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
              className="flex flex-row items-start gap-4 lg:gap-6"
            >
              <Link href="/get-started">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="primary-action"
                    size="xl"
                    className="group gap-2 !rounded-full"
                  >
                    {heroPrimaryButton}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/portfolio">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="secondary-action"
                    size="xl"
                    className="gap-2 !rounded-full"
                  >
                    <Play className="h-5 w-5" />
                    {heroSecondaryButton}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Statistics Section - Desktop */}
            <motion.div 
              variants={staggerItem}
              className="flex items-center justify-center space-x-8 lg:space-x-12 pt-12"
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={50} suffix="+" duration={2.5} />
                </div>
                <div className="text-sm lg:text-base text-white/80 font-medium">{t('stats.projects')}</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={98} suffix="%" duration={2.5} />
                </div>
                <div className="text-sm lg:text-base text-white/80 font-medium">{t('stats.satisfaction')}</div>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={21} suffix="+" duration={2.5} />
                </div>
                <div className="text-sm lg:text-base text-white/80 font-medium">{t('stats.experience')}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability - Desktop only */}
      <div className="hidden md:block absolute inset-0 z-5 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
    </section>
  )
}
