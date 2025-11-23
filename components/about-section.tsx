"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Layers, Shield, Zap, Rocket, User, Users } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function AboutSection() {
  const { t } = useTranslation('about')
  
  const features = [
    {
      slug: "architecture",
      icon: Layers,
      title: t('features.architecture.title'),
      description: t('features.architecture.description'),
      color: "from-orange-500 to-orange-600"
    },
    {
      slug: "security",
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
      color: "from-pink-500 to-pink-600"
    },
    {
      slug: "performance",
      icon: Zap,
      title: t('features.performance.title'),
      description: t('features.performance.description'),
      color: "from-purple-500 to-purple-600"
    },
    {
      slug: "innovation",
      icon: Rocket,
      title: t('features.innovation.title'),
      description: t('features.innovation.description'),
      color: "from-orange-500 to-orange-600"
    }
  ]

  const stats = [
    {
      icon: User,
      value: 15,
      suffix: "+",
      label: t('stats.awards')
    },
    {
      icon: Users,
      value: 25,
      suffix: "+",
      label: t('stats.team')
    }
  ]

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <div>
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={fadeInLeft}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              {t('title')}
            </motion.h2>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={staggerContainer}
              className="space-y-6 text-gray-600"
            >
              <motion.p variants={staggerItem} className="text-lg md:text-xl leading-relaxed">
                {t('paragraph1')}
              </motion.p>
              
              <motion.p variants={staggerItem} className="text-lg md:text-xl leading-relaxed">
                {t('paragraph2')}
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6 mt-10"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div key={index} variants={staggerItem}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-black">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-orange-500 to-pink-600">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold mb-2 text-white">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2.5} triggerOnView={true} />
                          </div>
                          <div className="text-gray-400 text-sm">
                            {stat.label}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Right Column - Feature Cards */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={staggerItem}>
                  <Link href={`/about/${feature.slug}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="group relative bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer h-full">
                        {/* Gradient Background on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
                        
                        {/* Card Content */}
                        <div className="relative p-8">
                          {/* Icon Container */}
                          <div className="mb-6">
                            <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl items-center justify-center shadow-xl group-hover:bg-white/20 group-hover:shadow-2xl transition-all duration-500`}>
                              <Icon className="h-10 w-10 text-white" />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-white transition-colors duration-300">
                            {feature.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-600 text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                            {feature.description}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

