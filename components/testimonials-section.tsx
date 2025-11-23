"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"

export function TestimonialsSection() {
  const { t } = useTranslation('testimonials')
  
  const testimonials = [
    {
      quote: t('testimonial1.quote'),
      name: t('testimonial1.name'),
      position: t('testimonial1.position'),
      initials: "SJ",
      color: "from-orange-500 to-orange-600"
    },
    {
      quote: t('testimonial2.quote'),
      name: t('testimonial2.name'),
      position: t('testimonial2.position'),
      initials: "MC",
      color: "from-pink-500 to-pink-600"
    },
    {
      quote: t('testimonial3.quote'),
      name: t('testimonial3.name'),
      position: t('testimonial3.position'),
      initials: "ER",
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card
                className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ backgroundColor: '#111827' }}
              >
                {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 italic mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-lg">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.position}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

