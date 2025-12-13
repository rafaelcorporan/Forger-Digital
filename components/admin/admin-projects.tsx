"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  MoreVertical, 
  Plus, 
  FileText, 
  Eye,
  Pencil,
  Trash2,
  Building2,
  FolderKanban
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

// Custom Actions Menu Component using fixed positioning to escape overflow:hidden
function ActionsMenu({ 
  project, 
  onEdit, 
  onDelete, 
  onView,
  onGenerateContract,
  canDelete 
}: { 
  project: Project
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  onGenerateContract: () => void
  canDelete: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const menu = document.getElementById(`menu-${project.id}`)
        if (menu && !menu.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }
    
    function handleScroll() {
      setIsOpen(false)
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("scroll", handleScroll, true)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("scroll", handleScroll, true)
      }
    }
  }, [isOpen, project.id])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 192, // 192px = w-48 = 12rem
      })
    }
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div 
          id={`menu-${project.id}`}
          className="fixed w-48 bg-gray-800 border border-gray-700 rounded-md shadow-2xl py-1"
          style={{ 
            top: menuPosition.top, 
            left: menuPosition.left,
            zIndex: 99999,
          }}
        >
          <button
            onClick={() => { onView(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <Eye className="h-4 w-4 flex-shrink-0" />
            View Details
          </button>
          <button
            onClick={() => { onGenerateContract(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            Generate Contract
          </button>
          <div className="h-px bg-gray-700 my-1" />
          <button
            onClick={() => { onEdit(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <Pencil className="h-4 w-4 flex-shrink-0" />
            Edit Project
          </button>
          {canDelete && (
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left"
            >
              <Trash2 className="h-4 w-4 flex-shrink-0" />
              Delete Project
            </button>
          )}
        </div>
      )}
    </>
  )
}

interface Project {
  id: string
  name: string
  slug: string
  description: string
  status: string
  complexity: string
  estimatedCost: number | null
  timeline: string | null
  createdAt: string
  clientProfile: {
    id: string
    company: string | null
    user: {
      id: string
      name: string | null
      email: string
    }
  }
  _count: {
    contracts: number
    assignments: number
  }
}

interface Client {
  id: string
  company: string | null
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function AdminProjects() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [generatingContract, setGeneratingContract] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientProfileId: "",
    complexity: "MEDIUM",
    timeline: "",
    deliverables: "",
    techStack: "",
  })

  useEffect(() => {
    fetchProjects()
    fetchClients()
  }, [page, search, statusFilter])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      })
      const response = await fetch(`/api/admin/projects?${params}`)
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data.projects)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/admin/clients?limit=100")
      if (!response.ok) return
      const data = await response.json()
      console.log("Fetched clients:", data.clients) // Debug
      setClients(data.clients || [])
    } catch (err) {
      console.error("Failed to fetch clients:", err)
    }
  }
  
  // Refresh clients when dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      fetchClients()
    }
  }, [isCreateDialogOpen])

  const handleCreateProject = async () => {
    // Validate required fields with specific messages
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }
    
    if (!formData.clientProfileId) {
      toast.error("Please select a client. If no clients exist, create one in the Users tab first.")
      return
    }
    
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      toast.error("Please provide a project description (at least 10 characters)")
      return
    }

    try {
      setCreating(true)
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deliverables: formData.deliverables.split("\n").filter(d => d.trim()),
          techStack: formData.techStack.split(",").map(t => t.trim()).filter(t => t),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create project")
      }

      const result = await response.json()
      
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        clientProfileId: "",
        complexity: "MEDIUM",
        timeline: "",
        deliverables: "",
        techStack: "",
      })
      fetchProjects()
      
      toast.success(`Project "${result.project.name}" created successfully!`)
    } catch (err: any) {
      toast.error(err.message || "Failed to create project")
    } finally {
      setCreating(false)
    }
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project)
    setIsViewDialogOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      clientProfileId: project.clientProfile.id,
      complexity: project.complexity || "MEDIUM",
      timeline: project.timeline || "",
      deliverables: "",
      techStack: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProject = async () => {
    if (!selectedProject) return
    
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          complexity: formData.complexity,
          timeline: formData.timeline,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update project")
      }

      setIsEditDialogOpen(false)
      setSelectedProject(null)
      fetchProjects()
      toast.success("Project updated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to update project")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/projects/${selectedProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete project")
      }

      setIsDeleteDialogOpen(false)
      setSelectedProject(null)
      fetchProjects()
      toast.success("Project deleted successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project")
    } finally {
      setDeleting(false)
    }
  }

  const handleOpenContractDialog = (project: Project) => {
    setSelectedProject(project)
    setIsContractDialogOpen(true)
  }

  const handleGenerateContract = async () => {
    if (!selectedProject) return

    try {
      setGeneratingContract(true)
      
      // Generate contract via API
      const response = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject.id,
          category: "web_development",
          selectedFeatures: ["custom_design", "responsive_design", "cms_integration"],
          timelineType: "standard",
          teamSize: "medium",
          supportLevel: "standard",
          companyName: "Forger Digital",
          companyAddress: "San Francisco, CA",
          companyEmail: "hello@forgerdigital.com",
          companyPhone: "+1 (347) 829-4952",
          warrantyPeriod: "30 days",
          confidentialityClause: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to generate contract")
      }

      const result = await response.json()
      
      setIsContractDialogOpen(false)
      setSelectedProject(null)
      fetchProjects()
      
      toast.success(
        `Contract ${result.contract.contractNumber} generated successfully!`,
        { 
          duration: 5000,
          action: {
            label: "View",
            onClick: () => window.open(`/contracts/view/${result.contract.shareToken}`, '_blank')
          }
        }
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to generate contract")
    } finally {
      setGeneratingContract(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      case "PROPOSAL": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "APPROVED": return "bg-green-500/20 text-green-400 border-green-500/50"
      case "IN_PROGRESS": return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "ON_HOLD": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "COMPLETED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/50"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const formatCurrency = (cents: number | null) => {
    if (!cents) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card className="bg-gray-800 border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PROPOSAL">Proposal</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="bg-gray-800 border-gray-700">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No projects found</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Create First Project
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Project</TableHead>
                    <TableHead className="text-gray-300">Client</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Est. Cost</TableHead>
                    <TableHead className="text-gray-300">Contracts</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} className="border-gray-700">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{project.name}</p>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {project.description.substring(0, 60)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">
                            {project.clientProfile.user.name || "—"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {project.clientProfile.company || project.clientProfile.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(project.status)}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatCurrency(project.estimatedCost)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {project._count.contracts}
                      </TableCell>
                      <TableCell>
                        <ActionsMenu
                          project={project}
                          onView={() => handleViewProject(project)}
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteClick(project)}
                          onGenerateContract={() => handleOpenContractDialog(project)}
                          canDelete={session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-900 border-gray-700 text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new project for a client. You can generate contracts after creation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-900 border-gray-700"
                  placeholder="E-commerce Platform"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                {clients.length === 0 ? (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                    <p className="text-sm text-yellow-400">
                      No clients found. Please create a client account in the <strong>Clients</strong> tab first.
                    </p>
                  </div>
                ) : (
                  <select
                    id="client"
                    value={formData.clientProfileId}
                    onChange={(e) => setFormData({ ...formData, clientProfileId: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="" className="bg-gray-900 text-gray-400">Select client</option>
                    {clients.map((client) => (
                      <option 
                        key={client.id} 
                        value={client.id}
                        className="bg-gray-900 text-white"
                      >
                        {client.user.name || client.user.email}
                        {client.company && ` (${client.company})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-900 border-gray-700 min-h-[100px]"
                placeholder="Detailed project description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complexity">Complexity</Label>
                <select
                  id="complexity"
                  value={formData.complexity}
                  onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="LOW" className="bg-gray-900">Low</option>
                  <option value="MEDIUM" className="bg-gray-900">Medium</option>
                  <option value="HIGH" className="bg-gray-900">High</option>
                  <option value="ENTERPRISE" className="bg-gray-900">Enterprise</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="bg-gray-900 border-gray-700"
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Deliverables (one per line)</Label>
              <Textarea
                id="deliverables"
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                className="bg-gray-900 border-gray-700"
                placeholder="Complete source code&#10;Documentation&#10;Deployment support"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input
                id="techStack"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="bg-gray-900 border-gray-700"
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={creating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {creating ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Project Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-gray-900 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-900 border-gray-700 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-complexity">Complexity</Label>
                <select
                  id="edit-complexity"
                  value={formData.complexity}
                  onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white shadow-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeline">Timeline</Label>
                <Input
                  id="edit-timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProject}
              disabled={updating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete <strong className="text-white">{selectedProject?.name}</strong>? 
              This action cannot be undone and will also delete all associated contracts.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProject}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Project Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-orange-500" />
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Full project details and information
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge className={getStatusBadgeColor(selectedProject.status)}>
                  {selectedProject.status.replace("_", " ")}
                </Badge>
                <span className="text-sm text-gray-400">
                  Created {new Date(selectedProject.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Description</h4>
                <p className="text-white bg-gray-900 p-3 rounded-md">
                  {selectedProject.description || "No description provided"}
                </p>
              </div>

              {/* Client Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Client Information</h4>
                <div className="bg-gray-900 p-3 rounded-md space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-white">
                      {selectedProject.clientProfile.user.name || "—"}
                    </span>
                  </div>
                  {selectedProject.clientProfile.company && (
                    <p className="text-sm text-gray-400 ml-6">
                      {selectedProject.clientProfile.company}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 ml-6">
                    {selectedProject.clientProfile.user.email}
                  </p>
                </div>
              </div>

              {/* Project Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Complexity</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedProject.complexity || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Timeline</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedProject.timeline || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Estimated Cost</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {formatCurrency(selectedProject.estimatedCost)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Contracts</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedProject._count.contracts} contract(s)
                  </p>
                </div>
              </div>

              {/* Staff Assignments */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Staff Assignments</h4>
                <p className="text-white bg-gray-900 p-2 rounded-md">
                  {selectedProject._count.assignments} team member(s) assigned
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedProject) handleEditProject(selectedProject)
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Contract Dialog */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              Generate Contract
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Generate a Master Services Agreement (MSA) contract for this project.
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4 py-4">
              {/* Project Summary */}
              <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">{selectedProject.name}</h4>
                  <Badge className={getStatusBadgeColor(selectedProject.status)}>
                    {selectedProject.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p><strong className="text-gray-300">Client:</strong> {selectedProject.clientProfile.user.name || selectedProject.clientProfile.user.email}</p>
                  {selectedProject.clientProfile.company && (
                    <p><strong className="text-gray-300">Company:</strong> {selectedProject.clientProfile.company}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Complexity:</span>
                    <span className="text-white ml-2">{selectedProject.complexity || "Medium"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Timeline:</span>
                    <span className="text-white ml-2">{selectedProject.timeline || "TBD"}</span>
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Contract Details</h4>
                <div className="bg-gray-900 p-3 rounded-md text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">Master Services Agreement (MSA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span className="text-white">Forger Digital</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Warranty:</span>
                    <span className="text-white">30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Terms:</span>
                    <span className="text-white">40% upfront, 60% on completion</span>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-md">
                <p className="text-sm text-orange-300">
                  📝 This will generate a professional MSA contract with the project details. 
                  You can share it with the client via a secure link.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsContractDialogOpen(false)}
              className="bg-gray-700 border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateContract}
              disabled={generatingContract}
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
            >
              {generatingContract ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Contract
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

