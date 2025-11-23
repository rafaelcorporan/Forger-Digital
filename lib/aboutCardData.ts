import { Layers, Shield, Zap, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AboutCard {
  slug: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  detailedContent: string
  keyBenefits: string[]
  useCases: string[]
  technologies: string[]
  methodologies: string[]
}

export const aboutCardData: AboutCard[] = [
  {
    slug: "architecture",
    title: "Architecture",
    description: "Scalable system design",
    icon: Layers,
    color: "from-orange-500 to-orange-600",
    detailedContent: "We design and implement scalable system architectures that grow with your business. Our architectural approach emphasizes modularity, maintainability, and future-proof design principles. Whether you need microservices architecture, cloud-native solutions, or enterprise-scale system design, we deliver architectures that handle complexity while remaining agile and adaptable.",
    keyBenefits: [
      "Scalable infrastructure that grows with your business",
      "Modular architecture for easy maintenance and updates",
      "Future-proof design principles and patterns",
      "Cloud-native and distributed system expertise",
      "Performance optimization through smart architecture",
      "Cost-effective scaling strategies"
    ],
    useCases: [
      "Microservices and service-oriented architectures",
      "Cloud migration and multi-cloud strategies",
      "Legacy system modernization",
      "High-traffic application architecture",
      "Event-driven and serverless architectures",
      "Container orchestration and Kubernetes design"
    ],
    technologies: [
      "Microservices Architecture",
      "Cloud Platforms (AWS, GCP, Azure)",
      "Kubernetes & Docker",
      "API Gateway & Service Mesh",
      "Event-Driven Architecture",
      "Serverless Computing"
    ],
    methodologies: [
      "Domain-Driven Design (DDD)",
      "Clean Architecture",
      "SOLID Principles",
      "CQRS & Event Sourcing",
      "API-First Design",
      "Infrastructure as Code (IaC)"
    ]
  },
  {
    slug: "security",
    title: "Security",
    description: "Enterprise-grade protection",
    icon: Shield,
    color: "from-pink-500 to-pink-600",
    detailedContent: "Enterprise-grade security is at the core of everything we build. We implement comprehensive security measures including authentication, authorization, encryption, and compliance controls. Our security-first approach ensures that applications are protected against modern threats while maintaining usability and performance.",
    keyBenefits: [
      "Enterprise-grade security frameworks",
      "Zero-trust architecture implementation",
      "Compliance with industry standards (SOC 2, GDPR, HIPAA)",
      "Proactive threat detection and prevention",
      "Secure authentication and authorization systems",
      "Data encryption at rest and in transit"
    ],
    useCases: [
      "Application Security (AppSec) implementation",
      "Identity and Access Management (IAM)",
      "API security and rate limiting",
      "Security audits and penetration testing",
      "Compliance certification support",
      "Security monitoring and incident response"
    ],
    technologies: [
      "OAuth 2.0 & OpenID Connect",
      "JWT & Session Management",
      "SSL/TLS & Encryption",
      "Security Scanning Tools (SAST/DAST)",
      "Secrets Management",
      "WAF & DDoS Protection"
    ],
    methodologies: [
      "OWASP Top 10 Compliance",
      "Secure SDLC",
      "Threat Modeling",
      "Security by Design",
      "Zero-Trust Architecture",
      "Defense in Depth"
    ]
  },
  {
    slug: "performance",
    title: "Performance",
    description: "Lightning-fast solutions",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    detailedContent: "Performance is not an afterthought—it's built into every solution we create. We optimize applications for speed, scalability, and efficiency, ensuring your users experience lightning-fast response times even under heavy load. Our performance engineering approach combines profiling, optimization, and continuous monitoring.",
    keyBenefits: [
      "Lightning-fast application response times",
      "Optimized database queries and data access",
      "Efficient resource utilization and cost savings",
      "Scalable performance under high load",
      "Real-time performance monitoring and alerts",
      "CDN optimization for global content delivery"
    ],
    useCases: [
      "Application performance optimization",
      "Database performance tuning and scaling",
      "Load testing and performance validation",
      "Caching strategy implementation",
      "API performance optimization",
      "Frontend performance optimization"
    ],
    technologies: [
      "Performance Profiling Tools",
      "Caching Systems (Redis, Memcached)",
      "CDN & Edge Computing",
      "Database Optimization",
      "Load Testing Tools",
      "APM (Application Performance Monitoring)"
    ],
    methodologies: [
      "Performance Testing & Benchmarking",
      "Load & Stress Testing",
      "Capacity Planning",
      "Query Optimization",
      "Resource Monitoring",
      "Continuous Performance Optimization"
    ]
  },
  {
    slug: "innovation",
    title: "Innovation",
    description: "Cutting-edge technology",
    icon: Rocket,
    color: "from-orange-500 to-orange-600",
    detailedContent: "We stay at the forefront of technology innovation, helping businesses leverage cutting-edge solutions to gain competitive advantages. From AI and machine learning to blockchain and IoT, we explore emerging technologies and implement them strategically to solve real business challenges.",
    keyBenefits: [
      "Access to cutting-edge technology solutions",
      "Competitive advantage through innovation",
      "Future-proof technology strategies",
      "AI and machine learning integration",
      "Emerging technology adoption support",
      "Research and development capabilities"
    ],
    useCases: [
      "AI and Machine Learning implementation",
      "Blockchain and decentralized solutions",
      "IoT device integration and management",
      "Emerging technology prototyping",
      "Innovation workshops and consulting",
      "Technology feasibility studies"
    ],
    technologies: [
      "Artificial Intelligence & ML",
      "Blockchain & Web3",
      "IoT & Edge Computing",
      "Advanced Analytics",
      "Computer Vision & NLP",
      "Emerging Frameworks & Tools"
    ],
    methodologies: [
      "Rapid Prototyping",
      "Agile Innovation Cycles",
      "Design Thinking",
      "Proof of Concept Development",
      "Technology Evaluation",
      "Innovation Roadmap Planning"
    ]
  }
]

export function getAboutCardBySlug(slug: string): AboutCard | undefined {
  return aboutCardData.find(card => card.slug === slug)
}

export function getAllAboutCardSlugs(): string[] {
  return aboutCardData.map(card => card.slug)
}

