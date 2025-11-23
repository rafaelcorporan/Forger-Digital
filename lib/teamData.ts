export interface ProfessionalExperience {
  company: string
  position: string
  startDate: string // Format: "Month YYYY"
  endDate: string // Format: "Month YYYY" or "Present"
  achievements: string[]
  location?: string
}

export interface Education {
  degree: string
  institution: string
  graduationDate: string // Format: "Month YYYY" or "YYYY"
  fieldOfStudy?: string
  honors?: string
}

export interface Certification {
  name: string
  issuingOrganization: string
  issueDate: string // Format: "Month YYYY"
  expirationDate?: string // Format: "Month YYYY" or "No Expiration"
  credentialId?: string
}

export interface ContactInfo {
  email?: string
  phone?: string
  linkedIn?: string
  portfolio?: string
  github?: string
  location?: string
}

export type StaffMember = {
  id: string
  name: string
  roleTags: string[]
  profileImage: string
  resume: string
  profile: string
  hobbies: string[]
  accordionContent: string
  // Optional enrichment for service alignment
  title?: string
  skills?: string[]
  serviceAlignment?: string[]
  // Optional self-identified gender/pronouns metadata (not inferred)
  gender?: "female" | "male" | "nonbinary" | "prefer_not_to_say" | string
  // Professional resume fields
  professionalSummary?: string
  contactInfo?: ContactInfo
  workExperience?: ProfessionalExperience[]
  education?: Education[]
  certifications?: Certification[]
}

