"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  MoreVertical, 
  Plus, 
  FileText, 
  Eye,
  Send,
  Copy,
  RefreshCw,
  Download,
  CheckCircle,
  Calculator,
  XCircle,
  Trash2,
  ExternalLink
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

// Custom Actions Menu Component using fixed positioning
function ContractActionsMenu({ 
  contract, 
  onView,
  onCopyLink,
  onSend,
  onDownload,
  onDelete,
  canDelete
}: { 
  contract: {
    id: string
    contractNumber: string
    status: string
    shareToken: string | null
  }
  onView: () => void
  onCopyLink: () => void
  onSend: () => void
  onDownload: () => void
  onDelete: () => void
  canDelete: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const menu = document.getElementById(`contract-menu-${contract.id}`)
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
  }, [isOpen, contract.id])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 200,
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
          id={`contract-menu-${contract.id}`}
          className="fixed w-[200px] bg-gray-800 border border-gray-700 rounded-md shadow-2xl py-1"
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
            View Contract
          </button>
          
          {contract.shareToken && (
            <>
              <button
                onClick={() => { onCopyLink(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
              >
                <Copy className="h-4 w-4 flex-shrink-0" />
                Copy Share Link
              </button>
              <button
                onClick={() => { 
                  window.open(`/contracts/view/${contract.shareToken}`, '_blank')
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
              >
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                Open in New Tab
              </button>
            </>
          )}
          
          <div className="h-px bg-gray-700 my-1" />
          
          {contract.status === "DRAFT" && (
            <button
              onClick={() => { onSend(); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-400 hover:bg-green-500/20 transition-colors text-left"
            >
              <Send className="h-4 w-4 flex-shrink-0" />
              Send to Client
            </button>
          )}
          
          <button
            onClick={() => { onDownload(); setIsOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            Download PDF
          </button>
          
          {canDelete && (
            <>
              <div className="h-px bg-gray-700 my-1" />
              <button
                onClick={() => { onDelete(); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left"
              >
                <Trash2 className="h-4 w-4 flex-shrink-0" />
                Delete Contract
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

interface Contract {
  id: string
  contractNumber: string
  title: string
  status: string
  totalAmount: number
  currency: string
  validUntil: string | null
  signedAt: string | null
  signedByClient: string | null
  shareToken: string | null
  createdAt: string
  project: {
    id: string
    name: string
    clientProfile: {
      company: string | null
      user: {
        name: string | null
        email: string
      }
    }
  }
}

interface Project {
  id: string
  name: string
  description: string
  clientProfile: {
    company: string | null
    user: {
      name: string | null
      email: string
    }
  }
}

interface Feature {
  id: string
  name: string
  description: string
  category: string
  baseCost: number
  timeEstimate: number
  formattedBaseCost: string
}

interface PricingResult {
  total: number
  formattedTotal: string
  estimatedHours: number
  estimatedDuration: string
  breakdown: Array<{
    featureName: string
    formattedAdjustedCost: string
    hours: number
  }>
}

export function AdminContracts() {
  const { data: session } = useSession()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [featuresByCategory, setFeaturesByCategory] = useState<Record<string, Feature[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [activeTab, setActiveTab] = useState("project")

  // Form state
  const [formData, setFormData] = useState({
    projectId: "",
    category: "web_development",
    selectedFeatures: [] as string[],
    timelineType: "standard",
    teamSize: "medium",
    supportLevel: "standard",
    companyName: "Forger Digital",
    companyAddress: "San Francisco, CA",
    companyEmail: "hello@forgerdigital.com",
    companyPhone: "+1 (347) 829-4952",
    paymentTerms: "",
    warrantyPeriod: "30 days",
    confidentialityClause: true,
  })

  useEffect(() => {
    fetchContracts()
    fetchProjects()
    fetchFeatures()
  }, [page, search, statusFilter])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(statusFilter && statusFilter !== "all" && { status: statusFilter }),
      })
      const response = await fetch(`/api/admin/contracts?${params}`)
      if (!response.ok) throw new Error("Failed to fetch contracts")
      const data = await response.json()
      setContracts(data.contracts)
      setTotalPages(data.pagination.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects?limit=100")
      if (!response.ok) return
      const data = await response.json()
      setProjects(data.projects)
    } catch (err) {
      console.error("Failed to fetch projects:", err)
    }
  }

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/admin/pricing/features")
      if (!response.ok) return
      const data = await response.json()
      setFeatures(data.features)
      setFeaturesByCategory(data.featuresByCategory)
    } catch (err) {
      console.error("Failed to fetch features:", err)
    }
  }

  const calculatePricing = async () => {
    if (!formData.selectedFeatures.length) {
      alert("Please select at least one feature")
      return
    }

    const selectedProject = projects.find(p => p.id === formData.projectId)
    
    try {
      setCalculating(true)
      const response = await fetch("/api/admin/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: selectedProject?.name || "New Project",
          description: selectedProject?.description || "Project description",
          category: formData.category,
          complexity: "medium",
          selectedFeatures: formData.selectedFeatures,
          timeline: formData.timelineType,
          teamSize: formData.teamSize,
          supportLevel: formData.supportLevel,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to calculate pricing")
      }

      const data = await response.json()
      setPricingResult(data.pricing)
      setActiveTab("pricing")
      toast.success("Pricing calculated successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to calculate pricing")
    } finally {
      setCalculating(false)
    }
  }

  const handleCreateContract = async () => {
    // Validate all required data
    if (!formData.projectId) {
      toast.error("Please select a project first")
      setActiveTab("project")
      return
    }
    
    if (!formData.selectedFeatures.length) {
      toast.error("Please select at least one feature")
      setActiveTab("features")
      return
    }
    
    if (!pricingResult) {
      toast.error("Please calculate pricing first")
      setActiveTab("features")
      return
    }

    try {
      setCreating(true)
      const response = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create contract")
      }

      const result = await response.json()
      
      setIsCreateDialogOpen(false)
      setFormData({
        projectId: "",
        category: "web_development",
        selectedFeatures: [],
        timelineType: "standard",
        teamSize: "medium",
        supportLevel: "standard",
        companyName: "Forger Digital",
        companyAddress: "San Francisco, CA",
        companyEmail: "contracts@forgerdigital.com",
        companyPhone: "+1 (347) 829-4952",
        paymentTerms: "",
        warrantyPeriod: "30 days",
        confidentialityClause: true,
      })
      setPricingResult(null)
      setActiveTab("project")
      fetchContracts()
      
      toast.success(`Contract ${result.contract.contractNumber} created successfully!`)
    } catch (err: any) {
      toast.error(err.message || "Failed to create contract")
    } finally {
      setCreating(false)
    }
  }

  const handleSendContract = async (contractId: string) => {
    try {
      await fetch(`/api/admin/contracts/${contractId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SENT" }),
      })
      fetchContracts()
    } catch (err) {
      console.error("Failed to send contract:", err)
    }
  }

  const copyShareLink = async (token: string) => {
    const url = `${window.location.origin}/contracts/view/${token}`
    await navigator.clipboard.writeText(url)
    toast.success("Share link copied to clipboard!")
  }

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsViewDialogOpen(true)
  }

  const handleDeleteClick = (contract: Contract) => {
    setSelectedContract(contract)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteContract = async () => {
    if (!selectedContract) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/contracts/${selectedContract.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete contract")
      }

      setIsDeleteDialogOpen(false)
      setSelectedContract(null)
      fetchContracts()
      toast.success("Contract deleted successfully!")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete contract")
    } finally {
      setDeleting(false)
    }
  }

  const handleDownloadPdf = (contract: Contract) => {
    if (contract.shareToken) {
      // Open in new tab for now - can be enhanced to trigger actual download
      window.open(`/contracts/view/${contract.shareToken}?download=true`, '_blank')
      toast.success("Opening contract for download...")
    } else {
      toast.error("Contract share link not available")
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      case "PENDING_REVIEW": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "SENT": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "VIEWED": return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      case "SIGNED": return "bg-green-500/20 text-green-400 border-green-500/50"
      case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/50"
      case "EXPIRED": return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter(f => f !== featureId)
        : [...prev.selectedFeatures, featureId]
    }))
    setPricingResult(null)
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
                placeholder="Search contracts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}>
              <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="VIEWED">Viewed</SelectItem>
                <SelectItem value="SIGNED">Signed</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Contract
          </Button>
        </div>
      </Card>

      {/* Contracts Table */}
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
        ) : contracts.length === 0 ? (
          <div className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No contracts found</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Generate First Contract
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Contract</TableHead>
                    <TableHead className="text-gray-300">Project / Client</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id} className="border-gray-700">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{contract.contractNumber}</p>
                          <p className="text-sm text-gray-400">{contract.title}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{contract.project.name}</p>
                          <p className="text-sm text-gray-400">
                            {contract.project.clientProfile.user.name || contract.project.clientProfile.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(contract.status)}>
                          {contract.status === "SIGNED" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {contract.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 font-medium">
                        {formatCurrency(contract.totalAmount)}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(contract.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ContractActionsMenu
                          contract={contract}
                          onView={() => handleViewContract(contract)}
                          onCopyLink={() => copyShareLink(contract.shareToken!)}
                          onSend={() => handleSendContract(contract.id)}
                          onDownload={() => handleDownloadPdf(contract)}
                          onDelete={() => handleDeleteClick(contract)}
                          canDelete={session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

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

      {/* Create Contract Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-orange-500" />
              Generate Contract with Pricing
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Select features to calculate pricing and generate a professional contract.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={(value) => {
            // Validate before allowing tab navigation
            if (value === "features" && !formData.projectId) {
              return // Can't go to features without a project
            }
            if (value === "pricing" && (!formData.projectId || !formData.selectedFeatures.length)) {
              return // Can't go to review without project and features
            }
            setActiveTab(value)
          }} className="mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="project">1. Project</TabsTrigger>
              <TabsTrigger 
                value="features" 
                disabled={!formData.projectId}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                2. Features
              </TabsTrigger>
              <TabsTrigger 
                value="pricing" 
                disabled={!formData.projectId || !formData.selectedFeatures.length || !pricingResult}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                3. Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="project" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Project *</Label>
                <Select 
                  value={formData.projectId} 
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} - {project.clientProfile.user.name || project.clientProfile.user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value, selectedFeatures: [] })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web_development">Web Development</SelectItem>
                      <SelectItem value="mobile_development">Mobile Development</SelectItem>
                      <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="cloud_infrastructure">Cloud Infrastructure</SelectItem>
                      <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="data_engineering">Data Engineering</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="ui_ux_design">UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Select 
                    value={formData.timelineType} 
                    onValueChange={(value) => setFormData({ ...formData, timelineType: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (+35%)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="flexible">Flexible (-10%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Select 
                    value={formData.teamSize} 
                    onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-2 devs)</SelectItem>
                      <SelectItem value="medium">Medium (3-5 devs)</SelectItem>
                      <SelectItem value="large">Large (6+ devs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Support Level</Label>
                  <Select 
                    value={formData.supportLevel} 
                    onValueChange={(value) => setFormData({ ...formData, supportLevel: value })}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Included)</SelectItem>
                      <SelectItem value="standard">Standard (+$2,500)</SelectItem>
                      <SelectItem value="premium">Premium (+$5,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => setActiveTab("features")}
                disabled={!formData.projectId}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Continue to Features
              </Button>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-4">
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {featuresByCategory[formData.category]?.map((feature) => (
                  <div 
                    key={feature.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.selectedFeatures.includes(feature.id)
                        ? "bg-orange-500/20 border-orange-500"
                        : "bg-gray-900 border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={formData.selectedFeatures.includes(feature.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-white">{feature.name}</p>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-orange-400">{feature.formattedBaseCost}</p>
                        <p className="text-sm text-gray-400">{feature.timeEstimate} hrs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <p className="text-gray-400">
                  {formData.selectedFeatures.length} features selected
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("project")}
                    className="bg-gray-700 border-gray-600"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={calculatePricing}
                    disabled={calculating || !formData.selectedFeatures.length}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {calculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate Pricing
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              {pricingResult ? (
                <>
                  <Card className="bg-gray-900 border-gray-700 p-6">
                    <div className="text-center mb-6">
                      <p className="text-gray-400 text-sm">Total Project Cost</p>
                      <p className="text-4xl font-bold text-orange-500">{pricingResult.formattedTotal}</p>
                      <p className="text-gray-400 mt-2">
                        {pricingResult.estimatedHours} hours • {pricingResult.estimatedDuration}
                      </p>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {pricingResult.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.featureName}</span>
                          <span className="text-gray-400">{item.formattedAdjustedCost}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-gray-900 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company Email</Label>
                        <Input
                          value={formData.companyEmail}
                          onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                          className="bg-gray-900 border-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Company Address</Label>
                      <Input
                        value={formData.companyAddress}
                        onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("features")}
                      className="bg-gray-700 border-gray-600"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleCreateContract}
                      disabled={creating}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      {creating ? "Generating..." : "Generate Contract"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Calculate pricing first to see the breakdown</p>
                  <Button 
                    onClick={() => setActiveTab("features")}
                    variant="outline"
                    className="mt-4"
                  >
                    Go to Features
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              {selectedContract?.contractNumber}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Contract details and information
            </DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Badge className={getStatusBadgeColor(selectedContract.status)}>
                  {selectedContract.status === "SIGNED" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {selectedContract.status}
                </Badge>
                <span className="text-sm text-gray-400">
                  Created {new Date(selectedContract.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Contract Title */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Title</h4>
                <p className="text-white bg-gray-900 p-3 rounded-md">
                  {selectedContract.title}
                </p>
              </div>

              {/* Project & Client */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Project</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedContract.project.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Client</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedContract.project.clientProfile.user.name || selectedContract.project.clientProfile.user.email}
                  </p>
                </div>
              </div>

              {/* Amount & Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Amount</h4>
                  <p className="text-orange-500 font-bold bg-gray-900 p-2 rounded-md">
                    {formatCurrency(selectedContract.totalAmount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Valid Until</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedContract.validUntil 
                      ? new Date(selectedContract.validUntil).toLocaleDateString() 
                      : "No expiry"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Signed</h4>
                  <p className="text-white bg-gray-900 p-2 rounded-md">
                    {selectedContract.signedAt 
                      ? new Date(selectedContract.signedAt).toLocaleDateString() 
                      : "Not yet"}
                  </p>
                </div>
              </div>

              {/* Share Link */}
              {selectedContract.shareToken && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-400">Share Link</h4>
                  <div className="flex gap-2">
                    <Input 
                      value={`${window.location.origin}/contracts/view/${selectedContract.shareToken}`}
                      readOnly
                      className="bg-gray-900 border-gray-700 text-gray-300 text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyShareLink(selectedContract.shareToken!)}
                      className="bg-gray-700 border-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
            {selectedContract?.shareToken && (
              <Button
                onClick={() => window.open(`/contracts/view/${selectedContract.shareToken}`, '_blank')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Contract
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Contract</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete contract <strong className="text-white">{selectedContract?.contractNumber}</strong>? 
              This action cannot be undone.
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
              onClick={handleDeleteContract}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : "Delete Contract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

