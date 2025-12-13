"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  FileSignature,
  Calendar
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface ContractData {
  id: string
  contractNumber: string
  title: string
  content: string
  status: string
  totalAmount: number
  currency: string
  validUntil: string | null
  signedAt: string | null
  signedByClient: string | null
  termsVersion: string
  createdAt: string
  project: {
    name: string
    client: {
      name: string | null
      company: string | null
    }
  }
  metadata: any
}

export default function ContractViewPage() {
  const params = useParams()
  const token = params.token as string
  
  const [contract, setContract] = useState<ContractData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signatureName, setSignatureName] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    fetchContract()
  }, [token])

  const fetchContract = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/contracts/view/${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load contract")
      }

      setContract(data.contract)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async () => {
    if (!signatureName.trim()) {
      toast.error("Please enter your full legal name")
      return
    }
    
    if (signatureName.trim().length < 2) {
      toast.error("Name must be at least 2 characters")
      return
    }
    
    if (!agreedToTerms) {
      toast.error("You must agree to the terms and conditions")
      return
    }

    try {
      setSigning(true)
      console.log('Signing contract with:', { signatureName: signatureName.trim(), agreedToTerms, token })
      
      const response = await fetch(`/api/contracts/view/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureName: signatureName.trim(),
          agreedToTerms,
        }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign contract")
      }

      // Close dialog first
      setIsSignDialogOpen(false)
      
      // Show success message
      toast.success("🎉 Contract signed successfully!", {
        description: `Signed by ${signatureName.trim()} on ${new Date().toLocaleDateString()}`,
        duration: 5000,
      })
      
      // Reset form
      setSignatureName("")
      setAgreedToTerms(false)
      
      // Refresh to show signed status
      await fetchContract()
    } catch (err: any) {
      console.error('Sign error:', err)
      toast.error(err.message || "Failed to sign contract", {
        description: "Please try again or contact support",
        duration: 5000,
      })
    } finally {
      setSigning(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "SIGNED":
        return { 
          color: "bg-green-500/20 text-green-400 border-green-500/50",
          icon: CheckCircle,
          label: "Signed"
        }
      case "VIEWED":
        return { 
          color: "bg-purple-500/20 text-purple-400 border-purple-500/50",
          icon: FileText,
          label: "Viewed"
        }
      case "SENT":
        return { 
          color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
          icon: Clock,
          label: "Pending Review"
        }
      case "EXPIRED":
        return { 
          color: "bg-red-500/20 text-red-400 border-red-500/50",
          icon: AlertTriangle,
          label: "Expired"
        }
      default:
        return { 
          color: "bg-gray-500/20 text-gray-400 border-gray-500/50",
          icon: FileText,
          label: status
        }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
          <p className="text-gray-400">Loading contract...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-white mb-2">Unable to Load Contract</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Return Home
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  if (!contract) {
    return null
  }

  const statusInfo = getStatusInfo(contract.status)
  const StatusIcon = statusInfo.icon

  return (
    <main className="min-h-screen bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Contract Header */}
          <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileSignature className="w-8 h-8 text-orange-500" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">{contract.title}</h1>
                    <p className="text-gray-400">{contract.contractNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                  <span className="text-gray-400 text-sm">
                    Project: {contract.project.name}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-3xl font-bold text-orange-500">
                  {formatCurrency(contract.totalAmount)}
                </p>
                {contract.validUntil && (
                  <p className="text-gray-500 text-sm mt-1">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Valid until {new Date(contract.validUntil).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-700">
              <Button 
                variant="outline" 
                className="bg-gray-700 border-gray-600"
                onClick={() => {
                  // Open print dialog for PDF saving
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(contract.content)
                    printWindow.document.close()
                    printWindow.focus()
                    setTimeout(() => {
                      printWindow.print()
                    }, 250)
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {contract.status !== "SIGNED" && contract.status !== "EXPIRED" && (
                <Button 
                  onClick={() => setIsSignDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign Contract
                </Button>
              )}
              {contract.signedByClient && (
                <div className="flex items-center gap-2 text-green-400 ml-auto">
                  <CheckCircle className="w-5 h-5" />
                  <span>Signed by {contract.signedByClient} on {new Date(contract.signedAt!).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Contract Content - Use iframe for proper HTML rendering */}
          <Card className="bg-white border-gray-200 p-0 overflow-hidden">
            <iframe
              srcDoc={contract.content}
              className="w-full border-0"
              style={{ 
                minHeight: '800px',
                height: 'auto',
                background: 'white'
              }}
              title="Contract Document"
              onLoad={(e) => {
                // Auto-resize iframe to fit content
                const iframe = e.target as HTMLIFrameElement
                if (iframe.contentDocument) {
                  const height = iframe.contentDocument.body.scrollHeight
                  iframe.style.height = `${height + 50}px`
                }
              }}
            />
          </Card>

          {/* Footer Actions */}
          {contract.status !== "SIGNED" && contract.status !== "EXPIRED" && (
            <Card className="bg-gray-800 border-gray-700 p-6 mt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Ready to proceed?</h3>
                  <p className="text-gray-400">Review the terms above and sign to accept this agreement.</p>
                </div>
                <Button 
                  onClick={() => setIsSignDialogOpen(true)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileSignature className="w-5 h-5 mr-2" />
                  Sign Contract
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Sign Dialog */}
      <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Sign Contract</DialogTitle>
            <DialogDescription className="text-gray-400">
              By signing this contract, you agree to all terms and conditions outlined in the agreement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="signature" className="text-white font-medium">
                Your Full Legal Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="signature"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {signatureName.trim().length > 0 && signatureName.trim().length < 2 && (
                <p className="text-xs text-red-400">Name must be at least 2 characters</p>
              )}
            </div>

            <div className="pt-2">
              <label 
                htmlFor="terms-checkbox" 
                className="flex items-start gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-900 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800 cursor-pointer"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I have read and agree to all terms and conditions in this contract. 
                  I understand that this electronic signature is legally binding.
                </span>
              </label>
            </div>

            {/* Status indicator */}
            {!agreedToTerms && signatureName.trim().length >= 2 && (
              <p className="text-xs text-yellow-400 flex items-center gap-1">
                ⚠️ Please check the box above to agree to the terms
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSignDialogOpen(false)}
              className="bg-gray-700 border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSign}
              disabled={signing || !signatureName.trim() || signatureName.trim().length < 2 || !agreedToTerms}
              className={`${
                signing || !signatureName.trim() || signatureName.trim().length < 2 || !agreedToTerms
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {signing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign Contract
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}

