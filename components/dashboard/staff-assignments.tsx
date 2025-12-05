"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, Calendar, User, Mail } from "lucide-react"

interface Assignment {
    id: string
    firstName: string
    lastName: string
    company: string
    email: string
    projectDescription: string
    serviceInterests: string[]
    createdAt: string
    assignmentData?: {
        assignedStaff: Array<{
            email: string
            role: string
            name: string
        }>
        detectedKeywords: string[]
    }
}

export function StaffAssignments() {
    const { data: session } = useSession()
    const [assignments, setAssignments] = useState<Assignment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('/api/staff/assignments')
                const data = await response.json()

                if (data.success && session?.user?.email) {
                    // Filter assignments for the current user
                    const myAssignments = data.submissions.filter((sub: Assignment) =>
                        sub.assignmentData?.assignedStaff?.some(
                            staff => staff.email.toLowerCase() === session.user?.email?.toLowerCase()
                        )
                    )
                    setAssignments(myAssignments)
                }
            } catch (error) {
                console.error('Failed to fetch assignments:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (session?.user?.email) {
            fetchAssignments()
        }
    }, [session])

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>
    }

    if (assignments.length === 0) {
        return (
            <Card className="p-8 text-center bg-gray-800 border-gray-700">
                <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Assignments Yet</h3>
                <p className="text-gray-400">You haven't been assigned to any projects yet.</p>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="text-orange-500" />
                My Project Assignments
            </h2>

            <div className="grid gap-6">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="bg-gray-800 border-gray-700 p-6 hover:border-orange-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {assignment.company}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <User className="h-4 w-4" />
                                    {assignment.firstName} {assignment.lastName}
                                </div>
                            </div>
                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                                {new Date(assignment.createdAt).toLocaleDateString()}
                            </Badge>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Project Description</h4>
                            <p className="text-gray-400 text-sm line-clamp-3">
                                {assignment.projectDescription}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {assignment.serviceInterests.map((service, idx) => (
                                <Badge key={idx} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
                                    {service}
                                </Badge>
                            ))}
                        </div>

                        {assignment.assignmentData?.detectedKeywords && assignment.assignmentData.detectedKeywords.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Detected Keywords</span>
                                <div className="flex flex-wrap gap-1">
                                    {assignment.assignmentData.detectedKeywords.map((kw, idx) => (
                                        <span key={idx} className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Mail className="h-4 w-4" />
                                {assignment.email}
                            </div>
                            {/* Add action buttons here later */}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
