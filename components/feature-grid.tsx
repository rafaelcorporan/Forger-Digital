"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Code, Smartphone, Globe, Database, ChevronRight, CheckCircle, Cpu, TrendingUp, Layers, Cloud, Zap, Network, Link as LinkIcon, Plug, Shield, Database as DatabaseIcon, BarChart3, Lock, Users, Compass, Lightbulb, Camera } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer, staggerItem, defaultViewport } from "@/lib/animations"

const features = [
  // GROUP 1: CURRENT SERVICES (6)
  {
    slug: "custom-software-development",
    icon: Code,
    translationKey: "customSoftwareDevelopment",
  },
  {
    slug: "web-application-development",
    icon: Globe,
    translationKey: "webApplicationDevelopment",
  },
  {
    slug: "mobile-app-development",
    icon: Smartphone,
    translationKey: "mobileAppDevelopment",
  },
  {
    slug: "enterprise-solutions",
    icon: Database,
    translationKey: "enterpriseSolutions",
  },
  {
    slug: "emerging-technologies",
    icon: Cpu,
    translationKey: "emergingTechnologies",
  },
  {
    slug: "digital-transformation",
    icon: TrendingUp,
    translationKey: "digitalTransformation",
  },

  // GROUP 4: CLOUD INFRASTRUCTURE & KUBERNETES (4)
  {
    slug: "kubernetes-cluster-design",
    icon: Layers,
    translationKey: "kubernetesClusterDesign",
  },
  {
    slug: "infrastructure-as-code-terraform",
    icon: Code,
    translationKey: "infrastructureAsCode",
  },
  {
    slug: "cloud-platform-specialization",
    icon: Cloud,
    translationKey: "cloudPlatformSpecialization",
  },
  {
    slug: "serverless-event-driven",
    icon: Zap,
    translationKey: "serverlessEventDriven",
  },

  // GROUP 5: API DEVELOPMENT & INTEGRATION (4)
  {
    slug: "restful-graphql-api",
    icon: Network,
    translationKey: "restfulGraphqlApi",
  },
  {
    slug: "enterprise-integration-middleware",
    icon: LinkIcon,
    translationKey: "enterpriseIntegrationMiddleware",
  },
  {
    slug: "third-party-saas-integrations",
    icon: Plug,
    translationKey: "thirdPartySaaSIntegrations",
  },
  {
    slug: "api-security-compliance",
    icon: Shield,
    translationKey: "apiSecurityCompliance",
  },

  // GROUP 6: PERFORMANCE OPTIMIZATION & SCALABILITY (4)
  {
    slug: "application-performance-optimization",
    icon: Zap,
    translationKey: "applicationPerformanceOptimization",
  },
  {
    slug: "database-performance-scaling",
    icon: DatabaseIcon,
    translationKey: "databasePerformanceScaling",
  },
  {
    slug: "load-testing-capacity-planning",
    icon: TrendingUp,
    translationKey: "loadTestingCapacityPlanning",
  },
  {
    slug: "monitoring-observability-analytics",
    icon: BarChart3,
    translationKey: "monitoringObservabilityAnalytics",
  },

  // GROUP 7: SECURITY, COMPLIANCE & GOVERNANCE (5)
  {
    slug: "application-security-appsec",
    icon: Shield,
    translationKey: "applicationSecurityAppSec",
  },
  {
    slug: "identity-access-management",
    icon: Users,
    translationKey: "identityAccessManagement",
  },
  {
    slug: "data-protection-privacy",
    icon: Lock,
    translationKey: "dataProtectionPrivacy",
  },
  {
    slug: "compliance-audit-frameworks",
    icon: CheckCircle,
    translationKey: "complianceAuditFrameworks",
  },
  {
    slug: "security-as-a-service",
    icon: Camera,
    translationKey: "securityAsAService",
  },

  // GROUP 8: TEAM AUGMENTATION & TECHNICAL LEADERSHIP (4)
  {
    slug: "dedicated-development-teams",
    icon: Users,
    translationKey: "dedicatedDevelopmentTeams",
  },
  {
    slug: "technical-leadership-architecture",
    icon: Compass,
    translationKey: "technicalLeadershipArchitecture",
  },
  {
    slug: "mentorship-skills-development",
    icon: Lightbulb,
    translationKey: "mentorshipSkillsDevelopment",
  },
  {
    slug: "project-management-delivery",
    icon: CheckCircle,
    translationKey: "projectManagementDelivery",
  },
]

// Separate top 6 priority services from remaining
const priorityServices = features.slice(0, 6)
const additionalServices = features.slice(6)

export function FeatureGrid() {
  const { t } = useTranslation('features')
  const [accordionOpen, setAccordionOpen] = useState(false)

  // Helper to get translated service data
  const getServiceData = (feature: typeof features[0]) => {
    const serviceKey = `services.${feature.translationKey}`
    return {
      title: t(`${serviceKey}.title`) as string,
      description: t(`${serviceKey}.description`) as string,
      features: t(`${serviceKey}.features`) as string[],
    }
  }

  return (
    <section id="services" className="border-b border-border bg-background py-24">
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

        {/* TOP 6 PRIORITY SERVICES */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {priorityServices.map((feature, index) => {
            const Icon = feature.icon
            const serviceData = getServiceData(feature)
            return (
              <motion.div key={index} variants={staggerItem}>
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2">
                  <div className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {serviceData.title}
                  </h3>
                  <p className="mb-4 text-muted-foreground">{serviceData.description}</p>
                  <ul className="space-y-2 mb-4">
                    {serviceData.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                    <Link href={`/services/${feature.slug}`} className="text-orange-500 hover:text-orange-600 p-0 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex items-center">
                      {t('learnMore')} <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ACCORDION TRIGGER BUTTON */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeInUp}
          className="flex justify-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary-action"
              size="xl"
              onClick={() => setAccordionOpen(!accordionOpen)}
              aria-expanded={accordionOpen}
              aria-controls="remaining-services"
              className="group gap-2"
            >
              {accordionOpen ? t('seeLess') : `See +${additionalServices.length} Services`}
              <ChevronRight 
                className={`h-5 w-5 transition-transform duration-300 ${accordionOpen ? 'rotate-90 group-hover:rotate-90' : 'rotate-0 group-hover:translate-x-1'}`}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* ACCORDION CONTENT - REMAINING 20 SERVICES */}
        <AnimatePresence>
          {accordionOpen && (
            <motion.div
              id="remaining-services"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0 }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
            >
            {additionalServices.map((feature, index) => {
              const Icon = feature.icon
              const serviceData = getServiceData(feature)
              return (
                <motion.div key={index + 6} variants={staggerItem}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2">
                    <div className="p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {serviceData.title}
                    </h3>
                    <p className="mb-4 text-muted-foreground">{serviceData.description}</p>
                    <ul className="space-y-2 mb-4">
                      {serviceData.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                      <Link href={`/services/${feature.slug}`} className="text-orange-500 hover:text-orange-600 p-0 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 flex items-center">
                        {t('learnMore')} <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
