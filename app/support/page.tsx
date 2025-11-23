"use client"

import { useState, useEffect, Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { HelpCircle, MessageSquare, FileText, Search, Plus, Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"

function SupportPageContent() {
  const { t } = useTranslation("support")
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("faq")

  // Read tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "create" || tab === "tickets" || tab === "faq") {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors cursor-pointer" 
              onClick={() => {
                setActiveTab("tickets")
                router.push("/support?tab=tickets", { scroll: false })
              }}
            >
              <CardHeader>
                <Ticket className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-white">{t("quickActions.viewTickets")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("quickActions.viewTicketsDescription")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors cursor-pointer" 
              onClick={() => {
                setActiveTab("create")
                router.push("/support?tab=create", { scroll: false })
              }}
            >
              <CardHeader>
                <Plus className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-white">{t("quickActions.createTicket")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("quickActions.createTicketDescription")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors cursor-pointer" 
              onClick={() => {
                setActiveTab("faq")
                router.push("/support?tab=faq", { scroll: false })
              }}
            >
              <CardHeader>
                <FileText className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle className="text-white">{t("quickActions.knowledgeBase")}</CardTitle>
                <CardDescription className="text-gray-400">
                  {t("quickActions.knowledgeBaseDescription")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              setActiveTab(value)
              router.push(`/support?tab=${value}`, { scroll: false })
            }} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 rounded-lg border border-gray-700 mb-8">
              <TabsTrigger 
                value="faq"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t("tabs.faq")}
              </TabsTrigger>
              <TabsTrigger 
                value="create"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("tabs.createTicket")}
              </TabsTrigger>
              <TabsTrigger 
                value="tickets"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Ticket className="w-4 h-4 mr-2" />
                {t("tabs.myTickets")}
              </TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="mt-8">
              <KnowledgeBaseContent />
            </TabsContent>

            {/* Create Ticket Tab */}
            <TabsContent value="create" className="mt-8">
              <CreateTicketForm />
            </TabsContent>

            {/* My Tickets Tab */}
            <TabsContent value="tickets" className="mt-8">
              <MyTicketsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </main>
  )
}

