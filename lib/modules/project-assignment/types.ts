export type StaffRole =
    | 'Principal Architect'
    | 'Frontend Lead'
    | 'Backend Lead'
    | 'Mobile Lead'
    | 'Cloud Architect'
    | 'Security Specialist'
    | 'AI/ML Engineer'
    | 'Blockchain Developer'
    | 'DevOps Engineer'
    | 'Data Scientist'
    | 'Project Manager';

export interface StaffMember {
    id: string;
    name: string;
    role: StaffRole;
    email: string;
    skills: string[]; // Keywords they are expert in
    primaryServices: string[]; // Service categories they handle
}

export interface ProjectAssignmentResult {
    assignedStaff: StaffMember[];
    primaryCategory: string;
    detectedKeywords: string[];
    confidenceScore: number; // 0-1
    analysisLog: string[];
}
