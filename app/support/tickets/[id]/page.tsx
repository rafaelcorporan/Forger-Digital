"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { ArrowLeft, MessageSquare, Send, Clock, User, Mail, Tag, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/context"

function TicketDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useTranslation("support")
  const ticketId = params.id as string
  const guestEmail = searchParams.get("email")

  const [ticket, setTicket] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        let url = `/api/support/tickets/${ticketId}`
        if (guestEmail) {
          url += `?email=${encodeURIComponent(guestEmail)}`
        }

        const response = await fetch(url, {
          credentials: "include",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to fetch ticket")
        }

        const data = await response.json()
        setTicket(data.ticket)
        setReplies(data.ticket.replies || [])
      } catch (err: any) {
        setError(err.message || "Failed to load ticket")
      } finally {
        setLoading(false)
      }
    }

    if (ticketId) {
      fetchTicket()
    }
  }, [ticketId, guestEmail])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setSubmitting(true)
    setError("")

    try {
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
          // Continue without CSRF for guest users
        }
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken
      }

      const body: any = { message: replyMessage }
      if (guestEmail) {
        body.email = guestEmail
      }

      const response = await fetch(`/api/support/tickets/${ticketId}/replies`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reply")
      }

      setReplyMessage("")
      // Refresh ticket and replies
      const ticketResponse = await fetch(`/api/support/tickets/${ticketId}${guestEmail ? `?email=${encodeURIComponent(guestEmail)}` : ""}`, {
        credentials: "include",
      })
      if (ticketResponse.ok) {
        const ticketData = await ticketResponse.json()
        setTicket(ticketData.ticket)
        setReplies(ticketData.ticket.replies || [])
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reply")
    } finally {
      setSubmitting(false)
    }
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

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-gray-400">Loading ticket...</div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{error || "Ticket not found"}</h3>
                <Button
                  onClick={() => router.push("/support")}
                  className="bg-orange-500 hover:bg-orange-600 text-white mt-4"
                >
                  {t("ticketDetail.backToSupport")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link href="/support">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("ticketDetail.backToSupport")}
            </Button>
          </Link>

          {/* Ticket Header */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <CardTitle className="text-white text-2xl">{ticket.subject}</CardTitle>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <CardDescription className="text-gray-400">
                    {t("ticketDetail.ticketId")}: {ticket.id}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Tag className="w-4 h-4" />
                  <span>{t(`ticketDetail.categories.${ticket.category.toLowerCase()}`)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{t("ticketDetail.created")}: {new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{t("ticketDetail.resolved")}: {new Date(ticket.resolvedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Description */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">{t("ticketDetail.description")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">
                {t("ticketDetail.replies")} ({replies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.isInternal
                        ? "bg-yellow-900/20 border border-yellow-700/50"
                        : "bg-gray-900/50 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {reply.userId ? (
                          <>
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-white">
                              {reply.user?.name || reply.user?.email || t("ticketDetail.supportTeam")}
                            </span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-white">
                              {reply.email || ticket.email}
                            </span>
                          </>
                        )}
                        {reply.isInternal && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                            {t("ticketDetail.internal")}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}

                {replies.length === 0 && (
                  <p className="text-gray-400 text-center py-8">{t("ticketDetail.noReplies")}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reply Form */}
          {(ticket.status === "OPEN" || ticket.status === "IN_PROGRESS" || ticket.status === "WAITING_CUSTOMER") && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t("ticketDetail.addReply")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReply} className="space-y-4">
                  <div>
                    <Label htmlFor="reply" className="text-white">
                      {t("ticketDetail.replyMessage")}
                    </Label>
                    <Textarea
                      id="reply"
                      rows={6}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white mt-2"
                      placeholder={t("ticketDetail.replyPlaceholder")}
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting || !replyMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? t("ticketDetail.sending") : t("ticketDetail.sendReply")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function TicketDetailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center text-gray-400">Loading...</div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <TicketDetailContent />
    </Suspense>
  )
}

