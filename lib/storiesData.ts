export interface StoryDetail {
  slug: string
  number: string
  title: string
  client: string
  challenge: string
  solution: string
  results: string[]
  tags: string[]
  overview: string
  timeline: {
    phase: string
    description: string
    duration: string
  }[]
  outcomes: {
    metric: string
    value: string
  }[]
  technology: string[]
  detailedChallenge: string
  detailedSolution: string
}

export const storiesData: StoryDetail[] = [
  {
    slug: "ecommerce-platform-transformation",
    number: "01",
    title: "E-commerce Platform Transformation",
    client: "TechRetail Corp",
    challenge: "Legacy system causing 40% cart abandonment",
    solution: "Modern React-based platform with AI recommendations",
    results: ["300% increase in conversions", "50% reduction in load time", "95% customer satisfaction"],
    tags: ["E-commerce", "React", "AI/ML"],
    overview: "TechRetail Corp was struggling with their outdated e-commerce platform, experiencing significant cart abandonment rates and poor user experience. We completely transformed their digital presence with a modern, AI-powered platform that significantly improved conversion rates and customer satisfaction.",
    timeline: [
      {
        phase: "Discovery & Analysis",
        description: "Analyzed existing system, identified pain points, and gathered requirements from stakeholders",
        duration: "2 weeks"
      },
      {
        phase: "Architecture Design",
        description: "Designed new microservices architecture with React frontend and Node.js backend",
        duration: "3 weeks"
      },
      {
        phase: "Development",
        description: "Built responsive frontend, integrated AI recommendation engine, and implemented payment processing",
        duration: "8 weeks"
      },
      {
        phase: "Testing & Optimization",
        description: "Comprehensive testing, performance optimization, and security hardening",
        duration: "2 weeks"
      },
      {
        phase: "Deployment & Migration",
        description: "Deployed to production and migrated 2M+ customer records with zero downtime",
        duration: "1 week"
      }
    ],
    outcomes: [
      {
        metric: "Conversion Rate",
        value: "↑ 300%"
      },
      {
        metric: "Page Load Time",
        value: "↓ 50%"
      },
      {
        metric: "Cart Abandonment",
        value: "↓ 40%"
      },
      {
        metric: "Customer Satisfaction",
        value: "↑ 95%"
      },
      {
        metric: "Revenue Impact",
        value: "+$2.5M annually"
      }
    ],
    technology: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "AWS", "Docker", "AI/ML", "Stripe API"],
    detailedChallenge: "TechRetail Corp's legacy e-commerce platform was built on outdated technology stack, resulting in slow page loads, poor mobile experience, and high cart abandonment rates (40%). The system couldn't scale during peak shopping seasons and lacked personalization features that modern consumers expect.",
    detailedSolution: "We architected and built a completely new platform using React and Next.js for the frontend with a scalable Node.js backend. Implemented machine learning-based product recommendations, optimized for mobile-first experience, integrated with major payment processors, and deployed on AWS with auto-scaling capabilities."
  },
  {
    slug: "enterprise-mobile-app",
    number: "02",
    title: "Enterprise Mobile App",
    client: "LogiFlow Industries",
    challenge: "Manual processes causing operational inefficiencies",
    solution: "Cross-platform mobile app with real-time tracking",
    results: ["60% reduction in processing time", "90% user adoption rate", "$2M annual savings"],
    tags: ["Mobile", "React Native", "IoT"],
    overview: "LogiFlow Industries faced significant operational challenges due to manual, paper-based processes across their logistics operations. We developed a comprehensive cross-platform mobile application that enabled real-time tracking, automated workflows, and dramatically improved operational efficiency.",
    timeline: [
      {
        phase: "Requirements Gathering",
        description: "Interviewed field teams, logistics managers, and stakeholders to understand workflow pain points",
        duration: "2 weeks"
      },
      {
        phase: "UI/UX Design",
        description: "Created intuitive mobile-first design optimized for field work environments",
        duration: "2 weeks"
      },
      {
        phase: "Development",
        description: "Built React Native app for iOS/Android with offline capabilities and real-time GPS tracking",
        duration: "10 weeks"
      },
      {
        phase: "Backend Integration",
        description: "Integrated with existing enterprise systems and IoT devices for real-time data sync",
        duration: "3 weeks"
      },
      {
        phase: "Rollout & Training",
        description: "Phased deployment across 500+ field teams with comprehensive training program",
        duration: "2 weeks"
      }
    ],
    outcomes: [
      {
        metric: "Processing Time",
        value: "↓ 60%"
      },
      {
        metric: "User Adoption",
        value: "↑ 90%"
      },
      {
        metric: "Operational Cost",
        value: "↓ 35%"
      },
      {
        metric: "Delivery Accuracy",
        value: "↑ 98%"
      },
      {
        metric: "Annual Savings",
        value: "$2M"
      }
    ],
    technology: ["React Native", "Node.js", "GraphQL", "MongoDB", "IoT", "GPS Tracking", "Offline-First", "Firebase", "AWS"],
    detailedChallenge: "LogiFlow Industries operated with manual, paper-based processes across 500+ field teams, resulting in inefficiencies, delayed reporting, lack of real-time visibility, and operational costs. Managers had no way to track deliveries in real-time, and data entry errors were common.",
    detailedSolution: "We developed a cross-platform mobile application using React Native, enabling iOS and Android deployment from a single codebase. The app features offline-first architecture for field reliability, real-time GPS tracking, automated data capture, and seamless integration with their backend systems through GraphQL APIs."
  }
]

export function getStoryBySlug(slug: string): StoryDetail | undefined {
  return storiesData.find(story => story.slug === slug)
}

export function getAllStorySlugs(): string[] {
  return storiesData.map(story => story.slug)
}
