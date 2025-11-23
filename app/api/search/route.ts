/**
 * Search API Endpoint
 * Provides full-text search across all site content
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Search across all indexed content
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const contentType = searchParams.get("type") || undefined
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: query,
        message: "Query must be at least 2 characters",
      })
    }

    // Build search conditions
    const whereClause: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    }

    // Add content type filter if specified
    if (contentType) {
      whereClause.contentType = contentType
    }

    // Execute search
    const [results, totalCount] = await Promise.all([
      prisma.searchIndex.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: [
          { title: "asc" },
        ],
      }),
      prisma.searchIndex.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      results: results.map((r) => ({
        id: r.id,
        type: r.contentType,
        contentId: r.contentId,
        title: r.title,
        description: r.description,
        url: r.url,
        tags: r.tags,
        metadata: r.metadata,
      })),
      total: totalCount,
      query: query,
      limit: limit,
      offset: offset,
    })
  } catch (error: any) {
    console.error("Search error:", error)
    return NextResponse.json(
      {
        error: "Search failed",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
