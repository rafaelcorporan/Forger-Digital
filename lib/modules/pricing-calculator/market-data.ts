// Market-Based Pricing Data
// Based on industry research for tech services (2024-2025)
// Sources: Clutch.co, GoodFirms, industry surveys
// All prices in USD cents

import type { 
  FeatureDefinition, 
  MarketRates, 
  ServiceCategory,
  ComplexityLevel 
} from './types'

// Market hourly rates by category and complexity (in cents)
// Based on US market rates for senior developers
export const MARKET_RATES: MarketRates = {
  hourlyRates: {
    web_development: {
      low: 12500,      // $125/hr
      medium: 17500,   // $175/hr
      high: 22500,     // $225/hr
      enterprise: 30000 // $300/hr
    },
    mobile_development: {
      low: 15000,      // $150/hr
      medium: 20000,   // $200/hr
      high: 27500,     // $275/hr
      enterprise: 35000 // $350/hr
    },
    ai_ml: {
      low: 17500,      // $175/hr
      medium: 25000,   // $250/hr
      high: 35000,     // $350/hr
      enterprise: 50000 // $500/hr
    },
    blockchain: {
      low: 17500,      // $175/hr
      medium: 25000,   // $250/hr
      high: 35000,     // $350/hr
      enterprise: 45000 // $450/hr
    },
    cloud_infrastructure: {
      low: 15000,      // $150/hr
      medium: 20000,   // $200/hr
      high: 27500,     // $275/hr
      enterprise: 37500 // $375/hr
    },
    cybersecurity: {
      low: 17500,      // $175/hr
      medium: 25000,   // $250/hr
      high: 35000,     // $350/hr
      enterprise: 50000 // $500/hr
    },
    data_engineering: {
      low: 15000,      // $150/hr
      medium: 20000,   // $200/hr
      high: 27500,     // $275/hr
      enterprise: 37500 // $375/hr
    },
    devops: {
      low: 15000,      // $150/hr
      medium: 20000,   // $200/hr
      high: 25000,     // $250/hr
      enterprise: 35000 // $350/hr
    },
    ui_ux_design: {
      low: 10000,      // $100/hr
      medium: 15000,   // $150/hr
      high: 20000,     // $200/hr
      enterprise: 27500 // $275/hr
    },
    consulting: {
      low: 15000,      // $150/hr
      medium: 22500,   // $225/hr
      high: 32500,     // $325/hr
      enterprise: 50000 // $500/hr
    }
  },
  timelineMultipliers: {
    urgent: 1.35,    // 35% premium for rush jobs
    standard: 1.0,   // Base rate
    flexible: 0.9    // 10% discount for flexible timeline
  },
  teamSizeMultipliers: {
    small: 1.0,      // 1-2 developers
    medium: 0.95,    // 3-5 developers (5% efficiency discount)
    large: 0.9       // 6+ developers (10% efficiency discount)
  },
  supportCosts: {
    basic: 0,                 // Included
    standard: 250000,         // $2,500/month for 3 months
    premium: 500000           // $5,000/month for 6 months
  },
  discountThresholds: [
    { minAmount: 10000000, discountPercent: 5 },   // $100k+ = 5% off
    { minAmount: 25000000, discountPercent: 8 },   // $250k+ = 8% off
    { minAmount: 50000000, discountPercent: 10 },  // $500k+ = 10% off
    { minAmount: 100000000, discountPercent: 12 }  // $1M+ = 12% off
  ]
}

