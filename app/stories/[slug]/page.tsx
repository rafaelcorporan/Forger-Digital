"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle, Zap, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsContentWithLoading } from "@/components/ui/tabs"
import { getStoryBySlug } from "@/lib/storiesData"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useState, useMemo, useRef } from "react"
import { SkeletonCard, SkeletonList } from "@/components/ui/skeleton-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n/context"

interface StoryPageProps {
  params: {
    slug: string
  }
}

export default function StoryPage({ params }: StoryPageProps) {
  const { t } = useTranslation('common')
  const { t: tPortfolio, messages, locale } = useTranslation('portfolio')
  const [story, setStory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")
  const processedRef = useRef<{ slug: string; locale: string } | null>(null)

  // Map slug to translation key
  const slugToTranslationKey: Record<string, string> = {
    "ecommerce-platform-transformation": "ecommerce",
    "enterprise-mobile-app": "mobile"
  }

  useEffect(() => {
    // Extract slug from params when component mounts
    const extractSlug = async () => {
      const resolvedParams = await Promise.resolve(params)
      setSlug(resolvedParams.slug)
    }
    extractSlug()
  }, [params])

  // Memoize translated story to prevent infinite loops
  // Only recompute when slug or locale actually changes
  // messages is derived from locale, so we don't need it in dependencies
  const translatedStory = useMemo(() => {
    if (!slug) return null
    
    const storyData = getStoryBySlug(slug)
    if (!storyData) return null

    const translationKey = slugToTranslationKey[slug]
    if (translationKey) {
      // Helper function to get array values from translations
      // Access messages directly - it's stable based on locale
      const getArray = (key: string): any[] => {
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

      // Override with translated content
      return {
        ...storyData,
        overview: tPortfolio(`stories.${translationKey}.overview`) || storyData.overview,
        detailedChallenge: tPortfolio(`stories.${translationKey}.detailedChallenge`) || storyData.detailedChallenge,
        detailedSolution: tPortfolio(`stories.${translationKey}.detailedSolution`) || storyData.detailedSolution,
        timeline: getArray(`portfolio.stories.${translationKey}.timeline`).length > 0 
          ? getArray(`portfolio.stories.${translationKey}.timeline`)
          : storyData.timeline,
        outcomes: getArray(`portfolio.stories.${translationKey}.outcomes`).length > 0
          ? getArray(`portfolio.stories.${translationKey}.outcomes`)
          : storyData.outcomes,
        technology: getArray(`portfolio.stories.${translationKey}.technology`).length > 0
          ? getArray(`portfolio.stories.${translationKey}.technology`)
          : storyData.technology
      }
    }
    return storyData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale])

  useEffect(() => {
    if (slug && translatedStory) {
      // Only update if slug or locale has changed
      const key = `${slug}-${locale}`
      if (processedRef.current?.slug !== slug || processedRef.current?.locale !== locale) {
        setStory(translatedStory)
        setIsLoading(false)
        processedRef.current = { slug, locale }
      }
    }
  }, [slug, locale, translatedStory])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            {/* Back Button Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-10 w-32 bg-gray-200" />
            </div>

            {/* Header Skeleton */}
            <div className="mb-12">
              <Skeleton className="h-6 w-24 bg-gray-200 rounded-full mb-4" />
              <Skeleton className="h-12 w-3/4 bg-gray-200 mb-4" />
              <Skeleton className="h-6 w-1/2 bg-gray-200 mb-4" />
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-6 w-20 bg-gray-200 rounded-full" />
                <Skeleton className="h-6 w-24 bg-gray-200 rounded-full" />
                <Skeleton className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-12">
              <SkeletonCard showImage={false} lines={5} />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!story) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center pt-32">
          <h1 className="text-3xl font-bold mb-4">{t('storyNotFound')}</h1>
          <p className="text-gray-600 mb-8">{t('storyNotFoundDescription')}</p>
          <Link href="/#insights">
            <Button className="bg-orange-500 hover:bg-orange-600">{t('backToSuccessStories')}</Button>
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
          <Link href="/#insights" className="inline-flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('backToSuccessStories')}</span>
          </Link>

          {/* Header Section */}
          <div className="mb-12">
            <div className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-semibold mb-4">
              {tPortfolio('caseStudy')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {story.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-4">{story.client}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {story.tags.map((tag: string, idx: number) => (
                <Badge key={idx} className="bg-orange-500 text-white border-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <Card className="border-0 shadow-lg p-8 mb-12">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
              aria-label="Story details tabs"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-lg" role="tablist">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
                  aria-label="Overview tab"
                >
                  {tPortfolio('overview')}
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
                  aria-label="Timeline tab"
                >
                  {tPortfolio('timeline')}
                </TabsTrigger>
                <TabsTrigger 
                  value="outcomes"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all"
                  aria-label="Outcomes tab"
                >
                  {tPortfolio('outcomes')}
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{tPortfolio('overview')}</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{story.overview}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Challenge */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="h-6 w-6 text-orange-500" />
                      <h3 className="text-xl font-bold">{tPortfolio('challenge')}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{story.detailedChallenge}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="h-6 w-6 text-orange-500" />
                      <h3 className="text-xl font-bold">{tPortfolio('solution')}</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{story.detailedSolution}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{tPortfolio('projectTimeline')}</h2>
                <div className="space-y-4">
                  {story.timeline.map((phase: any, idx: number) => (
                    <Card key={idx} className="p-6 border-l-4 border-orange-500">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-foreground">{phase.phase}</h3>
                        <Badge className="bg-orange-500/10 text-orange-600 border-0">{phase.duration}</Badge>
                      </div>
                      <p className="text-gray-700">{phase.description}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes" className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-foreground">{tPortfolio('keyOutcomesMetrics')}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {story.outcomes.map((outcome: any, idx: number) => (
                    <Card key={idx} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <BarChart3 className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">{outcome.metric}</p>
                      <p className="text-3xl font-bold text-orange-500">{outcome.value}</p>
                    </Card>
                  ))}
                </div>

                {/* Technology Stack */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-4 text-foreground">{tPortfolio('technologyStack')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {story.technology.map((tech: string, idx: number) => (
                      <Badge key={idx} className="bg-orange-500/10 text-orange-600 border-0 px-4 py-2">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* CTA Section */}
          <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-orange-500 to-pink-600">
            <h2 className="text-2xl font-bold text-white mb-4">{tPortfolio('readyToTransform')}</h2>
            <p className="text-white/90 text-lg mb-6">
              {tPortfolio('readyToTransformDescription')}
            </p>
            <Link href="/#contact">
              <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                {tPortfolio('getInTouch')}
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
