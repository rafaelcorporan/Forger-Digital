export interface ServiceDetail {
  slug: string
  title: string
  description: string
  technologies: string[]
  benefits: string[]
  useCases: string[]
  detailedContent: string
  category: string
}

export const serviceData: ServiceDetail[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    description: "Bespoke software solutions tailored to your unique business requirements and scalability needs.",
    category: "Core Services",
    technologies: ["Full-stack development", "API integration", "Cloud-native architecture"],
    benefits: [
      "Tailored solutions that match your exact requirements",
      "Scalable architecture for future growth",
      "Complete control over features and functionality",
      "Integration with existing systems"
    ],
    useCases: [
      "Enterprise application development",
      "Business process automation",
      "Custom ERP systems",
      "Industry-specific solutions"
    ],
    detailedContent: "We specialize in building custom software solutions that perfectly align with your business goals. Our approach combines deep technical expertise with business acumen to deliver solutions that drive real ROI. From initial architecture design through deployment and ongoing support, we ensure your custom software grows with your business."
  },
  {
    slug: "web-application-development",
    title: "Web Application Development",
    description: "High-performance web applications built with modern frameworks and best practices.",
    category: "Core Services",
    technologies: ["React/Next.js", "Progressive Web Apps", "E-commerce solutions"],
    benefits: [
      "Lightning-fast performance",
      "Responsive design across all devices",
      "SEO-optimized applications",
      "Modern user experiences"
    ],
    useCases: [
      "SaaS platforms",
      "E-commerce applications",
      "Collaboration tools",
      "Real-time data platforms"
    ],
    detailedContent: "Our web application development expertise spans modern frameworks and technologies. We build applications that not only look beautiful but perform exceptionally well. From single-page applications to complex multi-tenant platforms, we deliver web solutions that scale and inspire."
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
    category: "Core Services",
    technologies: ["iOS & Android", "React Native", "Flutter development"],
    benefits: [
      "Native performance on iOS and Android",
      "Code reuse across platforms",
      "Offline functionality",
      "App store optimization"
    ],
    useCases: [
      "Consumer mobile applications",
      "Enterprise mobile solutions",
      "Location-based services",
      "Mobile-first startups"
    ],
    detailedContent: "We develop mobile applications that users love to use. Whether you need a native iOS app, Android app, or cross-platform solution, we have the expertise to deliver. Our mobile development process prioritizes user experience, performance, and scalability."
  },
  {
    slug: "enterprise-solutions",
    title: "Enterprise Solutions",
    description: "Scalable enterprise systems and integrations that streamline your business operations.",
    category: "Core Services",
    technologies: ["System integration", "Legacy modernization", "Data migration"],
    benefits: [
      "Unified business operations",
      "Reduced operational complexity",
      "Improved data consistency",
      "Scalable infrastructure"
    ],
    useCases: [
      "Digital transformation initiatives",
      "Legacy system modernization",
      "Multi-system integration",
      "Enterprise consolidation"
    ],
    detailedContent: "Our enterprise solutions unite disparate systems and workflows into cohesive, efficient operations. We understand the complexity of enterprise environments and bring proven strategies for successful integration and modernization."
  },
  {
    slug: "emerging-technologies",
    title: "Emerging Technologies",
    description: "AI, blockchain, and IoT solutions that position your business at the forefront of innovation.",
    category: "Core Services",
    technologies: ["AI/ML implementation", "Blockchain development", "IoT solutions"],
    benefits: [
      "Competitive advantage through innovation",
      "Automated decision-making",
      "New revenue streams",
      "Future-proof architecture"
    ],
    useCases: [
      "Predictive analytics",
      "Smart contracts and DeFi",
      "Connected device networks",
      "Autonomous systems"
    ],
    detailedContent: "Stay ahead of the curve with our emerging technology expertise. We help businesses harness AI, blockchain, and IoT to create new opportunities and drive innovation. Our experienced team can guide your organization through emerging tech adoption with proven strategies."
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    description: "Strategic guidance and implementation to digitize and optimize your business processes.",
    category: "Core Services",
    technologies: ["Process automation", "Digital strategy", "Change management"],
    benefits: [
      "Streamlined business processes",
      "Improved customer experiences",
      "Reduced costs and waste",
      "Data-driven decision-making"
    ],
    useCases: [
      "Digital-first business models",
      "Customer experience enhancement",
      "Operational efficiency",
      "Organizational change"
    ],
    detailedContent: "Digital transformation is not just about technology—it's about reimagining your business. We guide organizations through comprehensive digital transformation journeys, ensuring sustainable change and measurable results."
  },
  {
    slug: "kubernetes-cluster-design",
    title: "Kubernetes Cluster Design & Deployment",
    description: "Architect and deploy production-ready Kubernetes clusters tailored to your scalability requirements.",
    category: "Cloud Infrastructure",
    technologies: ["Kubernetes, Helm, Kustomize", "AWS EKS, GCP GKE, Azure AKS", "Scalable container orchestration"],
    benefits: [
      "Automatic application scaling",
      "High availability and resilience",
      "Efficient resource utilization",
      "Simplified deployment pipelines"
    ],
    useCases: [
      "Microservices architectures",
      "Containerized applications",
      "Multi-cloud deployments",
      "CI/CD pipelines"
    ],
    detailedContent: "We design and deploy enterprise-grade Kubernetes clusters optimized for your specific workloads. From cluster architecture to production deployment, we ensure your containerized applications run reliably at scale."
  },
  {
    slug: "infrastructure-as-code-terraform",
    title: "Infrastructure as Code (IaC) & Terraform",
    description: "Provision and manage cloud infrastructure programmatically with version control and automated deployments.",
    category: "Cloud Infrastructure",
    technologies: ["Terraform modules", "AWS CloudFormation, Azure RM", "Consistent environments"],
    benefits: [
      "Reproducible infrastructure",
      "Version-controlled configuration",
      "Faster deployment cycles",
      "Reduced configuration drift"
    ],
    useCases: [
      "Multi-environment management",
      "Infrastructure scaling",
      "Disaster recovery",
      "Development automation"
    ],
    detailedContent: "Our Infrastructure as Code expertise enables organizations to manage cloud infrastructure with the same rigor as application code. We implement Terraform-based workflows that ensure consistency, traceability, and efficiency."
  },
  {
    slug: "cloud-platform-specialization",
    title: "Cloud Platform Specialization",
    description: "Navigate multi-cloud landscapes with expert architecture design for AWS, GCP, and Azure.",
    category: "Cloud Infrastructure",
    technologies: ["AWS optimization", "GCP solutions", "Azure cloud services"],
    benefits: [
      "Optimized cloud costs",
      "Multi-cloud flexibility",
      "Vendor lock-in prevention",
      "Best-of-breed services"
    ],
    useCases: [
      "Cloud migration strategies",
      "Multi-cloud architectures",
      "Cost optimization",
      "Hybrid cloud deployments"
    ],
    detailedContent: "Navigate the cloud landscape confidently with our multi-cloud expertise. We help organizations choose the right cloud platforms and architect solutions that leverage the best capabilities of AWS, GCP, and Azure."
  },
  {
    slug: "serverless-event-driven",
    title: "Serverless & Event-Driven Architecture",
    description: "Design scalable, cost-effective serverless solutions that automatically scale based on demand.",
    category: "Cloud Infrastructure",
    technologies: ["AWS Lambda, Google Functions", "Azure Functions", "Automatic scaling"],
    benefits: [
      "Reduced operational overhead",
      "Pay-per-use pricing",
      "Automatic scaling",
      "Faster time-to-market"
    ],
    useCases: [
      "Real-time data processing",
      "API backends",
      "Scheduled tasks",
      "Event-driven workflows"
    ],
    detailedContent: "Build scalable, cost-effective applications using serverless and event-driven architectures. We design solutions that eliminate server management overhead while maintaining high reliability and performance."
  },
  {
    slug: "restful-graphql-api",
    title: "RESTful & GraphQL API Development",
    description: "Build high-performance, well-documented APIs that serve as the backbone of your platform.",
    category: "API Development",
    technologies: ["REST & GraphQL design", "API versioning & docs", "Developer-friendly APIs"],
    benefits: [
      "Efficient data fetching",
      "Strong type safety",
      "Self-documenting APIs",
      "Developer-friendly experiences"
    ],
    useCases: [
      "Mobile app backends",
      "Third-party integrations",
      "Microservices communication",
      "Data aggregation layers"
    ],
    detailedContent: "We architect and implement APIs that power modern applications. Whether REST or GraphQL, our APIs are designed for performance, usability, and scalability."
  },
  {
    slug: "enterprise-integration-middleware",
    title: "Enterprise Integration & Middleware",
    description: "Seamlessly connect legacy systems with modern applications through robust integration solutions.",
    category: "API Development",
    technologies: ["RabbitMQ, Apache Kafka", "Message routing", "Real-time synchronization"],
    benefits: [
      "Unified business processes",
      "Real-time data synchronization",
      "Legacy system modernization",
      "Scalable communication"
    ],
    useCases: [
      "Multi-system consolidation",
      "Real-time data pipelines",
      "ERP integration",
      "Event streaming platforms"
    ],
    detailedContent: "Integrate complex enterprise systems with sophisticated middleware solutions. We bridge legacy and modern systems, enabling seamless data flow and real-time synchronization across your organization."
  },
  {
    slug: "third-party-saas-integrations",
    title: "Third-Party & SaaS Integrations",
    description: "Integrate with leading SaaS platforms and payment gateways to extend functionality.",
    category: "API Development",
    technologies: ["Stripe, PayPal integration", "Salesforce, HubSpot", "Workflow automation"],
    benefits: [
      "Extended functionality",
      "Reduced development time",
      "Workflow automation",
      "Unified data ecosystem"
    ],
    useCases: [
      "Payment processing",
      "CRM integration",
      "Marketing automation",
      "Accounting system integration"
    ],
    detailedContent: "Enhance your applications by integrating with best-in-class SaaS platforms. We seamlessly connect your systems with leading tools like Stripe, Salesforce, HubSpot, and more."
  },
  {
    slug: "api-security-compliance",
    title: "API Security & Compliance",
    description: "Protect your APIs with enterprise-grade security including OAuth 2.0, rate limiting, and compliance.",
    category: "API Development",
    technologies: ["OAuth 2.0, JWT", "GDPR, HIPAA, PCI-DSS", "DDoS protection"],
    benefits: [
      "Protected sensitive data",
      "Regulatory compliance",
      "Reduced security breaches",
      "User trust and confidence"
    ],
    useCases: [
      "Regulatory compliance",
      "Sensitive data protection",
      "Public API security",
      "Multi-tenant systems"
    ],
    detailedContent: "Secure your APIs against modern threats with comprehensive security measures. We implement authentication, authorization, rate limiting, and compliance controls tailored to your requirements."
  },
  {
    slug: "application-performance-optimization",
    title: "Application Performance Optimization",
    description: "Accelerate your application with strategic caching, compression, and frontend optimization.",
    category: "Performance",
    technologies: ["Redis, Memcached caching", "CDN integration", "Core Web Vitals optimization"],
    benefits: [
      "Faster load times",
      "Improved user experience",
      "Better SEO rankings",
      "Reduced infrastructure costs"
    ],
    useCases: [
      "E-commerce platforms",
      "Content delivery",
      "Real-time applications",
      "Mobile applications"
    ],
    detailedContent: "Every millisecond counts. We optimize applications across the entire stack—frontend, backend, and infrastructure—to deliver lightning-fast experiences that delight users."
  },
  {
    slug: "database-performance-scaling",
    title: "Database Performance & Scaling",
    description: "Optimize database queries and scale databases horizontally to support millions of concurrent users.",
    category: "Performance",
    technologies: ["Query optimization", "Sharding & indexing", "Read replicas"],
    benefits: [
      "Sub-millisecond response times",
      "Horizontal scalability",
      "High availability",
      "Reduced downtime"
    ],
    useCases: [
      "High-traffic platforms",
      "Real-time analytics",
      "Time-series data",
      "Multi-tenant applications"
    ],
    detailedContent: "Transform database performance with expert optimization and scaling strategies. We design databases that handle massive scale while maintaining blazing-fast response times."
  },
  {
    slug: "load-testing-capacity-planning",
    title: "Load Testing & Capacity Planning",
    description: "Validate system performance under realistic conditions and plan infrastructure growth.",
    category: "Performance",
    technologies: ["JMeter, Locust, k6", "Bottleneck identification", "Capacity forecasting"],
    benefits: [
      "Predictable performance",
      "Proactive scaling",
      "Confidence in reliability",
      "Cost optimization"
    ],
    useCases: [
      "Launch preparation",
      "Black Friday readiness",
      "Capacity planning",
      "Performance baselines"
    ],
    detailedContent: "Know your system's limits before they're tested by real users. Our comprehensive load testing and capacity planning ensure your systems handle peak demand reliably."
  },
  {
    slug: "monitoring-observability-analytics",
    title: "Monitoring, Observability & Analytics",
    description: "Gain complete visibility into system performance with comprehensive monitoring and real-time analytics.",
    category: "Performance",
    technologies: ["Prometheus, ELK Stack", "Distributed tracing", "Real-time alerting"],
    benefits: [
      "Proactive problem detection",
      "Reduced mean time to recovery",
      "Data-driven optimization",
      "System insights"
    ],
    useCases: [
      "Production monitoring",
      "Incident response",
      "Performance analytics",
      "Usage analytics"
    ],
    detailedContent: "See everything happening in your systems with comprehensive monitoring and observability. We implement solutions that provide complete visibility, enabling quick problem detection and resolution."
  },
  {
    slug: "application-security-appsec",
    title: "Application Security (AppSec)",
    description: "Protect applications from vulnerabilities with secure code review and penetration testing.",
    category: "Security",
    technologies: ["SAST/DAST scanning", "OWASP remediation", "Security testing"],
    benefits: [
      "Fewer vulnerabilities",
      "Reduced breach risk",
      "Compliance certification",
      "Customer trust"
    ],
    useCases: [
      "Pre-launch security",
      "Compliance audit preparation",
      "Vulnerability management",
      "Security certifications"
    ],
    detailedContent: "Build security into applications from day one. Our AppSec services include secure code review, vulnerability scanning, penetration testing, and remediation guidance."
  },
  {
    slug: "identity-access-management",
    title: "Identity & Access Management (IAM)",
    description: "Control access across your organization with centralized identity management and multi-factor authentication.",
    category: "Security",
    technologies: ["OAuth 2.0, SAML", "RBAC implementation", "Multi-factor authentication"],
    benefits: [
      "Centralized access control",
      "Enhanced security",
      "User convenience",
      "Compliance satisfaction"
    ],
    useCases: [
      "Enterprise SSO",
      "Employee access management",
      "Customer identity platforms",
      "Privileged access management"
    ],
    detailedContent: "Implement robust identity and access management systems that balance security with usability. We deploy IAM solutions that protect your resources while enabling authorized access."
  },
  {
    slug: "data-protection-privacy",
    title: "Data Protection & Privacy",
    description: "Safeguard sensitive data with encryption at rest and in transit, privacy-by-design implementation.",
    category: "Security",
    technologies: ["AES-256 encryption", "TLS/SSL, HSM", "GDPR compliance"],
    benefits: [
      "Protected sensitive information",
      "Regulatory compliance",
      "User privacy",
      "Brand protection"
    ],
    useCases: [
      "Healthcare applications",
      "Financial services",
      "Customer data platforms",
      "Personal information handling"
    ],
    detailedContent: "Protect sensitive data with comprehensive encryption and privacy measures. We implement privacy-by-design principles and ensure compliance with GDPR, HIPAA, and other regulations."
  },
  {
    slug: "compliance-audit-frameworks",
    title: "Compliance & Audit Frameworks",
    description: "Meet regulatory requirements with comprehensive compliance frameworks including SOC 2 and ISO 27001.",
    category: "Security",
    technologies: ["SOC 2, ISO 27001", "PCI-DSS, GDPR", "Audit reporting"],
    benefits: [
      "Regulatory compliance",
      "Audit readiness",
      "Risk reduction",
      "Customer confidence"
    ],
    useCases: [
      "SOC 2 certification",
      "HIPAA compliance",
      "PCI-DSS certification",
      "Audit preparation"
    ],
    detailedContent: "Navigate complex regulatory landscapes with confidence. We implement compliance frameworks and prepare organizations for audits and certifications."
  },
  {
    slug: "security-as-a-service",
    title: "Security-as-a-Service (SaaS)",
    description: "Comprehensive security camera systems and monitoring solutions tailored to nonprofits, SMBs, and enterprises.",
    category: "Security",
    technologies: ["SimpliSafe, Arlo Secure", "ADT + Nest Cameras", "Cloud storage", "AI detection"],
    benefits: [
      "Scalable security solutions",
      "Professional monitoring options",
      "AI-powered threat detection",
      "Compliance-ready storage"
    ],
    useCases: [
      "Nonprofit facility protection",
      "SMB retail security",
      "Enterprise multi-site monitoring",
      "Healthcare facility compliance"
    ],
    detailedContent: "We offer tiered Security-as-a-Service solutions designed for organizations of all sizes. From basic SimpliSafe setups for nonprofits to enterprise-grade ADT + Nest systems with professional monitoring, we provide scalable security solutions that protect your assets and facilities."
  },
  {
    slug: "dedicated-development-teams",
    title: "Dedicated Development Teams",
    description: "Scale your engineering capacity with dedicated, vetted development teams integrated with your organization.",
    category: "Team Augmentation",
    technologies: ["Full-stack developers", "DevOps engineers", "ML & security experts"],
    benefits: [
      "Expanded capacity",
      "Specialized expertise",
      "Cost efficiency",
      "Quick ramp-up"
    ],
    useCases: [
      "Project acceleration",
      "Specialized skill needs",
      "Temporary capacity",
      " 24/7 operations"
    ],
    detailedContent: "Scale your team with experienced developers who work seamlessly within your organization. Our dedicated teams bring specialized expertise and contribute to your long-term success."
  },
  {
    slug: "technical-leadership-architecture",
    title: "Technical Leadership & Architecture",
    description: "Leverage CTO-level expertise and solution architecture guidance for critical technology decisions.",
    category: "Team Augmentation",
    technologies: ["Architecture design", "Technology strategy", "Technical governance"],
    benefits: [
      "Strategic tech decisions",
      "Architectural excellence",
      "Risk mitigation",
      "Future-proofing"
    ],
    useCases: [
      "CTO services",
      "Architecture decisions",
      "Tech stack selection",
      "Strategic planning"
    ],
    detailedContent: "Gain access to CTO-level expertise for critical technology decisions. Our technical leaders provide strategic guidance, architecture design, and technology governance."
  },
  {
    slug: "mentorship-skills-development",
    title: "Mentorship & Skills Development",
    description: "Accelerate team capability with personalized mentorship and best practices guidance.",
    category: "Team Augmentation",
    technologies: ["Technical coaching", "Training programs", "Knowledge transfer"],
    benefits: [
      "Improved team capabilities",
      "Knowledge retention",
      "Increased productivity",
      "Career development"
    ],
    useCases: [
      "Team upskilling",
      "Best practices implementation",
      "Knowledge transfer",
      "Career mentoring"
    ],
    detailedContent: "Invest in your team's growth with comprehensive mentorship and training programs. We help your engineers develop skills in emerging technologies and best practices."
  },
  {
    slug: "project-management-delivery",
    title: "Project Management & Delivery",
    description: "Ensure successful project delivery with expert project management and agile coaching.",
    category: "Team Augmentation",
    technologies: ["Agile/Scrum coaching", "Quality assurance", "Risk management"],
    benefits: [
      "On-time delivery",
      "Quality outcomes",
      "Risk mitigation",
      "Team alignment"
    ],
    useCases: [
      "Agile transformation",
      "Project oversight",
      "Quality assurance",
      "Delivery excellence"
    ],
    detailedContent: "Deliver projects on time and on budget with expert project management. We employ proven methodologies, agile practices, and quality assurance to ensure project success."
  }
]

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return serviceData.find(service => service.slug === slug)
}

export function getAllSlugs(): string[] {
  return serviceData.map(service => service.slug)
}
