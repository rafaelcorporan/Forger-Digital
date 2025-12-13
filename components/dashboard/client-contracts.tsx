"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  FileSignature
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Contract {
  id: string
  contractNumber: string
  title: string
  status: string
  totalAmount: number
  currency: string
  validUntil: string | null
  signedAt: string | null
  createdAt: string
  shareToken: string | null
  project: {
    name: string
  }
}

export function ClientContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/contracts?limit=50")
      if (!response.ok) {
        throw new Error("Failed to fetch contracts")
      }
      const data = await response.json()
      setContracts(data.contracts || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching contracts:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SIGNED":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Signed
          </Badge>
        )
      case "SENT":
      case "VIEWED":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
            <Eye className="w-3 h-3 mr-1" />
            {status === "VIEWED" ? "Viewed" : "Pending Review"}
          </Badge>
        )
      case "DRAFT":
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
            <FileText className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100)
  }

  const handleViewContract = (contract: Contract) => {
    if (contract.shareToken) {
      window.open(`/contracts/view/${contract.shareToken}`, "_blank")
    }
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-orange-500" />
          My Contracts
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-orange-500" />
          My Contracts
        </h3>
        <p className="text-red-400">Error loading contracts: {error}</p>
      </Card>
    )
  }

  if (contracts.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-orange-500" />
          My Contracts
        </h3>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No contracts yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Contracts will appear here once they are created for your projects
          </p>
        </div>
      </Card>
    )
  }

  // Separate contracts by status for better organization
  const pendingContracts = contracts.filter(c => ["SENT", "VIEWED"].includes(c.status))
  const signedContracts = contracts.filter(c => c.status === "SIGNED")
  const otherContracts = contracts.filter(c => !["SENT", "VIEWED", "SIGNED"].includes(c.status))

  return (
    <Card className="bg-gray-800 border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <FileSignature className="w-5 h-5 text-orange-500" />
        My Contracts
        <Badge className="ml-2 bg-orange-500/20 text-orange-400">
          {contracts.length}
        </Badge>
      </h3>

      {/* Pending Contracts - Highlighted */}
      {pendingContracts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Action Required ({pendingContracts.length})
          </h4>
          <div className="space-y-3">
            {pendingContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{contract.title}</h4>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm text-gray-400">
                      {contract.project.name} • {contract.contractNumber}
                    </p>
                    <p className="text-lg font-semibold text-orange-400 mt-2">
                      {formatCurrency(contract.totalAmount, contract.currency)}
                    </p>
                    {contract.validUntil && (
                      <p className="text-xs text-yellow-400 mt-1">
                        ⏰ Valid until: {new Date(contract.validUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {contract.shareToken && (
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => handleViewContract(contract)}
                      >
                        <FileSignature className="w-4 h-4 mr-1" />
                        Review & Sign
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signed Contracts */}
      {signedContracts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Signed Contracts ({signedContracts.length})
          </h4>
          <div className="space-y-3">
            {signedContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{contract.title}</h4>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm text-gray-400">
                      {contract.project.name} • {contract.contractNumber}
                    </p>
                    <p className="text-lg font-semibold text-green-400 mt-2">
                      {formatCurrency(contract.totalAmount, contract.currency)}
                    </p>
                    {contract.signedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Signed {formatDistanceToNow(new Date(contract.signedAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {contract.shareToken && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Contracts (Draft, Expired, etc.) */}
      {otherContracts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Other Contracts ({otherContracts.length})
          </h4>
          <div className="space-y-3">
            {otherContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-300">{contract.title}</h4>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {contract.project.name} • {contract.contractNumber}
                    </p>
                    <p className="text-lg font-semibold text-gray-400 mt-2">
                      {formatCurrency(contract.totalAmount, contract.currency)}
                    </p>
                  </div>
                  {contract.shareToken && contract.status !== "EXPIRED" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400"
                      onClick={() => handleViewContract(contract)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

