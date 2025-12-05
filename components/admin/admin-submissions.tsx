"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Mail, FileText, Calendar, Building, Phone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ManualAssignmentDialog } from "@/components/admin/manual-assignment-dialog"
import { X } from "lucide-react"
import { toast } from "sonner"

interface Submission {
  id: string
  type?: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  company?: string | null
  message?: string
  projectDescription?: string
  serviceInterests?: string[]
  contactMethod?: string
  timeline?: string | null
  budget?: string | null
  createdAt: string
  assignmentData?: {
    assignedStaff: Array<{
      id: string
      name: string
      role: string
      email: string
    }>
    detectedKeywords: string[]
  }
}

export function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [page, search, typeFilter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: typeFilter,
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      })
      const response = await fetch(`/api/admin/submissions?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch submissions")
      }
      const data = await response.json()
      setSubmissions(data.submissions)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search submissions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <Select value={typeFilter} onValueChange={(value) => {
            setTypeFilter(value)
            setPage(1)
          }}>
            <SelectTrigger className="w-full md:w-[200px] bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="contact">Contact Forms</SelectItem>
              <SelectItem value="get-started">Get Started Forms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card className="bg-gray-800 border-gray-700">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="text-red-400">Error loading submissions: {error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400">No submissions found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Company</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id} className="border-gray-700">
                      <TableCell>
                        <Badge
                          className={
                            submission.type === "contact"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              : "bg-green-500/20 text-green-400 border-green-500/50"
                          }
                        >
                          {submission.type === "contact" ? (
                            <Mail className="w-3 h-3 mr-1" />
                          ) : (
                            <FileText className="w-3 h-3 mr-1" />
                          )}
                          {submission.type === "contact" ? "Contact" : "Get Started"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">
                            {submission.firstName} {submission.lastName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {submission.email}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {submission.company || "-"}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedSubmission(submission)}
                              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-700"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">
                                {submission.type === "contact" ? "Contact Form" : "Get Started Form"} Submission
                              </DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Submitted on {new Date(submission.createdAt).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Name</p>
                                  <p className="text-white">
                                    {submission.firstName} {submission.lastName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Email</p>
                                  <p className="text-white">{submission.email}</p>
                                </div>
                                {submission.phone && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                                    <p className="text-white">{submission.phone}</p>
                                  </div>
                                )}
                                {submission.company && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Company</p>
                                    <p className="text-white">{submission.company}</p>
                                  </div>
                                )}
                              </div>
                              {submission.message && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Message</p>
                                  <p className="text-white bg-gray-900 p-3 rounded-lg">
                                    {submission.message}
                                  </p>
                                </div>
                              )}
                              {submission.projectDescription && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Project Description</p>
                                  <p className="text-white bg-gray-900 p-3 rounded-lg">
                                    {submission.projectDescription}
                                  </p>
                                </div>
                              )}
                              {submission.serviceInterests && submission.serviceInterests.length > 0 && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Service Interests</p>
                                  <div className="flex flex-wrap gap-2">
                                    {submission.serviceInterests.map((interest, idx) => (
                                      <Badge key={idx} className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                                        {interest}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {submission.contactMethod && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Preferred Contact Method</p>
                                  <p className="text-white">{submission.contactMethod}</p>
                                </div>
                              )}
                              {submission.timeline && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Timeline</p>
                                  <p className="text-white">{submission.timeline}</p>
                                </div>
                              )}
                              {submission.budget && (
                                <div>
                                  <p className="text-sm text-gray-400 mb-1">Budget</p>
                                  <p className="text-white">{submission.budget}</p>
                                </div>
                              )}

                              {/* Assignment Section */}
                              {submission.type === "get-started" && (
                                <div className="col-span-2 mt-4 pt-4 border-t border-gray-700">
                                  <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white">Project Assignments</h3>
                                    <ManualAssignmentDialog
                                      submissionId={submission.id}
                                      currentAssignments={submission.assignmentData?.assignedStaff || []}
                                      onUpdate={fetchSubmissions}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    {submission.assignmentData?.assignedStaff && submission.assignmentData.assignedStaff.length > 0 ? (
                                      submission.assignmentData.assignedStaff.map((staff) => (
                                        <div key={staff.email} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                                          <div>
                                            <p className="text-white font-medium">{staff.name}</p>
                                            <p className="text-sm text-gray-400">{staff.role}</p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            onClick={async () => {
                                              try {
                                                const response = await fetch('/api/admin/assignments', {
                                                  method: 'POST',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({
                                                    submissionId: submission.id,
                                                    staffEmail: staff.email,
                                                    action: 'remove'
                                                  })
                                                })
                                                if (response.ok) {
                                                  toast.success("Staff removed")
                                                  fetchSubmissions()
                                                }
                                              } catch (e) {
                                                toast.error("Failed to remove staff")
                                              }
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-gray-500 italic">No staff assigned yet.</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