// Knowledge Base Component
function KnowledgeBaseContent() {
  const { t } = useTranslation("support")
  const [searchQuery, setSearchQuery] = useState("")

  const faqCategories = [
    {
      id: "general",
      title: t("faq.categories.general.title"),
      questions: t("faq.categories.general.questions") as Array<{ question: string; answer: string }>,
    },
    {
      id: "technical",
      title: t("faq.categories.technical.title"),
      questions: t("faq.categories.technical.questions") as Array<{ question: string; answer: string }>,
    },
    {
      id: "billing",
      title: t("faq.categories.billing.title"),
      questions: t("faq.categories.billing.questions") as Array<{ question: string; answer: string }>,
    },
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={t("faq.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {category.questions.map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.question}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">{t("faq.noResults")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Create Ticket Form Component
function CreateTicketForm() {
  const { t } = useTranslation("support")
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
    category: "GENERAL",
    priority: "MEDIUM",
  })

  // Update email when session changes
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email || "" }))
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Ensure email is set for authenticated users
      const submitData = {
        ...formData,
        email: session?.user?.email || formData.email,
      }

      // Client-side validation
      if (!submitData.email || !submitData.email.includes("@")) {
        throw new Error("Please provide a valid email address")
      }
      if (!submitData.subject || submitData.subject.trim().length < 3) {
        throw new Error("Subject must be at least 3 characters")
      }
      if (!submitData.description || submitData.description.trim().length < 10) {
        throw new Error("Description must be at least 10 characters")
      }

      // Fetch CSRF token if authenticated
      let csrfToken: string | null = null
      if (session) {
        try {
          const csrfResponse = await fetch("/api/csrf-token", {
            method: "GET",
            credentials: "include",
          })
          if (csrfResponse.ok) {
            const csrfData = await csrfResponse.json()
            csrfToken = csrfData.token
          }
        } catch (e) {
          console.error("Failed to fetch CSRF token:", e)
        }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }

      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        // Provide more detailed error message
        const errorMessage = result.error || result.message || "Failed to create ticket"
        const errorDetails = result.errors ? ` ${JSON.stringify(result.errors)}` : ""
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      setSuccess(true)
      setFormData({
        email: session?.user?.email || "",
        subject: "",
        description: "",
        category: "GENERAL",
        priority: "MEDIUM",
      })

      // Redirect to ticket view after 2 seconds
      setTimeout(() => {
        router.push(`/support/tickets/${result.ticket.id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create ticket")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{t("createTicket.success.title")}</h3>
          <p className="text-gray-400">{t("createTicket.success.message")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{t("createTicket.title")}</CardTitle>
        <CardDescription className="text-gray-400">
          {t("createTicket.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!session && (
            <div>
              <Label htmlFor="email" className="text-white">
                {t("createTicket.email")} *
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-900 border-gray-700 text-white mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="subject" className="text-white">
              {t("createTicket.subject")} *
            </Label>
            <Input
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white mt-2"
              placeholder={t("createTicket.subjectPlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-white">
              {t("createTicket.category")} *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-2 w-full">
                <SelectValue placeholder={t("createTicket.categories.general")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="GENERAL" className="text-white focus:bg-gray-700">{t("createTicket.categories.general")}</SelectItem>
                <SelectItem value="TECHNICAL" className="text-white focus:bg-gray-700">{t("createTicket.categories.technical")}</SelectItem>
                <SelectItem value="BILLING" className="text-white focus:bg-gray-700">{t("createTicket.categories.billing")}</SelectItem>
                <SelectItem value="FEATURE_REQUEST" className="text-white focus:bg-gray-700">{t("createTicket.categories.featureRequest")}</SelectItem>
                <SelectItem value="BUG_REPORT" className="text-white focus:bg-gray-700">{t("createTicket.categories.bugReport")}</SelectItem>
                <SelectItem value="ACCOUNT" className="text-white focus:bg-gray-700">{t("createTicket.categories.account")}</SelectItem>
                <SelectItem value="OTHER" className="text-white focus:bg-gray-700">{t("createTicket.categories.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority" className="text-white">
              {t("createTicket.priority")} *
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-2 w-full">
                <SelectValue placeholder={t("createTicket.priorities.medium")} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="LOW" className="text-white focus:bg-gray-700">{t("createTicket.priorities.low")}</SelectItem>
                <SelectItem value="MEDIUM" className="text-white focus:bg-gray-700">{t("createTicket.priorities.medium")}</SelectItem>
                <SelectItem value="HIGH" className="text-white focus:bg-gray-700">{t("createTicket.priorities.high")}</SelectItem>
                <SelectItem value="URGENT" className="text-white focus:bg-gray-700">{t("createTicket.priorities.urgent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              {t("createTicket.description")} *
            </Label>
            <Textarea
              id="description"
              required
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white mt-2"
              placeholder={t("createTicket.descriptionPlaceholder")}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">{error}</p>
              {error.includes("Validation failed") && (
                <p className="text-red-300 text-xs mt-2">
                  Please check all required fields and ensure they meet the minimum requirements.
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? t("createTicket.submitting") : t("createTicket.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// My Tickets List Component
function MyTicketsList() {
  const { t } = useTranslation("support")
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false)
      return
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/support/tickets", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setTickets(data.tickets || [])
        }
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchTickets()
    }
  }, [status])

  if (status === "loading" || loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">{t("tickets.loading")}</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t("tickets.loginRequired")}</h3>
          <p className="text-gray-400 mb-6">{t("tickets.loginRequiredDescription")}</p>
          <Button
            onClick={() => router.push("/auth/signin?callbackUrl=/support")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {t("tickets.signIn")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      OPEN: { label: t("tickets.status.open"), className: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
      IN_PROGRESS: { label: t("tickets.status.inProgress"), className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
      WAITING_CUSTOMER: { label: t("tickets.status.waitingCustomer"), className: "bg-orange-500/20 text-orange-400 border-orange-500/50" },
      RESOLVED: { label: t("tickets.status.resolved"), className: "bg-green-500/20 text-green-400 border-green-500/50" },
      CLOSED: { label: t("tickets.status.closed"), className: "bg-gray-500/20 text-gray-400 border-gray-500/50" },
    }
    const config = statusConfig[status] || statusConfig.OPEN
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; className: string }> = {
      LOW: { label: t("tickets.priority.low"), className: "bg-gray-500/20 text-gray-400" },
      MEDIUM: { label: t("tickets.priority.medium"), className: "bg-blue-500/20 text-blue-400" },
      HIGH: { label: t("tickets.priority.high"), className: "bg-orange-500/20 text-orange-400" },
      URGENT: { label: t("tickets.priority.urgent"), className: "bg-red-500/20 text-red-400" },
    }
    const config = priorityConfig[priority] || priorityConfig.MEDIUM
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div>
      {tickets.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="py-12 text-center">
            <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t("tickets.noTickets")}</h3>
            <p className="text-gray-400 mb-6">{t("tickets.noTicketsDescription")}</p>
            <Button
              onClick={() => router.push("/support?tab=create", { scroll: false })}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {t("tickets.createFirstTicket")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="bg-gray-800 border-gray-700 hover:border-orange-500 transition-colors cursor-pointer"
              onClick={() => router.push(`/support/tickets/${ticket.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{ticket.subject}</h3>
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                      {ticket._count?.replies > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {ticket._count.replies} {t("tickets.replies")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center text-gray-400">Loading...</div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <SupportPageContent />
    </Suspense>
  )
}

