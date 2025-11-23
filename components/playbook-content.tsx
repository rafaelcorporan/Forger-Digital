"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { ChevronDown, Play, X, Network, Cloud, Shield, TrendingUp, MessageSquare, Eye, BarChart3, DollarSign, Link, Video, Wallet, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n/context"

export const projects = [
  {
    id: "enterprise-network-monitoring",
    title: "Enterprise Network Monitoring Dashboard",
    subtitle: "Real-time VLAN health tracking",
    category: "Infrastructure & Networking",
    description: "Real-time VLAN health tracking with Prometheus and Grafana integration",
    technologies: ["Prometheus", "Grafana", "Python", "Cisco APIs"],
    icon: Network,
    imageUrl: "/1.png",
    videoUrl: "/1.webm"
  },
  {
    id: "cloud-migration-portal",
    title: "Cloud Migration Management Portal", 
    subtitle: "Automated cloud workflows",
    category: "Infrastructure & Networking",
    description: "Automated cloud migration workflows with infrastructure as code",
    technologies: ["AWS", "Terraform", "Docker", "CI/CD"],
    icon: Cloud,
    imageUrl: "/2.png",
    videoUrl: "/2.webm"
  },
  {
    id: "secure-iot-platform",
    title: "Secure IoT Device Management Platform",
    subtitle: "Zero-trust device authentication",
    category: "Infrastructure & Networking", 
    description: "Zero-trust device authentication with TLS/DTLS encryption",
    technologies: ["AWS IoT Core", "TLS/DTLS", "React", "Node.js"],
    icon: Shield,
    imageUrl: "/3.png",
    videoUrl: "/3.webm"
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Network Maintenance System",
    subtitle: "AI-driven predictive analytics",
    category: "Infrastructure & Networking",
    description: "AI-driven predictive analytics reducing downtime by 30%",
    technologies: ["TensorFlow", "ELK Stack", "Grafana", "Python"],
    icon: TrendingUp,
    imageUrl: "/4.png",
    videoUrl: "/4.webm"
  },
  {
    id: "ai-chatbot",
    title: "Intelligent Customer Support Chatbot",
    subtitle: "OpenAI-powered assistance",
    category: "AI & Automation",
    description: "OpenAI-powered chatbot with RAG and real-time processing",
    technologies: ["OpenAI", "RAG", "WebSockets", "Next.js"],
    icon: MessageSquare,
    imageUrl: "/5.png",
    videoUrl: "/5.webm"
  },
  {
    id: "threat-detection",
    title: "AI-Powered Security Threat Detection",
    subtitle: "PyTorch-based anomaly detection",
    category: "AI & Automation",
    description: "PyTorch-based anomaly detection with Wireshark integration",
    technologies: ["PyTorch", "Wireshark", "Python", "Elasticsearch"],
    icon: Eye,
    imageUrl: "/6.png",
    videoUrl: "/6.webm"
  },
  {
    id: "data-graphs-converter",
    title: "Data Graphs Converter",
    subtitle: "Interactive data visualizations",
    category: "AI & Automation",
    description: "Transform CSV data into interactive visualizations",
    technologies: ["D3.js", "Python", "Pandas", "React"],
    icon: BarChart3,
    imageUrl: "/7.png",
    videoUrl: "/7.webm"
  },
  {
    id: "financial-dashboard",
    title: "Financial Dashboard",
    subtitle: "Real-time balance tracking",
    category: "Web & Utilities",
    description: "Real-time crypto and fiat balance tracking with Plaid integration",
    technologies: ["React", "Plaid API", "Chart.js", "Node.js"],
    icon: DollarSign,
    imageUrl: "/8.png",
    videoUrl: "/8.webm"
  },
  {
    id: "url-shorter-yuupi",
    title: "URL Shorter - Yuupi",
    subtitle: "High-performance shortener",
    category: "Web & Utilities", 
    description: "High-performance URL shortener with 2ms redirect latency",
    technologies: ["Node.js", "Redis", "Rate Limiting", "Docker"],
    icon: Link,
    imageUrl: "/10.png",
    videoUrl: "/10.webm"
  },
  {
    id: "video-converter",
    title: "Online Video Converter",
    subtitle: "Browser-only video processing",
    category: "Web & Utilities",
    description: "Browser-only video processing with WebAssembly FFmpeg",
    technologies: ["FFmpeg", "WebAssembly", "Cloudflare Workers", "React"],
    icon: Video,
    imageUrl: "/11.png",
    videoUrl: "/11.webm"
  },
  {
    id: "wepay-crypto-wallet",
    title: "WePay - Crypto Wallet",
    subtitle: "Multi-signature wallet",
    category: "Blockchain & IoT",
    description: "Multi-signature cryptocurrency wallet with MetaMask integration",
    technologies: ["Solidity", "MetaMask SDK", "Web3.js", "React"],
    icon: Wallet,
    imageUrl: "/12.png",
    videoUrl: "/12.webm"
  },
  {
    id: "iot-dashboard",
    title: "IoT-Dashboard",
    subtitle: "Real-time sensor visualization",
    category: "Blockchain & IoT",
    description: "Real-time sensor data visualization with Three.js rendering",
    technologies: ["MQTT", "WebSockets", "Three.js", "Node.js"],
    icon: Smartphone,
    imageUrl: "/9.png",
    videoUrl: "/9.webm"
  }
]

