import { StaffMember } from './types';

export const STAFF_DIRECTORY: StaffMember[] = [
    {
        id: 'staff_001',
        name: 'Alex Rivera',
        role: 'Frontend Lead',
        email: 'frontend@forgerdigital.com',
        skills: ['react', 'next.js', 'typescript', 'tailwind', 'ui/ux', 'figma', 'frontend', 'web'],
        primaryServices: ['Web Application Development', 'Custom Software Development']
    },
    {
        id: 'staff_002',
        name: 'Sarah Chen',
        role: 'Backend Lead',
        email: 'backend@forgerdigital.com',
        skills: ['node.js', 'python', 'database', 'sql', 'postgresql', 'api', 'graphql', 'backend', 'server'],
        primaryServices: ['Custom Software Development', 'Enterprise Solutions', 'Data & Analytics']
    },
    {
        id: 'staff_003',
        name: 'Marcus Johnson',
        role: 'Mobile Lead',
        email: 'mobile@forgerdigital.com',
        skills: ['react native', 'ios', 'android', 'flutter', 'mobile', 'app store'],
        primaryServices: ['Mobile App Development']
    },
    {
        id: 'staff_004',
        name: 'David Kim',
        role: 'Cloud Architect',
        email: 'cloud@forgerdigital.com',
        skills: ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'serverless', 'infrastructure'],
        primaryServices: ['Cloud Infrastructure & DevOps', 'DevOps Automation']
    },
    {
        id: 'staff_005',
        name: 'Elena Rodriguez',
        role: 'AI/ML Engineer',
        email: 'ai@forgerdigital.com',
        skills: ['ai', 'machine learning', 'nlp', 'python', 'tensorflow', 'openai', 'llm', 'bot'],
        primaryServices: ['AI Integration', 'Data & Analytics']
    },
    {
        id: 'staff_006',
        name: 'James Wilson',
        role: 'Security Specialist',
        email: 'security@forgerdigital.com',
        skills: ['security', 'compliance', 'penetration testing', 'encryption', 'audit', 'cybersecurity'],
        primaryServices: ['Cybersecurity & Compliance']
    },
    {
        id: 'staff_007',
        name: 'Michael Chang',
        role: 'Blockchain Developer',
        email: 'blockchain@forgerdigital.com',
        skills: ['blockchain', 'web3', 'smart contract', 'solidity', 'ethereum', 'crypto'],
        primaryServices: ['Blockchain Development']
    }
];

export const ADMIN_EMAIL = process.env.SMTP_USER || 'admin@forgerdigital.com';
