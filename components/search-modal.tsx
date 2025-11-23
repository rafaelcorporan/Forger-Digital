"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, FileText, Users, Briefcase, Globe, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SearchResult {
  id: string
  type: string
  contentId: string
  title: string
  description: string | null
  url: string
  tags: string[]
  metadata: any
  relevance?: number
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeIcons: Record<string, any> = {
  service: Sparkles,
  project: Briefcase,
  team: Users,
  page: FileText,
  story: FileText,
}

const typeColors: Record<string, string> = {
  service: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  project: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  team: "bg-green-500/20 text-green-400 border-green-500/30",
  page: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  story: "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, selectedType])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: "20",
      })
      if (selectedType) {
        params.append("type", selectedType)
      }

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (data.results) {
        setResults(data.results)
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = () => {
    setQuery("")
    setResults([])
    onOpenChange(false)
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0 bg-gray-900 border-gray-800">
        <DialogTitle className="sr-only">Search</DialogTitle>
        {/* Search Input */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search services, projects, team members..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-orange-500"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("")
                  setResults([])
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedType === null
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              All
            </button>
            {["service", "project", "team", "page"].map((type) => {
              const Icon = typeIcons[type]
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors flex items-center gap-1.5 ${
                    selectedType === type
                      ? typeColors[type]
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-800/50 animate-pulse">
                  <div className="h-12 w-12 rounded-lg bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-700 rounded" />
                    <div className="h-4 w-1/2 bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords or check your spelling</p>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start typing to search...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedResults).map(([type, typeResults]) => {
                const Icon = typeIcons[type]
                return (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                        {type} ({typeResults.length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {typeResults.map((result) => (
                        <Link
                          key={result.id}
                          href={result.url}
                          onClick={handleResultClick}
                          className="block p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-orange-500/50 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white group-hover:text-orange-500 transition-colors truncate">
                                  {result.title}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${typeColors[result.type] || "bg-gray-700/50 text-gray-300 border-gray-600"}`}
                                >
                                  {result.type}
                                </Badge>
                              </div>
                              {result.description && (
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {result.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 rounded bg-gray-700/50 text-gray-400"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">Esc</kbd> to close
        </div>
      </DialogContent>
    </Dialog>
  )
}