// Map project IDs to translation keys
const projectIdToTranslationKey: Record<string, string> = {
  "enterprise-network-monitoring": "enterpriseNetworkMonitoring",
  "cloud-migration-portal": "cloudMigrationPortal",
  "secure-iot-platform": "secureIotPlatform",
  "predictive-maintenance": "predictiveMaintenance",
  "ai-chatbot": "aiChatbot",
  "threat-detection": "threatDetection",
  "data-graphs-converter": "dataGraphsConverter",
  "financial-dashboard": "financialDashboard",
  "url-shorter-yuupi": "urlShorterYuupi",
  "video-converter": "videoConverter",
  "wepay-crypto-wallet": "wepayCryptoWallet",
  "iot-dashboard": "iotDashboard"
}

export function PlaybookContent() {
  const { t } = useTranslation('portfolio')
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [visibleElements, setVisibleElements] = useState<boolean[]>([])
  const [visibleSections, setVisibleSections] = useState<{[key: string]: boolean}>({})
  const [activeTab, setActiveTab] = useState<string>("all")
  
  const infrastructureRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const webRef = useRef<HTMLDivElement>(null)

  // Get translated projects
  const translatedProjects = useMemo(() => {
    return projects.map(project => {
      const translationKey = projectIdToTranslationKey[project.id]
      if (translationKey) {
        return {
          ...project,
          title: t(`page.projects.${translationKey}.title`) || project.title,
          subtitle: t(`page.projects.${translationKey}.subtitle`) || project.subtitle,
          description: t(`page.projects.${translationKey}.description`) || project.description,
          category: t(`page.projects.${translationKey}.category`) || project.category
        }
      }
      return project
    })
  }, [t])

  useEffect(() => {
    // Initialize hero elements as invisible
    setVisibleElements(new Array(3).fill(false))
    
    // Animate hero elements appearing one by one
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        setVisibleElements(prev => {
          const newVisible = [...prev]
          newVisible[i] = true
          return newVisible
        })
      }, i * 200)
    }

    // Set up intersection observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section')
            if (sectionId) {
              setVisibleSections(prev => ({...prev, [sectionId]: true}))
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    // Observe sections when they're mounted
    const sections = [infrastructureRef.current, aiRef.current, webRef.current]
    sections.forEach(section => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleProjectClick = (project: typeof projects[0]) => {
    setSelectedProject(project)
    setIsVideoOpen(true)
  }

  const closeVideo = () => {
    setIsVideoOpen(false)
    setSelectedProject(null)
  }

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
        {/* Spline Background - Confined to Hero Section ONLY */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <iframe
            src="https://my.spline.design/particlesmoment-i3H8ew9evyZtsWOgteRZYGpc/"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              zIndex: -1,
              pointerEvents: 'auto'
            }}
            allow="xr-spatial-tracking"
          />
        </div>

        {/* Overlay Gradient for Text Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/40 to-black/70 pointer-events-none"></div>

        {/* Content Container - Above Background */}
        <div className="text-center max-w-4xl mx-auto px-4 mb-16 relative z-10">
          <div className={`mb-8 transition-all duration-500 transform ${
            visibleElements[0] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}>
          </div>

          <h1 className={`text-5xl md:text-6xl font-bold text-white mb-8 leading-tight transition-all duration-500 transform ${
            visibleElements[1] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}>
            {t('page.title')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
              {t('page.subtitle')}
            </span>
          </h1>

          <p className={`text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed transition-all duration-500 transform ${
            visibleElements[2] 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-10 opacity-0'
          }`}>
            {t('page.description')}
          </p>
        </div>

        <ChevronDown className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 text-orange-500 animate-bounce z-10" />
      </section>

      {/* Projects Grid Section */}
      <section className="py-20 bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Tabs Navigation */}
          <div className="mb-12 flex justify-center">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full max-w-4xl"
              aria-label="Project category tabs"
            >
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 p-1 rounded-lg border border-gray-700" role="tablist">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all text-sm md:text-base"
                  aria-label="Show all projects"
                >
                  {t('page.tabs.allProjects')}
                </TabsTrigger>
                <TabsTrigger 
                  value="infrastructure"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all text-sm md:text-base"
                  aria-label="Show infrastructure projects"
                >
                  {t('page.tabs.infrastructure')}
                </TabsTrigger>
                <TabsTrigger 
                  value="ai"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all text-sm md:text-base"
                  aria-label="Show AI and automation projects"
                >
                  {t('page.tabs.aiAutomation')}
                </TabsTrigger>
                <TabsTrigger 
                  value="web"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all text-sm md:text-base"
                  aria-label="Show web and blockchain projects"
                >
                  {t('page.tabs.webBlockchain')}
                </TabsTrigger>
              </TabsList>

              {/* All Projects Tab */}
              <TabsContent value="all" className="mt-8 space-y-16">
                {/* Infrastructure & Networking Projects */}
                <div id="infrastructure-networking" className="scroll-mt-20" ref={infrastructureRef} data-section="infrastructure">
            <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
              visibleSections.infrastructure 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-10 opacity-0'
            }`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                {t('page.categories.infrastructureNetworking')}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {translatedProjects
                .filter(project => {
                  const originalCategory = projects.find(p => p.id === project.id)?.category
                  return originalCategory === "Infrastructure & Networking"
                })
                .map((project, index) => (
                <Card 
                  key={project.id}
                  className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${
                    visibleSections.infrastructure 
                      ? (index < 2 ? 'translate-x-0 opacity-100' : 'translate-x-0 opacity-100')
                      : (index < 2 ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0')
                  }`}
                  style={{ transitionDelay: visibleSections.infrastructure ? `${index * 200}ms` : '0ms' }}
                  onClick={() => handleProjectClick(project)}
                >
                  <CardContent className="p-10 flex flex-col items-start justify-center min-h-[350px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                    
                    <div className="relative z-10 mb-8">
                      <project.icon className="w-16 h-16 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-4 flex-1">
                      <h3 className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Play className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

                {/* AI & Automation Projects */}
                <div id="ai-automation" className="scroll-mt-20" ref={aiRef} data-section="ai">
                  <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
                    visibleSections.ai 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                      {t('page.categories.aiAutomation')}
                    </span>
                  </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {translatedProjects
                .filter(project => {
                  const originalCategory = projects.find(p => p.id === project.id)?.category
                  return originalCategory === "AI & Automation"
                })
                .map((project, index) => (
                <Card 
                  key={project.id}
                  className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${
                    visibleSections.ai 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: visibleSections.ai ? `${index * 200}ms` : '0ms' }}
                  onClick={() => handleProjectClick(project)}
                >
                  <CardContent className="p-8 flex flex-col items-start justify-center min-h-[320px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                    
                    <div className="relative z-10 mb-6">
                      <project.icon className="w-14 h-14 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-3 flex-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-500 text-base group-hover:text-gray-400 transition-colors">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Play className="w-7 h-7 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

                {/* Web & Utilities & Blockchain Projects */}
                <div id="web-utilities-blockchain" className="scroll-mt-20" ref={webRef} data-section="web">
                  <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
                    visibleSections.web 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                      {t('page.categories.webUtilitiesBlockchain')}
                    </span>
                  </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {translatedProjects
                .filter(project => {
                  const originalCategory = projects.find(p => p.id === project.id)?.category
                  return originalCategory === "Web & Utilities" || originalCategory === "Blockchain & IoT"
                })
                .map((project, index) => {
                  // Define animation direction based on card position
                  let animationClass = ''
                  if (index < 3) { // First row (cards 0-2) - from left
                    animationClass = visibleSections.web ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  } else { // Second row (cards 3+) - from right  
                    animationClass = visibleSections.web ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }
                  
                  return (
                <Card 
                  key={project.id}
                  className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${animationClass} ${
                    project.id === "financial-dashboard" || project.id === "url-shorter-yuupi" || project.id === "video-converter" ? "lg:col-span-2" : ""
                  } ${
                    project.id === "wepay-crypto-wallet" || project.id === "iot-dashboard" ? "lg:col-span-3" : ""
                  }`}
                  style={{ transitionDelay: visibleSections.web ? `${index * 150}ms` : '0ms' }}
                  onClick={() => handleProjectClick(project)}
                >
                  <CardContent className="p-8 flex flex-col items-start justify-center min-h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                    
                    <div className="relative z-10 mb-6">
                      <project.icon className="w-12 h-12 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-3 flex-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-500 text-base group-hover:text-gray-400 transition-colors">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Play className="w-6 h-6 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                  )
                })}
            </div>
                </div>
              </TabsContent>

              {/* Infrastructure Tab */}
              <TabsContent value="infrastructure" className="mt-8">
                <div id="infrastructure-networking" className="scroll-mt-20" ref={infrastructureRef} data-section="infrastructure">
                  <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
                    visibleSections.infrastructure 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                      {t('page.categories.infrastructureNetworking')}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {translatedProjects
                      .filter(project => {
                        const originalCategory = projects.find(p => p.id === project.id)?.category
                        return originalCategory === "Infrastructure & Networking"
                      })
                      .map((project, index) => (
                      <Card 
                        key={project.id}
                        className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${
                          visibleSections.infrastructure 
                            ? 'translate-x-0 opacity-100' 
                            : '-translate-x-10 opacity-0'
                        }`}
                        style={{ transitionDelay: visibleSections.infrastructure ? `${index * 200}ms` : '0ms' }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <CardContent className="p-10 flex flex-col items-start justify-center min-h-[350px] relative overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                          
                          <div className="relative z-10 mb-8">
                            <project.icon className="w-16 h-16 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                          </div>
                          
                          <div className="relative z-10 space-y-4 flex-1">
                            <h3 className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors">
                              {project.title}
                            </h3>
                            
                            <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">
                              {project.subtitle}
                            </p>
                          </div>

                          <div className="relative z-10 mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <Play className="w-8 h-8 text-orange-500" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* AI & Automation Tab */}
              <TabsContent value="ai" className="mt-8">
                <div id="ai-automation" className="scroll-mt-20" ref={aiRef} data-section="ai">
                  <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
                    visibleSections.ai 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                      {t('page.categories.aiAutomation')}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {translatedProjects
                      .filter(project => {
                        const originalCategory = projects.find(p => p.id === project.id)?.category
                        return originalCategory === "AI & Automation"
                      })
                      .map((project, index) => (
                      <Card 
                        key={project.id}
                        className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${
                          visibleSections.ai 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-10 opacity-0'
                        }`}
                        style={{ transitionDelay: visibleSections.ai ? `${index * 200}ms` : '0ms' }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <CardContent className="p-8 flex flex-col items-start justify-center min-h-[320px] relative overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                          
                          <div className="relative z-10 mb-6">
                            <project.icon className="w-14 h-14 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                          </div>
                          
                          <div className="relative z-10 space-y-3 flex-1">
                            <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                              {project.title}
                            </h3>
                            
                            <p className="text-gray-500 text-base group-hover:text-gray-400 transition-colors">
                              {project.subtitle}
                            </p>
                          </div>

                          <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <Play className="w-7 h-7 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Web & Blockchain Tab */}
              <TabsContent value="web" className="mt-8">
                <div id="web-utilities-blockchain" className="scroll-mt-20" ref={webRef} data-section="web">
                  <h2 className={`text-3xl font-bold text-white mb-8 text-center transition-all duration-700 transform ${
                    visibleSections.web 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0'
                  }`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                      {t('page.categories.webUtilitiesBlockchain')}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    {translatedProjects
                      .filter(project => {
                        const originalCategory = projects.find(p => p.id === project.id)?.category
                        return originalCategory === "Web & Utilities" || originalCategory === "Blockchain & IoT"
                      })
                      .map((project, index) => {
                        let animationClass = ''
                        if (index < 3) {
                          animationClass = visibleSections.web ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                        } else {
                          animationClass = visibleSections.web ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                        }
                        
                        return (
                        <Card 
                          key={project.id}
                          className={`bg-gray-800 border-gray-700 hover:border-orange-500 transition-all duration-700 cursor-pointer group hover:bg-gray-750 backdrop-blur-sm transform ${animationClass} ${
                            project.id === "financial-dashboard" || project.id === "url-shorter-yuupi" || project.id === "video-converter" ? "lg:col-span-2" : ""
                          } ${
                            project.id === "wepay-crypto-wallet" || project.id === "iot-dashboard" ? "lg:col-span-3" : ""
                          }`}
                          style={{ transitionDelay: visibleSections.web ? `${index * 150}ms` : '0ms' }}
                          onClick={() => handleProjectClick(project)}
                        >
                          <CardContent className="p-8 flex flex-col items-start justify-center min-h-[300px] relative overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-70 transition-opacity duration-500">
                              <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/25 transition-colors duration-500" />
                            
                            <div className="relative z-10 mb-6">
                              <project.icon className="w-12 h-12 text-orange-500 group-hover:text-orange-400 transition-colors duration-300" />
                            </div>
                            
                            <div className="relative z-10 space-y-3 flex-1">
                              <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                {project.title}
                              </h3>
                              
                              <p className="text-gray-500 text-base group-hover:text-gray-400 transition-colors">
                                {project.subtitle}
                              </p>
                            </div>

                            <div className="relative z-10 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <Play className="w-6 h-6 text-orange-500" />
                            </div>
                          </CardContent>
                        </Card>
                        )
                      })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 p-0">
          {selectedProject && (
            <div className="relative">
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="p-6 border-b border-gray-700">
                <DialogTitle className="text-2xl font-bold text-white mb-2">{selectedProject.title}</DialogTitle>
                <p className="text-gray-400 mb-4">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-orange-500 text-orange-400">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="relative bg-black flex items-center justify-center">
                <video
                  className="w-full h-[400px] object-contain"
                  autoPlay
                  controls
                  muted
                  loop
                >
                  <source src={selectedProject.videoUrl} type="video/webm" />
                  <source src={selectedProject.videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

