import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { STAFF_DIRECTORY } from '@/lib/modules/project-assignment/staff-directory'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { submissionId, staffEmail, action } = body

        if (!submissionId || !staffEmail || !action) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        // Fetch the current submission
        const submission = await prisma.getStartedSubmission.findUnique({
            where: { id: submissionId },
        })

        if (!submission) {
            return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 })
        }

        // Get current assignment data or initialize it
        const currentData = (submission.assignmentData as any) || { assignedStaff: [], detectedKeywords: [] }
        let assignedStaff = currentData.assignedStaff || []

        // Find the staff member details from the directory
        const staffMember = STAFF_DIRECTORY.find(s => s.email === staffEmail)

        if (!staffMember) {
            return NextResponse.json({ success: false, error: 'Staff member not found in directory' }, { status: 404 })
        }

        if (action === 'assign') {
            // Check if already assigned
            if (!assignedStaff.some((s: any) => s.email === staffEmail)) {
                assignedStaff.push({
                    id: staffMember.id,
                    name: staffMember.name,
                    role: staffMember.role,
                    email: staffMember.email
                })
            }
        } else if (action === 'remove') {
            assignedStaff = assignedStaff.filter((s: any) => s.email !== staffEmail)
        }

        // Update the database
        const updatedSubmission = await prisma.getStartedSubmission.update({
            where: { id: submissionId },
            data: {
                assignmentData: {
                    ...currentData,
                    assignedStaff
                }
            }
        })

        return NextResponse.json({ success: true, data: updatedSubmission })
    } catch (error: any) {
        console.error('Assignment update error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
