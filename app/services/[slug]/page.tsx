"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Zap, Target, Code, Shield, Award, Camera, Building2, Users, Briefcase, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getServiceBySlug, getAllSlugs, serviceData, type ServiceDetail } from "@/lib/serviceData"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/lib/i18n/context"
import { Skeleton } from "@/components/ui/skeleton"
import { ServiceSchema, BreadcrumbSchema } from "@/components/seo-schema"

interface ServicePageProps {
  params: {
    slug: string
  }
}

// Map service slugs to translation keys (matching feature-grid.tsx)
const slugToTranslationKey: Record<string, string> = {
  "custom-software-development": "customSoftwareDevelopment",
  "web-application-development": "webApplicationDevelopment",
  "mobile-app-development": "mobileAppDevelopment",
  "enterprise-solutions": "enterpriseSolutions",
  "emerging-technologies": "emergingTechnologies",
  "digital-transformation": "digitalTransformation",
  "kubernetes-cluster-design": "kubernetesClusterDesign",
  "infrastructure-as-code-terraform": "infrastructureAsCode",
  "cloud-platform-specialization": "cloudPlatformSpecialization",
  "serverless-event-driven": "serverlessEventDriven",
  "restful-graphql-api": "restfulGraphqlApi",
  "enterprise-integration-middleware": "enterpriseIntegrationMiddleware",
  "third-party-saas-integrations": "thirdPartySaaSIntegrations",
  "api-security-compliance": "apiSecurityCompliance",
  "application-performance-optimization": "applicationPerformanceOptimization",
  "database-performance-scaling": "databasePerformanceScaling",
  "load-testing-capacity-planning": "loadTestingCapacityPlanning",
  "monitoring-observability-analytics": "monitoringObservabilityAnalytics",
  "application-security-appsec": "applicationSecurityAppSec",
  "identity-access-management": "identityAccessManagement",
  "data-protection-privacy": "dataProtectionPrivacy",
  "compliance-audit-frameworks": "complianceAuditFrameworks",
  "security-as-a-service": "securityAsAService",
  "dedicated-development-teams": "dedicatedDevelopmentTeams",
  "technical-leadership-architecture": "technicalLeadershipArchitecture",
  "mentorship-skills-development": "mentorshipSkillsDevelopment",
  "project-management-delivery": "projectManagementDelivery",
}