export const teamMembers: StaffMember[] = [
  {
    id: "malik",
    name: "Malik",
    roleTags: ["UX/UI Design", "Framer development"],
    profileImage: "/team/team_01.png",
    resume: "Experienced UX designer with 5+ years in Framer and component-driven systems.",
    profile: "Passionate about creating intuitive user interfaces and elevating user journeys through research-driven design.",
    hobbies: ["Photography", "Hiking", "Reading"],
    accordionContent: "Detailed professional history including high-impact design systems, prototyping workflows, and successful cross-functional collaboration.",
    title: "Senior Product Designer",
    skills: ["Figma", "Framer", "Design Systems", "Prototyping", "Accessibility"],
    serviceAlignment: ["Product Design & UX", "Digital Transformation"]
  },
  {
    id: "sophia",
    name: "Sophia",
    roleTags: ["Frontend Engineering", "React / Next.js"],
    profileImage: "/team/team_02.png",
    resume: "Frontend engineer focused on accessibility, performance, and scalable component libraries.",
    profile: "Enjoys building robust UX foundations and pushing the boundaries of modern web performance.",
    hobbies: ["Running", "Baking", "Travel"],
    accordionContent: "Led multiple design-to-code initiatives, implemented SSR/ISR strategies, and authored internal UI guidelines.",
    title: "Senior Frontend Engineer",
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
    serviceAlignment: ["Web Application Development", "Application Performance Optimization"]
  },
  {
    id: "dylan",
    name: "Dylan",
    roleTags: ["Product Management", "Discovery"],
    profileImage: "/team/team_03.png",
    resume: "Product leader with expertise in discovery, prioritization, and outcome-driven roadmaps.",
    profile: "Advocates for evidence-based decisions and strong product-engineering collaboration.",
    hobbies: ["Cycling", "DIY", "Board Games"],
    accordionContent: "Shipped multi-quarter initiatives improving retention and activation; championed user interviews and rapid iteration.",
    title: "Product Manager",
    skills: ["Roadmapping", "Discovery", "OKRs", "User Research"],
    serviceAlignment: ["Technical Leadership & Architecture", "Digital Transformation"]
  },
  {
    id: "lian",
    name: "Lian",
    roleTags: ["DevOps", "Cloud Architecture"],
    profileImage: "/team/team_04.png",
    resume: "Cloud architect with deep experience in Kubernetes, observability, and cost optimization.",
    profile: "Designs reliable systems with strong SRE practices and clear operational playbooks.",
    hobbies: ["Chess", "Gardening", "Cooking"],
    accordionContent: "Implemented multi-region HA setups, automated runbooks, and efficient incident response pipelines.",
    title: "Principal Cloud Architect",
    skills: ["Kubernetes", "Terraform", "AWS", "GCP", "Observability"],
    serviceAlignment: ["Cloud Infrastructure & DevOps", "Kubernetes Platforms"]
  },
  { id: "ava", name: "Ava", roleTags: ["API Development", "GraphQL"], profileImage: "/team/team_05.png", resume: "Builds robust, well-documented APIs with strong contracts.", profile: "Focuses on DX and reliability across services.", hobbies: ["Piano", "Coffee", "Reading"], accordionContent: "Designed API gateways and versioning strategies.", title: "API Engineer", skills: ["GraphQL", "REST", "OpenAPI", "Node.js"], serviceAlignment: ["API Development & Integration"] },
  { id: "noah", name: "Noah", roleTags: ["Mobile", "React Native"], profileImage: "/team/team_06.png", resume: "Delivers high-perf cross-platform apps.", profile: "Obsessed with smooth UX and native feel.", hobbies: ["Climbing", "Cooking"], accordionContent: "Implemented offline-first sync and push notifications.", title: "Mobile Engineer", skills: ["React Native", "iOS", "Android", "Expo"], serviceAlignment: ["Mobile App Development"] },
  { id: "mia", name: "Mia", roleTags: ["QA", "Automation"], profileImage: "/team/team_07.png", resume: "Automates end-to-end testing pipelines.", profile: "Prevents regressions with CI-first practices.", hobbies: ["Yoga", "Painting"], accordionContent: "Owned test suites across microfrontends.", title: "QA Automation Engineer", skills: ["Playwright", "Cypress", "Jest", "CI"], serviceAlignment: ["Quality Engineering & Testing"] },
  { id: "ethan", name: "Ethan", roleTags: ["Security", "AppSec"], profileImage: "/team/team_08.png", resume: "Hardens applications end-to-end.", profile: "Security by design and continuous scanning.", hobbies: ["Photography"], accordionContent: "Introduced SAST/DAST gates in CI.", title: "Application Security Engineer", skills: ["OWASP", "SAST/DAST", "OAuth2", "OIDC"], serviceAlignment: ["Application Security (AppSec)"] },
  { id: "isabella", name: "Isabella", roleTags: ["Data", "Analytics"], profileImage: "/team/team_09.png", resume: "Builds reliable data pipelines and dashboards.", profile: "Turns telemetry into insight.", hobbies: ["Running"], accordionContent: "Rolled out company-wide metrics layer.", title: "Data Engineer", skills: ["dbt", "Airflow", "BigQuery", "SQL"], serviceAlignment: ["Observability & Analytics"] },
  { id: "oliver", name: "Oliver", roleTags: ["Backend", "Go"], profileImage: "/team/team_10.png", resume: "Optimizes services for low-latency.", profile: "Designs resilient, scalable systems.", hobbies: ["Hiking"], accordionContent: "Rewrote critical path in Go for 5x perf.", title: "Backend Engineer", skills: ["Go", "PostgreSQL", "gRPC", "Redis"], serviceAlignment: ["Performance Optimization & Scalability"] },
  { id: "amelia", name: "Amelia", roleTags: ["Design Systems", "Accessibility"], profileImage: "/team/team_11.png", resume: "Creates accessible component libraries.", profile: "Design quality at scale.", hobbies: ["Baking"], accordionContent: "Led WCAG 2.2 compliance project.", title: "Design Systems Engineer", skills: ["ARIA", "WCAG", "Storybook", "Figma"], serviceAlignment: ["Web Application Development", "Product Design & UX"] },
  { id: "james", name: "James", roleTags: ["Platform", "SRE"], profileImage: "/team/team_12.png", resume: "Owns reliability and uptime.", profile: "Automates golden paths for teams.", hobbies: ["Skiing"], accordionContent: "Built multi-tenant platform with Paved Roads.", title: "Site Reliability Engineer", skills: ["SLOs", "SLIs", "Incident Response", "Terraform"], serviceAlignment: ["Cloud Infrastructure & DevOps"] },
  { id: "charlotte", name: "Charlotte", roleTags: ["AI", "ML"], profileImage: "/team/team_13.png", resume: "Ships ML features responsibly.", profile: "Model lifecycle with guardrails.", hobbies: ["Chess"], accordionContent: "Launched NLP-based insights.", title: "ML Engineer", skills: ["Python", "TensorFlow", "NLP", "Vector DB"], serviceAlignment: ["AI & Machine Learning"] },
  { id: "liam", name: "Liam", roleTags: ["Database", "Scaling"], profileImage: "/team/team_14.png", resume: "Scales data with zero-downtime.", profile: "Indexes and caching wizard.", hobbies: ["Guitar"], accordionContent: "Cut P99 by 70% via query tuning.", title: "Database Engineer", skills: ["PostgreSQL", "MySQL", "Sharding", "Caching"], serviceAlignment: ["Database Performance & Scaling"] },
  { id: "harper", name: "Harper", roleTags: ["API Security", "Auth"], profileImage: "/team/team_15.png", resume: "Secure-by-default APIs.", profile: "Policy-driven access control.", hobbies: ["Kayaking"], accordionContent: "Migrated to fine-grained scopes.", title: "Security Engineer", skills: ["OAuth2", "JWT", "WAF", "Rate Limiting"], serviceAlignment: ["API Security & Compliance"] },
  { id: "mason", name: "Mason", roleTags: ["Edge", "CDN"], profileImage: "/team/team_16.png", resume: "Edge-first performance.", profile: "Moves compute to users.", hobbies: ["Cycling"], accordionContent: "CDN rules and workers rollout.", title: "Edge Engineer", skills: ["CDN", "Workers", "Caching", "RUM"], serviceAlignment: ["Application Performance Optimization"] },
  { id: "evelyn", name: "Evelyn", roleTags: ["Kubernetes", "Platform"], profileImage: "/team/team_17.png", resume: "Owns clusters at scale.", profile: "Security, cost, and DX.", hobbies: ["Photography"], accordionContent: "Multi-tenant cluster hardening.", title: "Kubernetes Engineer", skills: ["EKS", "GKE", "Helm", "ArgoCD"], serviceAlignment: ["Kubernetes Platforms", "DevOps Automation"] },
  { id: "elijah", name: "Elijah", roleTags: ["Integration", "ETL"], profileImage: "/team/team_18.png", resume: "Connects systems reliably.", profile: "Event-driven first.", hobbies: ["Drums"], accordionContent: "Unified data ingestion bus.", title: "Integration Engineer", skills: ["Kafka", "EventBridge", "ETL", "gRPC"], serviceAlignment: ["API Development & Integration", "Event-Driven Architecture"] },
  { id: "abigail", name: "Abigail", roleTags: ["Observability", "APM"], profileImage: "/team/team_19.png", resume: "Makes systems measurable.", profile: "From traces to action.", hobbies: ["Hiking"], accordionContent: "Standardized logging schema.", title: "Observability Engineer", skills: ["OpenTelemetry", "Prometheus", "Grafana", "ELK"], serviceAlignment: ["Observability & Analytics"] },
  { id: "jack", name: "Jack", roleTags: ["Full-stack", "Next.js"], profileImage: "/team/team_20.png", resume: "Builds end-to-end apps.", profile: "Loves DX and strong typing.", hobbies: ["Cooking"], accordionContent: "SSR + ISR migration success.", title: "Full-Stack Engineer", skills: ["Next.js", "TypeScript", "Prisma", "tRPC"], serviceAlignment: ["Web Application Development"] },
  { id: "henry", name: "Henry", roleTags: ["Infra", "Networking"], profileImage: "/team/team_21.png", resume: "Designs secure networks.", profile: "Zero-trust and compliance.", hobbies: ["Sailing"], accordionContent: "VPC and peering strategies.", title: "Network Architect", skills: ["VPC", "Transit Gateway", "Zero Trust"], serviceAlignment: ["Cloud Infrastructure & DevOps"] },
  { id: "violet", name: "Violet", roleTags: ["DevRel", "Docs"], profileImage: "/team/team_22.png", resume: "Improves DX via docs and samples.", profile: "APIs that devs love.", hobbies: ["Blogging"], accordionContent: "Launched docs v2.", title: "Developer Relations", skills: ["Docs", "Samples", "SDKs"], serviceAlignment: ["API Development & Integration"] },
  { id: "leo", name: "Leo", roleTags: ["Automation", "CI/CD"], profileImage: "/team/team_23.png", resume: "Ships faster with confidence.", profile: "Pipelines as product.", hobbies: ["3D Printing"], accordionContent: "Standardized CI templates.", title: "DevOps Engineer", skills: ["GitHub Actions", "ArgoCD", "Terraform"], serviceAlignment: ["DevOps Automation"] },
  { id: "grace", name: "Grace", roleTags: ["Compliance", "Risk"], profileImage: "/team/team_24.png", resume: "Brings systems into audit readiness.", profile: "Pragmatic governance.", hobbies: ["Pilates"], accordionContent: "SOC2 Type II program.", title: "Compliance Lead", skills: ["SOC2", "ISO27001", "GDPR"], serviceAlignment: ["Security, Compliance & Governance"] },
  { id: "william", name: "William", roleTags: ["Performance", "Web"], profileImage: "/team/team_25.png", resume: "Kills long tails on P99.", profile: "Measurable wins.", hobbies: ["Gaming"], accordionContent: "Core Web Vitals uplift.", title: "Performance Engineer", skills: ["Lighthouse", "RUM", "Profiling"], serviceAlignment: ["Application Performance Optimization"] },
  { id: "samil", name: "Samil", roleTags: ["Full-stack", "Architecture"], profileImage: "/team/team_26.png", resume: "Builds scalable systems with modern frameworks.", profile: "Focuses on clean architecture and best practices.", hobbies: ["Reading", "Coding"], accordionContent: "Designed and implemented microservices architecture.", title: "Full-Stack Architect", skills: ["Next.js", "TypeScript", "Node.js", "AWS"], serviceAlignment: ["Technical Leadership & Architecture", "Web Application Development"] },
  { id: "daniel", name: "Daniel", roleTags: ["Tech Lead", "Architecture"], profileImage: "/team/team_27.png", resume: "Aligns design with outcomes.", profile: "Coaches teams to excellence.", hobbies: ["Tennis"], accordionContent: "Cut cycle time by 40%.", title: "Technical Lead", skills: ["Architecture", "Code Review", "Mentoring"], serviceAlignment: ["Technical Leadership & Architecture"] },
  { id: "adolf", name: "Adolf", roleTags: ["Backend", "Systems"], profileImage: "/team/team_28.png", resume: "Designs and implements high-performance backend systems.", profile: "Expert in distributed systems and scalability.", hobbies: ["Hiking", "Technology"], accordionContent: "Led migration to microservices architecture with zero downtime.", title: "Backend Systems Engineer", skills: ["Go", "Kubernetes", "PostgreSQL", "Redis"], serviceAlignment: ["Cloud Infrastructure & DevOps", "Performance Optimization & Scalability"] },
  
]
