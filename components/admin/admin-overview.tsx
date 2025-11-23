"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Mail, FileText, Activity, TrendingUp, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Stats {
  totalUsers: number
  totalContactSubmissions: number
  totalGetStartedSubmissions: number
  totalSubmissions: number
  activeSessions: number
  newUsersLast30Days: number
  newContactSubmissionsLast30Days: number
  newGetStartedSubmissionsLast30Days: number
}

interface RecentData {
  users: Array<{
    id: string
    name: string | null
    email: string
    role: string
    createdAt: string
  }>
  submissions: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
  }>
}

export function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      const data = await response.json()
      setStats(data.stats)
      setRecent(data.recent)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-gray-800 border-gray-700 p-6">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-red-700 p-6">
        <p className="text-red-400">Error loading statistics: {error}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                +{stats?.newUsersLast30Days || 0} in last 30 days
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Form Submissions</p>
              <p className="text-3xl font-bold text-white">{stats?.totalSubmissions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totalContactSubmissions || 0} contact, {stats?.totalGetStartedSubmissions || 0} get started
              </p>
            </div>
            <Mail className="w-12 h-12 text-pink-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Sessions</p>
              <p className="text-3xl font-bold text-white">{stats?.activeSessions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Currently logged in</p>
            </div>
            <Activity className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Contact Forms</p>
              <p className="text-3xl font-bold text-white">{stats?.totalContactSubmissions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                +{stats?.newContactSubmissionsLast30Days || 0} in last 30 days
              </p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Get Started Forms</p>
              <p className="text-3xl font-bold text-white">{stats?.totalGetStartedSubmissions || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                +{stats?.newGetStartedSubmissionsLast30Days || 0} in last 30 days
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">New Users (30d)</p>
              <p className="text-3xl font-bold text-white">{stats?.newUsersLast30Days || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Growth rate</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recent?.users && recent.users.length > 0 ? (
              recent.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
                >
                  <div>
                    <p className="text-white font-medium">
                      {user.name || "No name"}
                    </p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent users</p>
            )}
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {recent?.submissions && recent.submissions.length > 0 ? (
              recent.submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
                >
                  <div>
                    <p className="text-white font-medium">
                      {submission.firstName} {submission.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{submission.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No recent submissions</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