export default function ServicePage({ params }: ServicePageProps) {
  const { t } = useTranslation('common')
  const { t: tPortfolio } = useTranslation('portfolio')
  const { t: tFeatures, messages } = useTranslation('features')
  const [slug, setSlug] = useState<string>("")
  const [service, setService] = useState<ServiceDetail | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  
  // Helper to get array values from translations
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
      const serviceData = getServiceBySlug(slug)
      setService(serviceData)
      setIsLoading(false)
    }
  }, [slug])
  
  // Get translation key for current service
  const translationKey = slug ? slugToTranslationKey[slug] : null
  // For getArray: needs full path including 'features.'
  // For tFeatures: already prepends 'features.', so use without it
  const serviceTranslationKeyForArray = translationKey ? `features.services.${translationKey}` : null
  const serviceTranslationKeyForT = translationKey ? `services.${translationKey}` : null

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
              <Skeleton className="h-6 w-1/2 bg-gray-200" />
            </div>
            {/* Content Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full bg-gray-200" />
                <Skeleton className="h-64 w-full bg-gray-200" />
              </div>
              <div>
                <Skeleton className="h-64 w-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!service) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center pt-32">
          <h1 className="text-3xl font-bold mb-4">{t('serviceNotFound')}</h1>
          <p className="text-gray-600 mb-8">{t('serviceNotFoundDescription')}</p>
          <Link href="/#services">
            <Button className="bg-orange-500 hover:bg-orange-600">{t('backToServices')}</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/#services" },
    { name: service.title, url: `/services/${service.slug}` },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* SEO Schema Markup */}
      <ServiceSchema service={service} />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/#services" className="inline-flex items-center gap-2 px-4 py-2 text-orange-500 hover:text-orange-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t('backToServices')}</span>
          </Link>

          {/* Header Section */}
          <div className="mb-12">
                     <div className="inline-block px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-semibold mb-4">
                       {serviceTranslationKeyForT ? tFeatures(`${serviceTranslationKeyForT}.category`) || service.category : service.category}
                     </div>
                     <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                       {serviceTranslationKeyForT ? tFeatures(`${serviceTranslationKeyForT}.title`) || service.title : service.title}
                     </h1>
                       <p className="text-xl text-gray-600 max-w-2xl">
                         {serviceTranslationKeyForT ? tFeatures(`${serviceTranslationKeyForT}.description`) || service.description : service.description}
                       </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Detailed Description */}
              <Card className="mb-8 p-8 border-0 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{t('overview')}</h2>
                       <p className="text-gray-700 leading-relaxed">
                         {serviceTranslationKeyForT ? tFeatures(`${serviceTranslationKeyForT}.detailedContent`) || service.detailedContent : service.detailedContent}
                       </p>
              </Card>

              {/* Portfolio Matrix Section - Only for Security-as-a-Service */}
              {slug === "security-as-a-service" && (
                <>
                  {/* Why Choose Section */}
                  <Card className="mb-8 p-8 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-pink-50">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="h-6 w-6 text-orange-500" />
                      <h2 className="text-2xl font-bold">Why Choose Security-as-a-Service?</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Reduce IT burden while gaining access to certified security experts (CISSP, CISM, CEH). Our scalable solutions provide proactive threat management, compliance-ready storage, and professional monitoring options that adapt to your organization's size and needs.
                    </p>
                    <ul className="space-y-3 mt-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Access to certified security professionals (CISSP, CISM, CEH, CySA+)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Scalable protection that grows with your organization</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Proactive threat detection and incident response</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Compliance-ready solutions (HIPAA, GDPR, SOC 2)</span>
                      </li>
                    </ul>
                  </Card>

                  {/* Portfolio Matrix */}
                  <Card className="mb-8 p-8 border-0 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="h-6 w-6 text-orange-500" />
                      <h2 className="text-2xl font-bold">Tailored Security Solutions for Every Organization</h2>
                    </div>
                    <p className="text-gray-600 mb-8">Choose the tier that best fits your organization's size, budget, and security requirements.</p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      {/* Bronze Tier */}
                      <Card className="p-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                          <h3 className="text-xl font-bold text-amber-800">Bronze Tier</h3>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">Target: Nonprofits, Small Businesses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">SimpliSafe Security Cameras</span>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Basic HD indoor/outdoor cameras (1-4 units)</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Self-installed with guided setup</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>30-day cloud storage</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span>Email support (24-48h response)</span>
                          </li>
                        </ul>
                        <div className="pt-4 border-t border-amber-200">
                          <p className="text-xs text-gray-600 mb-2">Starting at</p>
                          <p className="text-lg font-bold text-amber-800">$10-20/month</p>
                        </div>
                      </Card>

                      {/* Silver Tier */}
                      <Card className="p-6 border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-5 w-5 text-gray-600 fill-gray-600" />
                          <h3 className="text-xl font-bold text-gray-800">Silver Tier</h3>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">Target: Growing SMBs, Retail Stores</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Arlo Secure</span>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span>4K HDR cameras with color night vision (2-8 units)</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span>Professional remote setup assistance</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span>60-day cloud storage with AI detection</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span>Priority support (4-8h response)</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span>Monthly security reports</span>
                          </li>
                        </ul>
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">Starting at</p>
                          <p className="text-lg font-bold text-gray-800">$20-30/month</p>
                        </div>
                      </Card>

                      {/* Gold Tier */}
                      <Card className="p-6 border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-5 w-5 text-orange-600 fill-orange-600" />
                          <h3 className="text-xl font-bold text-orange-800">Gold Tier</h3>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-700">Target: Large Enterprises</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">ADT + Google Nest</span>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>High-end Nest cameras (8+ units)</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>On-site professional installation</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>24/7 professional monitoring by ADT</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>HIPAA, GDPR, SOC 2 compliant</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>Deep enterprise IT integration</span>
                          </li>
                        </ul>
                        <div className="pt-4 border-t border-orange-200">
                          <p className="text-xs text-gray-600 mb-2">Starting at</p>
                          <p className="text-lg font-bold text-orange-800">$50+/month</p>
                        </div>
                      </Card>
                    </div>
                  </Card>

                  {/* Certifications Section */}
                  <Card className="mb-8 p-8 border-0 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="h-6 w-6 text-orange-500" />
                      <h2 className="text-2xl font-bold">Certified Expertise You Can Trust</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Our security team holds industry-leading certifications including CISSP (Certified Information Systems Security Professional), CISM (Certified Information Security Manager), CEH (Certified Ethical Hacker), and CySA+ (Cybersecurity Analyst). This certified expertise ensures the highest standards of security implementation, threat detection, and compliance management for your organization.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-500/10 rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">Security Certifications</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• CISSP - Certified Information Systems Security Professional</li>
                          <li>• CISM - Certified Information Security Manager</li>
                          <li>• CEH - Certified Ethical Hacker</li>
                          <li>• CySA+ - Cybersecurity Analyst</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-orange-500/10 rounded-lg">
                        <h4 className="font-semibold text-orange-700 mb-2">Compliance Expertise</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• HIPAA - Healthcare compliance</li>
                          <li>• GDPR - Data protection regulation</li>
                          <li>• SOC 2 Type II - Security controls</li>
                          <li>• ISO 27001 - Information security</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Benefits Section */}
              <Card className="mb-8 p-8 border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-orange-500" />
                  <h2 className="text-2xl font-bold">{t('keyBenefits')}</h2>
                </div>
                <ul className="space-y-4">
                  {serviceTranslationKeyForArray && getArray(`${serviceTranslationKeyForArray}.benefits`).length > 0
                    ? getArray(`${serviceTranslationKeyForArray}.benefits`).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))
                    : service.benefits.map((benefit, idx) => (
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
                  {serviceTranslationKeyForArray && getArray(`${serviceTranslationKeyForArray}.useCases`).length > 0
                    ? getArray(`${serviceTranslationKeyForArray}.useCases`).map((useCase, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{useCase}</span>
                        </li>
                      ))
                    : service.useCases.map((useCase, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{useCase}</span>
                        </li>
                      ))}
                </ul>
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
                  {(serviceTranslationKeyForArray && getArray(`${serviceTranslationKeyForArray}.technologies`).length > 0
                    ? getArray(`${serviceTranslationKeyForArray}.technologies`)
                    : service.technologies).map((tech, idx) => (
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
                {slug === "security-as-a-service" ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4">Ready to Secure Your Organization?</h3>
                    <p className="text-white/90 text-sm mb-6">
                      Choose your tier or schedule a free consultation to discuss your specific security needs.
                    </p>
                    <div className="space-y-3">
                      <Link href="/#contact" className="block">
                        <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                          Request Security Assessment
                        </Button>
                      </Link>
                      <Link href="/get-started" className="block">
                        <Button variant="outline" className="w-full bg-transparent border-white text-white hover:bg-white/10 font-semibold">
                          Schedule Consultation
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4">{tPortfolio('readyToTransform')}</h3>
                    <p className="text-white/90 text-sm mb-6">
                      {tPortfolio('readyToTransformDescription')}
                    </p>
                    <Link href="/#contact" className="block">
                      <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                        {t('contactUs')}
                      </Button>
                    </Link>
                  </>
                )}
              </Card>
            </div>
          </div>

          {/* Related Services Section */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold mb-8">{t('relatedServices')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {getAllSlugs()
                .filter(s => s !== slug)
                .slice(0, 3)
                .map(s => {
                  const relatedService = getServiceBySlug(s)
                  if (!relatedService) return null
                  const relatedTranslationKey = slugToTranslationKey[s]
                  const relatedServiceTranslationKeyForT = relatedTranslationKey ? `services.${relatedTranslationKey}` : null
                  const relatedTitle = relatedServiceTranslationKeyForT 
                    ? tFeatures(`${relatedServiceTranslationKeyForT}.title`) || relatedService.title
                    : relatedService.title
                  const relatedDescription = relatedServiceTranslationKeyForT
                    ? tFeatures(`${relatedServiceTranslationKeyForT}.description`) || relatedService.description
                    : relatedService.description
                  return (
                    <Link key={s} href={`/services/${s}`}>
                      <Card className="h-full p-6 border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                        <h3 className="text-lg font-bold mb-2 text-foreground hover:text-orange-500 transition-colors">
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
