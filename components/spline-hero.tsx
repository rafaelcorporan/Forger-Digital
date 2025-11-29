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
  const heroTitle = title || "Cutting-edge, advanced, and forward-thinking technology. We transform your digital vision into robust, scalable reality."
  const heroSubtitle = subtitle || ""
  const heroDescription = description || "Forge Digital: Evokes craftsmanship, creation, & building robust solutions. Digital: Broadly encompasses the digital realm, including web, app, & software by Innovative, powerful skilles."
  const heroPrimaryButton = primaryButtonText || "Start a Project"
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
    <section className="relative min-h-fit md:h-screen w-full overflow-hidden bg-gray-900">
      {/* Very Dark Grey Background */}
      <div className="absolute inset-0 z-0 bg-gray-900"></div>

      {/* Spline 3D Background - Full screen on ALL devices */}
      <div className="absolute inset-0 z-0 hidden md:block">
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

      {/* Mobile Layout - Content OVERLAID on Spline background */}
      <div className="relative z-10 md:hidden flex flex-col justify-center items-center min-h-screen px-4 text-center bg-black/40 backdrop-blur-[2px]">
        <div className="container mx-auto flex flex-col items-center justify-center gap-8 py-20">
          <motion.div
            className="flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={staggerItem}
              className="text-lg sm:text-xl font-medium leading-relaxed text-white drop-shadow-md max-w-lg mx-auto"
            >
              Cutting-edge, advanced, and forward-thinking technology. We transform your digital vision into robust, scalable reality.
            </motion.h2>

            {/* Description - Orange */}
            <motion.p
              variants={staggerItem}
              className="text-sm sm:text-base text-orange-500 font-medium leading-relaxed max-w-md mx-auto drop-shadow-md"
            >
              <span className="font-bold">Forge Digital:</span> Evokes craftsmanship, creation, & building robust solutions. <span className="font-bold">Digital:</span> Broadly encompasses the digital realm, including web, app, & software by Innovative, powerful skilles.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col items-center justify-center gap-4 mt-6 w-full"
            >
              <Link href="/get-started" className="w-full max-w-xs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button
                    variant="primary-action"
                    size="lg"
                    className="group gap-2 h-14 w-full text-base !rounded-full bg-orange-600 hover:bg-orange-700 text-white border-none shadow-lg shadow-orange-900/20"
                  >
                    {heroPrimaryButton}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/portfolio" className="w-full max-w-xs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 h-14 w-full text-base !rounded-full bg-transparent border-white text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    View Our Work
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Statistics Section */}
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-center space-x-8 mt-10 border-t border-white/10 pt-8"
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="text-2xl font-bold text-white mb-1">
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
                <div className="text-2xl font-bold text-white mb-1">
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
                <div className="text-2xl font-bold text-white mb-1">
                  <AnimatedCounter value={21} suffix="+" duration={2.5} />
                </div>
                <div className="text-xs text-white/80 font-medium">{t('stats.experience')}</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout - Overlay style (text over 3D background) */}
      <div className="hidden md:flex relative z-10 h-full items-center justify-start py-0">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="mr-auto max-w-2xl text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Subtitle */}
            <motion.h2
              variants={staggerItem}
              className="mb-6 text-2xl lg:text-4xl text-white font-medium leading-snug"
            >
              Cutting-edge, advanced, and forward-thinking technology. We transform your digital vision into robust, scalable reality.
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="mb-8 text-lg lg:text-xl text-orange-500 font-medium leading-relaxed"
            >
              <span className="font-bold">Forge Digital:</span> Evokes craftsmanship, creation, & building robust solutions. <span className="font-bold">Digital:</span> Broadly encompasses the digital realm, including web, app, & software by Innovative, powerful skilles.
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
