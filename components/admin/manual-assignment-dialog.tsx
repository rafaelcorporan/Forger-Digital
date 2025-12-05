"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { STAFF_DIRECTORY } from "@/lib/modules/project-assignment/staff-directory"
import { Plus, UserMinus } from "lucide-react"
import { toast } from "sonner"

interface ManualAssignmentProps {
    submissionId: string
    currentAssignments: any[]
    onUpdate: () => void
}

export function ManualAssignmentDialog({ submissionId, currentAssignments, onUpdate }: ManualAssignmentProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Filter out staff who are already assigned
    const availableStaff = STAFF_DIRECTORY.filter(
        staff => !currentAssignments.some(assigned => assigned.email === staff.email)
    )

    const handleAssign = async () => {
        if (!selectedStaff) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId,
                    staffEmail: selectedStaff,
                    action: 'assign'
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success("Staff member assigned successfully")
                setIsOpen(false)
                onUpdate()
            } else {
                toast.error(data.error || "Failed to assign staff")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Assign Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
                <DialogHeader>
                    <DialogTitle>Assign Staff Member</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Select a staff member to manually assign to this project.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Select onValueChange={setSelectedStaff} value={selectedStaff}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {availableStaff.map((staff) => (
                                <SelectItem key={staff.id} value={staff.email}>
                                    {staff.name} ({staff.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedStaff || isLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        {isLoading ? "Assigning..." : "Assign Staff"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
