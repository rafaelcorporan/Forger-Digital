"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, Mail, Activity } from "lucide-react"

interface AnalyticsData {
  stats: {
    totalUsers: number
    totalContactSubmissions: number
    totalGetStartedSubmissions: number
    newUsersLast30Days: number
    newContactSubmissionsLast30Days: number
    newGetStartedSubmissionsLast30Days: number
  }
}

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-2))",
  },
  contact: {
    label: "Contact Forms",
    color: "hsl(var(--chart-3))",
  },
  getStarted: {
    label: "Get Started Forms",
    color: "hsl(var(--chart-4))",
  },
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const result = await response.json()
      setData({ stats: result.stats })
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 p-6">
              <Skeleton className="h-64 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-red-700 p-6">
        <p className="text-red-400">Error loading analytics: {error}</p>
      </Card>
    )
  }

  // Prepare chart data
  const submissionData = [
    {
      name: "Contact Forms",
      value: data?.stats.totalContactSubmissions || 0,
      last30Days: data?.stats.newContactSubmissionsLast30Days || 0,
    },
    {
      name: "Get Started",
      value: data?.stats.totalGetStartedSubmissions || 0,
      last30Days: data?.stats.newGetStartedSubmissionsLast30Days || 0,
    },
  ]

  const growthData = [
    {
      name: "Users",
      total: data?.stats.totalUsers || 0,
      last30Days: data?.stats.newUsersLast30Days || 0,
    },
    {
      name: "Submissions",
      total: (data?.stats.totalContactSubmissions || 0) + (data?.stats.totalGetStartedSubmissions || 0),
      last30Days: (data?.stats.newContactSubmissionsLast30Days || 0) + (data?.stats.newGetStartedSubmissionsLast30Days || 0),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{data?.stats.totalUsers || 0}</p>
              <p className="text-xs text-green-400 mt-1">
                +{data?.stats.newUsersLast30Days || 0} (30d)
              </p>
            </div>
            <Users className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-white">
                {(data?.stats.totalContactSubmissions || 0) + (data?.stats.totalGetStartedSubmissions || 0)}
              </p>
              <p className="text-xs text-green-400 mt-1">
                +{(data?.stats.newContactSubmissionsLast30Days || 0) + (data?.stats.newGetStartedSubmissionsLast30Days || 0)} (30d)
              </p>
            </div>
            <Mail className="w-10 h-10 text-pink-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Contact Forms</p>
              <p className="text-3xl font-bold text-white">{data?.stats.totalContactSubmissions || 0}</p>
              <p className="text-xs text-green-400 mt-1">
                +{data?.stats.newContactSubmissionsLast30Days || 0} (30d)
              </p>
            </div>
            <Activity className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Get Started Forms</p>
              <p className="text-3xl font-bold text-white">{data?.stats.totalGetStartedSubmissions || 0}</p>
              <p className="text-xs text-green-400 mt-1">
                +{data?.stats.newGetStartedSubmissionsLast30Days || 0} (30d)
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Submission Types</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Growth Overview</h3>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="total" stroke="#F97316" strokeWidth={2} />
                <Line type="monotone" dataKey="last30Days" stroke="#EC4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">30-Day Growth Metrics</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">New Users</p>
            <p className="text-2xl font-bold text-white">{data?.stats.newUsersLast30Days || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">New Contact Forms</p>
            <p className="text-2xl font-bold text-white">{data?.stats.newContactSubmissionsLast30Days || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">New Get Started Forms</p>
            <p className="text-2xl font-bold text-white">{data?.stats.newGetStartedSubmissionsLast30Days || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

