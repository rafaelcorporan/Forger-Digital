"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Zap, Target, Code, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getAboutCardBySlug, getAllAboutCardSlugs, aboutCardData, type AboutCard } from "@/lib/aboutCardData"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/lib/i18n/context"
import { Skeleton } from "@/components/ui/skeleton"

interface AboutCardPageProps {
  params: {
    slug: string
  }
}

// Map about card slugs to translation keys
const slugToTranslationKey: Record<string, string> = {
  "architecture": "architecture",
  "security": "security",
  "performance": "performance",
  "innovation": "innovation",
}

export default function AboutCardPage({ params }: AboutCardPageProps) {
  const { t } = useTranslation('common')
  const { t: tPortfolio } = useTranslation('portfolio')
  const { t: tAbout, messages } = useTranslation('about')
  const [slug, setSlug] = useState<string>("")
  const [card, setCard] = useState<AboutCard | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  
  // Helper to get array values from translations
  // messages is the full messages object, so we need to include 'about.' prefix
  const getArray = (key: string): string[] => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        return []
      }
    }
    return Array.isArray(value) ? value : []
  }

  useEffect(() => {
    // Extract slug from params when component mounts
    const extractSlug = async () => {
      const resolvedParams = await Promise.resolve(params)
      setSlug(resolvedParams.slug)
    }
    extractSlug()
  }, [params])

  useEffect(() => {
    if (slug) {
      const cardData = getAboutCardBySlug(slug)
      setCard(cardData)
      setIsLoading(false)
    }
  }, [slug])
  
  // Get translation key for current card
  const translationKey = slug ? slugToTranslationKey[slug] : null
  // For getArray: needs full path including 'about.'
  // For tAbout: already prepends 'about.', so use without it
  const cardTranslationKeyForArray = translationKey ? `about.cards.${translationKey}` : null
  const cardTranslationKeyForT = translationKey ? `cards.${translationKey}` : null
  
  const Icon = card?.icon

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-32 bg-gray-200 mb-8" />
            <Skeleton className="h-12 w-3/4 bg-gray-200 mb-4" />
            <Skeleton className="h-6 w-1/2 bg-gray-200" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!card) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center pt-32">
          <h1 className="text-3xl font-bold mb-4">{t('notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('notFound')}</p>
          <Link href="/#about">
            <Button className="bg-orange-500 hover:bg-orange-600">{t('back')}</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/#about" className="inline-flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('back')}</span>
          </Link>

          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                {Icon && <Icon className="h-10 w-10 text-white" />}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  {cardTranslationKeyForT ? tAbout(`${cardTranslationKeyForT}.title`) || card.title : card.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {cardTranslationKeyForT ? tAbout(`${cardTranslationKeyForT}.description`) || card.description : card.description}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Detailed Description */}
              <Card className="p-8 border-0 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{t('overview')}</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {cardTranslationKeyForT ? tAbout(`${cardTranslationKeyForT}.detailedContent`) || card.detailedContent : card.detailedContent}
                </p>
              </Card>

              {/* Key Benefits Section */}
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">{t('keyBenefits')}</h2>
                </div>
                <ul className="space-y-4">
                  {(cardTranslationKeyForArray && getArray(`${cardTranslationKeyForArray}.keyBenefits`).length > 0
                    ? getArray(`${cardTranslationKeyForArray}.keyBenefits`)
                    : card.keyBenefits).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Use Cases Section */}
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">{t('useCases')}</h2>
                </div>
                <ul className="space-y-4">
                  {(cardTranslationKeyForArray && getArray(`${cardTranslationKeyForArray}.useCases`).length > 0
                    ? getArray(`${cardTranslationKeyForArray}.useCases`)
                    : card.useCases).map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Methodologies Section */}
              <Card className="p-8 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">{tPortfolio('methodologiesBestPractices') || 'Methodologies & Best Practices'}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {(cardTranslationKeyForArray && getArray(`${cardTranslationKeyForArray}.methodologies`).length > 0
                    ? getArray(`${cardTranslationKeyForArray}.methodologies`)
                    : card.methodologies).map((methodology, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 bg-orange-500/10 text-orange-700 rounded-lg text-sm font-medium"
                    >
                      {methodology}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              {/* Technologies Section */}
              <Card className="mb-8 p-8 border-0 shadow-lg sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="h-6 w-6 text-orange-500" />
                  <h3 className="text-xl font-bold">{t('technologies')}</h3>
                </div>
                <div className="space-y-3">
                  {(cardTranslationKeyForArray && getArray(`${cardTranslationKeyForArray}.technologies`).length > 0
                    ? getArray(`${cardTranslationKeyForArray}.technologies`)
                    : card.technologies).map((tech, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 bg-orange-500/10 text-orange-700 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </Card>

              {/* CTA Section */}
              <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-orange-500 to-pink-600">
                <h3 className="text-xl font-bold text-white mb-4">{tPortfolio('readyToTransform')}</h3>
                <p className="text-white/90 text-sm mb-6">
                  {tPortfolio('readyToTransformDescription')}
                </p>
                <Link href="/#contact" className="block">
                  <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                    {t('contactUs')}
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Related Cards Section */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold mb-8">{t('relatedServices')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {getAllAboutCardSlugs()
                .filter(s => s !== slug)
                .slice(0, 3)
                .map(s => {
                  const relatedCard = getAboutCardBySlug(s)
                  if (!relatedCard) return null
                  const RelatedIcon = relatedCard.icon
                  const relatedTranslationKey = slugToTranslationKey[s]
                  const relatedCardTranslationKeyForT = relatedTranslationKey ? `cards.${relatedTranslationKey}` : null
                  const relatedTitle = relatedCardTranslationKeyForT 
                    ? tAbout(`${relatedCardTranslationKeyForT}.title`) || relatedCard.title
                    : relatedCard.title
                  const relatedDescription = relatedCardTranslationKeyForT
                    ? tAbout(`${relatedCardTranslationKeyForT}.description`) || relatedCard.description
                    : relatedCard.description
                  return (
                    <Link key={s} href={`/about/${s}`}>
                      <Card className="h-full p-6 border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className={`w-16 h-16 bg-gradient-to-br ${relatedCard.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <RelatedIcon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-orange-500 transition-colors">
                          {relatedTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{relatedDescription}</p>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

