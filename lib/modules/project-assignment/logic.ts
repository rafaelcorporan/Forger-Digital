import { STAFF_DIRECTORY } from './staff-directory';
import { ProjectAssignmentResult, StaffMember } from './types';

interface AnalysisInput {
    serviceInterests: string[];
    projectDescription: string;
}

export function analyzeAndAssignProject(input: AnalysisInput): ProjectAssignmentResult {
    const { serviceInterests, projectDescription } = input;
    const descriptionLower = projectDescription.toLowerCase();
    const assignedStaff = new Set<StaffMember>();
    const detectedKeywords = new Set<string>();
    const analysisLog: string[] = [];

    analysisLog.push(`Starting analysis for ${serviceInterests.length} services and description length ${projectDescription.length}`);

    // 1. Service-Based Assignment
    // Iterate through selected services and find staff who handle them
    serviceInterests.forEach(service => {
        const matchingStaff = STAFF_DIRECTORY.filter(staff =>
            staff.primaryServices.some(s => service.includes(s) || s.includes(service))
        );

        if (matchingStaff.length > 0) {
            matchingStaff.forEach(staff => {
                assignedStaff.add(staff);
                analysisLog.push(`Matched Service '${service}' to ${staff.role} (${staff.name})`);
            });
        } else {
            analysisLog.push(`No direct staff match for service: ${service}`);
        }
    });

    // 2. Keyword-Based Assignment (Refinement)
    // Scan description for specific technical keywords
    STAFF_DIRECTORY.forEach(staff => {
        staff.skills.forEach(skill => {
            if (descriptionLower.includes(skill.toLowerCase())) {
                detectedKeywords.add(skill);
                // If they weren't already assigned, add them now (strong signal)
                if (!assignedStaff.has(staff)) {
                    assignedStaff.add(staff);
                    analysisLog.push(`Matched Keyword '${skill}' to ${staff.role} (${staff.name})`);
                }
            }
        });
    });

    // 3. Fallback / Default Assignment
    // If no one is assigned, assign to Project Manager or Admin (represented by empty list handled by caller, or specific fallback)
    if (assignedStaff.size === 0) {
        analysisLog.push('No specific staff matched. Defaulting to general assignment.');
    }

    // Convert Set to Array
    const finalAssignment = Array.from(assignedStaff);

    return {
        assignedStaff: finalAssignment,
        primaryCategory: serviceInterests[0] || 'General Inquiry',
        detectedKeywords: Array.from(detectedKeywords),
        confidenceScore: finalAssignment.length > 0 ? 0.9 : 0.1,
        analysisLog
    };
}
