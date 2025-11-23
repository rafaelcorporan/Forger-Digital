"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"

export function PortfolioSection() {
  const { t, messages } = useTranslation('portfolio')
  
  // Helper to get array values from translations
  // messages is the full messages object, so we need to include 'portfolio.' prefix
  const getArray = (key: string): string[] => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return []
      }
    }
    return Array.isArray(value) ? value : []
  }
  
  const stories = [
    {
      slug: "ecommerce-platform-transformation",
      title: t('stories.ecommerce.title') as string,
      client: t('stories.ecommerce.client') as string,
      challenge: t('stories.ecommerce.challenge') as string,
      solution: t('stories.ecommerce.solution') as string,
      results: getArray('portfolio.stories.ecommerce.results'),
      tags: getArray('portfolio.stories.ecommerce.tags'),
    },
    {
      slug: "enterprise-mobile-app",
      title: t('stories.mobile.title') as string,
      client: t('stories.mobile.client') as string,
      challenge: t('stories.mobile.challenge') as string,
      solution: t('stories.mobile.solution') as string,
      results: getArray('portfolio.stories.mobile.results'),
      tags: getArray('portfolio.stories.mobile.tags'),
    },
  ]

  return (
    <section id="insights" className="border-b border-border bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="mb-16 text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="mb-4 text-balance text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent md:text-4xl"
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-pretty text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* SUCCESS STORIES GRID - MATCHING FEATURE-GRID LAYOUT */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"
        >
          {stories.map((story, index) => (
            <motion.div key={index} variants={staggerItem}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2">
                <div className="p-6">
                {/* Story Number */}
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                  <span className="text-xl font-bold">0{index + 1}</span>
                </div>

                {/* Story Title and Client */}
                <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {story.title}
                </h3>
                <p className="mb-4 text-muted-foreground text-sm">{story.client}</p>

                {/* Challenge */}
                <div className="mb-4">
                  <h4 className="font-semibold text-orange-500 mb-2 text-sm uppercase tracking-wide">{t('challenge')}</h4>
                  <p className="text-muted-foreground text-sm">{story.challenge}</p>
                </div>

                {/* Solution */}
                <div className="mb-4">
                  <h4 className="font-semibold text-orange-500 mb-2 text-sm uppercase tracking-wide">{t('solution')}</h4>
                  <p className="text-muted-foreground text-sm">{story.solution}</p>
                </div>

                {/* Results - Using CheckCircle pattern like feature-grid */}
                <div className="mb-4">
                  <h4 className="font-semibold text-orange-500 mb-2 text-sm uppercase tracking-wide">{t('results')}</h4>
                  <ul className="space-y-2">
                    {story.results.map((result, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags - Matching feature card pattern */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map((tag, idx) => (
                    <Badge key={idx} className="bg-orange-500/10 text-orange-500 border-0 text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>

                  {/* Learn More Link - Matching feature card CTA */}
                  <Link href={`/stories/${story.slug}`} className="text-orange-500 hover:text-orange-600 p-0 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex items-center text-sm font-medium">
                    {t('learnMore')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