// Feature catalog with base costs and time estimates
export const FEATURE_CATALOG: FeatureDefinition[] = [
  // Web Development Features
  {
    id: 'web_responsive_design',
    name: 'Responsive Web Design',
    description: 'Mobile-first responsive design with cross-browser compatibility',
    category: 'web_development',
    baseCost: 500000, // $5,000
    timeEstimate: 40,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'web_cms_integration',
    name: 'CMS Integration',
    description: 'Content management system setup and customization',
    category: 'web_development',
    baseCost: 800000, // $8,000
    timeEstimate: 60,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'web_ecommerce',
    name: 'E-commerce Platform',
    description: 'Full e-commerce functionality with payment processing',
    category: 'web_development',
    baseCost: 2500000, // $25,000
    timeEstimate: 200,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'web_api_development',
    name: 'REST API Development',
    description: 'Custom API endpoints with documentation',
    category: 'web_development',
    baseCost: 1200000, // $12,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.0 }
  },
  {
    id: 'web_auth_system',
    name: 'Authentication System',
    description: 'User authentication with SSO, 2FA, and role-based access',
    category: 'web_development',
    baseCost: 600000, // $6,000
    timeEstimate: 48,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'web_realtime',
    name: 'Real-time Features',
    description: 'WebSocket integration for live updates and notifications',
    category: 'web_development',
    baseCost: 800000, // $8,000
    timeEstimate: 56,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.5, enterprise: 2.0 }
  },

  // Mobile Development Features
  {
    id: 'mobile_ios',
    name: 'iOS Native App',
    description: 'Native iOS application development',
    category: 'mobile_development',
    baseCost: 4000000, // $40,000
    timeEstimate: 320,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'mobile_android',
    name: 'Android Native App',
    description: 'Native Android application development',
    category: 'mobile_development',
    baseCost: 3500000, // $35,000
    timeEstimate: 280,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'mobile_cross_platform',
    name: 'Cross-Platform App',
    description: 'React Native or Flutter app for iOS and Android',
    category: 'mobile_development',
    baseCost: 5000000, // $50,000
    timeEstimate: 400,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'mobile_push_notifications',
    name: 'Push Notifications',
    description: 'Push notification system with targeting and analytics',
    category: 'mobile_development',
    baseCost: 400000, // $4,000
    timeEstimate: 32,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.3, enterprise: 1.8 }
  },
  {
    id: 'mobile_offline_sync',
    name: 'Offline Mode & Sync',
    description: 'Offline functionality with data synchronization',
    category: 'mobile_development',
    baseCost: 600000, // $6,000
    timeEstimate: 48,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.5, enterprise: 2.0 }
  },

  // AI/ML Features
  {
    id: 'ai_chatbot',
    name: 'AI Chatbot',
    description: 'Conversational AI with NLP capabilities',
    category: 'ai_ml',
    baseCost: 2000000, // $20,000
    timeEstimate: 120,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'ai_recommendation',
    name: 'Recommendation Engine',
    description: 'ML-powered personalized recommendations',
    category: 'ai_ml',
    baseCost: 3000000, // $30,000
    timeEstimate: 180,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.7, enterprise: 2.8 }
  },
  {
    id: 'ai_image_recognition',
    name: 'Image Recognition',
    description: 'Computer vision and image classification',
    category: 'ai_ml',
    baseCost: 3500000, // $35,000
    timeEstimate: 200,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.8, enterprise: 3.0 }
  },
  {
    id: 'ai_predictive_analytics',
    name: 'Predictive Analytics',
    description: 'ML models for business forecasting',
    category: 'ai_ml',
    baseCost: 4000000, // $40,000
    timeEstimate: 240,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.7, enterprise: 2.8 }
  },
  {
    id: 'ai_nlp_processing',
    name: 'NLP Processing',
    description: 'Natural language processing and text analysis',
    category: 'ai_ml',
    baseCost: 2500000, // $25,000
    timeEstimate: 160,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },

  // Blockchain Features
  {
    id: 'blockchain_smart_contract',
    name: 'Smart Contract Development',
    description: 'Solidity smart contracts with auditing',
    category: 'blockchain',
    baseCost: 2500000, // $25,000
    timeEstimate: 160,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.8, enterprise: 3.0 }
  },
  {
    id: 'blockchain_dapp',
    name: 'DApp Development',
    description: 'Decentralized application frontend and integration',
    category: 'blockchain',
    baseCost: 3500000, // $35,000
    timeEstimate: 220,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.7, enterprise: 2.8 }
  },
  {
    id: 'blockchain_nft',
    name: 'NFT Platform',
    description: 'NFT minting, marketplace, and management',
    category: 'blockchain',
    baseCost: 4000000, // $40,000
    timeEstimate: 260,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'blockchain_defi',
    name: 'DeFi Protocol',
    description: 'Decentralized finance protocol development',
    category: 'blockchain',
    baseCost: 6000000, // $60,000
    timeEstimate: 400,
    complexityMultiplier: { low: 0.4, medium: 1.0, high: 1.8, enterprise: 3.0 }
  },

  // Cloud Infrastructure Features
  {
    id: 'cloud_aws_setup',
    name: 'AWS Infrastructure Setup',
    description: 'AWS architecture design and implementation',
    category: 'cloud_infrastructure',
    baseCost: 1500000, // $15,000
    timeEstimate: 100,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'cloud_kubernetes',
    name: 'Kubernetes Deployment',
    description: 'Container orchestration with K8s',
    category: 'cloud_infrastructure',
    baseCost: 2000000, // $20,000
    timeEstimate: 140,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'cloud_serverless',
    name: 'Serverless Architecture',
    description: 'Lambda/Functions deployment and integration',
    category: 'cloud_infrastructure',
    baseCost: 1200000, // $12,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'cloud_multi_region',
    name: 'Multi-Region Deployment',
    description: 'Global infrastructure with failover',
    category: 'cloud_infrastructure',
    baseCost: 2500000, // $25,000
    timeEstimate: 180,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.7, enterprise: 2.8 }
  },

  // Cybersecurity Features
  {
    id: 'security_audit',
    name: 'Security Audit',
    description: 'Comprehensive security assessment and penetration testing',
    category: 'cybersecurity',
    baseCost: 1500000, // $15,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'security_compliance',
    name: 'Compliance Implementation',
    description: 'SOC2, HIPAA, GDPR compliance setup',
    category: 'cybersecurity',
    baseCost: 3000000, // $30,000
    timeEstimate: 200,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'security_encryption',
    name: 'Data Encryption',
    description: 'End-to-end encryption implementation',
    category: 'cybersecurity',
    baseCost: 800000, // $8,000
    timeEstimate: 60,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'security_siem',
    name: 'SIEM Integration',
    description: 'Security monitoring and incident response',
    category: 'cybersecurity',
    baseCost: 2000000, // $20,000
    timeEstimate: 140,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },

  // Data Engineering Features
  {
    id: 'data_pipeline',
    name: 'Data Pipeline',
    description: 'ETL/ELT pipeline development',
    category: 'data_engineering',
    baseCost: 1500000, // $15,000
    timeEstimate: 100,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'data_warehouse',
    name: 'Data Warehouse',
    description: 'Data warehouse design and implementation',
    category: 'data_engineering',
    baseCost: 2500000, // $25,000
    timeEstimate: 180,
    complexityMultiplier: { low: 0.5, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },
  {
    id: 'data_analytics_dashboard',
    name: 'Analytics Dashboard',
    description: 'Business intelligence dashboard with visualizations',
    category: 'data_engineering',
    baseCost: 1200000, // $12,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'data_real_time',
    name: 'Real-time Data Processing',
    description: 'Streaming data processing with Kafka/Flink',
    category: 'data_engineering',
    baseCost: 2000000, // $20,000
    timeEstimate: 140,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.6, enterprise: 2.5 }
  },

  // DevOps Features
  {
    id: 'devops_ci_cd',
    name: 'CI/CD Pipeline',
    description: 'Automated build, test, and deployment pipeline',
    category: 'devops',
    baseCost: 800000, // $8,000
    timeEstimate: 60,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'devops_iac',
    name: 'Infrastructure as Code',
    description: 'Terraform/Pulumi infrastructure automation',
    category: 'devops',
    baseCost: 1200000, // $12,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.5, enterprise: 2.0 }
  },
  {
    id: 'devops_monitoring',
    name: 'Monitoring & Alerting',
    description: 'Application and infrastructure monitoring',
    category: 'devops',
    baseCost: 600000, // $6,000
    timeEstimate: 48,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.3, enterprise: 1.8 }
  },
  {
    id: 'devops_disaster_recovery',
    name: 'Disaster Recovery',
    description: 'Backup and disaster recovery planning',
    category: 'devops',
    baseCost: 1500000, // $15,000
    timeEstimate: 100,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },

  // UI/UX Design Features
  {
    id: 'design_ux_research',
    name: 'UX Research',
    description: 'User research, personas, and journey mapping',
    category: 'ui_ux_design',
    baseCost: 800000, // $8,000
    timeEstimate: 60,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.4, enterprise: 2.0 }
  },
  {
    id: 'design_ui_system',
    name: 'Design System',
    description: 'Component library and style guide',
    category: 'ui_ux_design',
    baseCost: 1200000, // $12,000
    timeEstimate: 80,
    complexityMultiplier: { low: 0.6, medium: 1.0, high: 1.5, enterprise: 2.2 }
  },
  {
    id: 'design_prototyping',
    name: 'Interactive Prototyping',
    description: 'High-fidelity clickable prototypes',
    category: 'ui_ux_design',
    baseCost: 600000, // $6,000
    timeEstimate: 48,
    complexityMultiplier: { low: 0.7, medium: 1.0, high: 1.3, enterprise: 1.8 }
  },
  {
    id: 'design_accessibility',
    name: 'Accessibility Audit',
    description: 'WCAG compliance review and implementation',
    category: 'ui_ux_design',
    baseCost: 500000, // $5,000
    timeEstimate: 40,
    complexityMultiplier: { low: 0.8, medium: 1.0, high: 1.3, enterprise: 1.6 }
  }
]

// Get features by category
export function getFeaturesByCategory(category: ServiceCategory): FeatureDefinition[] {
  return FEATURE_CATALOG.filter(f => f.category === category)
}

// Get feature by ID
export function getFeatureById(id: string): FeatureDefinition | undefined {
  return FEATURE_CATALOG.find(f => f.id === id)
}

// Get all categories with labels
export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'web_development', label: 'Web Development' },
  { value: 'mobile_development', label: 'Mobile Development' },
  { value: 'ai_ml', label: 'AI & Machine Learning' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'cloud_infrastructure', label: 'Cloud Infrastructure' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'data_engineering', label: 'Data Engineering' },
  { value: 'devops', label: 'DevOps' },
  { value: 'ui_ux_design', label: 'UI/UX Design' },
  { value: 'consulting', label: 'Consulting' }
]

