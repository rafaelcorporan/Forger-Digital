/**
 * Search Index Management API
 * Handles indexing and re-indexing of searchable content
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serviceData } from "@/lib/serviceData"
import { teamMembers } from "@/lib/teamData"
import { projects } from "@/components/playbook-content"

/**
 * Index all searchable content
 */
export async function POST(request: NextRequest) {
  try {
    // Clear existing index
    await prisma.searchIndex.deleteMany({})

    const indexed: string[] = []

    // Index Services
    for (const service of serviceData) {
      await prisma.searchIndex.create({
        data: {
          contentType: "service",
          contentId: service.slug,
          title: service.title,
          description: service.description,
          content: [
            service.title,
            service.description,
            service.detailedContent,
            ...service.technologies,
            ...service.benefits,
            ...service.useCases,
            service.category,
          ].join(" "),
          url: `/services/${service.slug}`,
          tags: [service.category, ...service.technologies],
          metadata: {
            technologies: service.technologies,
            benefits: service.benefits,
            useCases: service.useCases,
            category: service.category,
          },
        },
      })
      indexed.push(`service:${service.slug}`)
    }

    // Index Projects
    for (const project of projects) {
      await prisma.searchIndex.create({
        data: {
          contentType: "project",
          contentId: project.id,
          title: project.title,
          description: project.description,
          content: [
            project.title,
            project.subtitle,
            project.description,
            project.category,
            ...project.technologies,
          ].join(" "),
          url: `/portfolio#${project.id}`,
          tags: [project.category, ...project.technologies],
          metadata: {
            category: project.category,
            technologies: project.technologies,
            subtitle: project.subtitle,
          },
        },
      })
      indexed.push(`project:${project.id}`)
    }

    // Index Team Members
    for (const member of teamMembers) {
      const searchableContent = [
        member.name,
        member.title || "",
        member.resume,
        member.profile,
        ...(member.roleTags || []),
        ...(member.skills || []),
        ...(member.serviceAlignment || []),
        member.accordionContent,
        ...(member.hobbies || []),
      ].join(" ")

      await prisma.searchIndex.create({
        data: {
          contentType: "team",
          contentId: member.id,
          title: member.name,
          description: member.title || member.roleTags?.join(", ") || "",
          content: searchableContent,
          url: `/team#${member.id}`,
          tags: [
            ...(member.roleTags || []),
            ...(member.skills || []),
            ...(member.serviceAlignment || []),
          ],
          metadata: {
            roleTags: member.roleTags,
            skills: member.skills,
            serviceAlignment: member.serviceAlignment,
            title: member.title,
          },
        },
      })
      indexed.push(`team:${member.id}`)
    }

    // Index Legal Pages
    const legalPages = [
      {
        id: "privacy-policy",
        title: "Privacy Policy",
        url: "/legal/privacy-policy",
        contentType: "page",
      },
      {
        id: "terms-of-service",
        title: "Terms of Service",
        url: "/legal/terms-of-service",
        contentType: "page",
      },
      {
        id: "security",
        title: "Security Policy",
        url: "/legal/security",
        contentType: "page",
      },
      {
        id: "compliance",
        title: "Compliance",
        url: "/legal/compliance",
        contentType: "page",
      },
    ]

    for (const page of legalPages) {
      await prisma.searchIndex.create({
        data: {
          contentType: "page",
          contentId: page.id,
          title: page.title,
          description: `${page.title} - Legal information and policies`,
          content: page.title,
          url: page.url,
          tags: ["legal", "policy"],
          metadata: {},
        },
      })
      indexed.push(`page:${page.id}`)
    }

    // Index Main Pages
    const mainPages = [
      { id: "home", title: "Home", url: "/", tags: ["home", "main"] },
      { id: "about", title: "About", url: "/#about", tags: ["about", "company"] },
      { id: "services", title: "Services", url: "/#services", tags: ["services"] },
      { id: "portfolio", title: "Portfolio", url: "/portfolio", tags: ["portfolio", "projects"] },
      { id: "team", title: "Team", url: "/team", tags: ["team", "staff"] },
      { id: "careers", title: "Careers", url: "/careers", tags: ["careers", "jobs"] },
      { id: "contact", title: "Contact", url: "/#contact", tags: ["contact"] },
      { id: "get-started", title: "Get Started", url: "/get-started", tags: ["get-started"] },
    ]

    for (const page of mainPages) {
      await prisma.searchIndex.create({
        data: {
          contentType: "page",
          contentId: page.id,
          title: page.title,
          description: `Navigate to ${page.title} page`,
          content: page.title,
          url: page.url,
          tags: page.tags,
          metadata: {},
        },
      })
      indexed.push(`page:${page.id}`)
    }

    return NextResponse.json({
      success: true,
      indexed: indexed.length,
      items: indexed,
      message: `Successfully indexed ${indexed.length} items`,
    })
  } catch (error: any) {
    console.error("Indexing error:", error)
    return NextResponse.json(
      {
        error: "Indexing failed",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * Get index statistics
 */
export async function GET() {
  try {
    const stats = await prisma.searchIndex.groupBy({
      by: ["contentType"],
      _count: {
        id: true,
      },
    })

    return NextResponse.json({
      stats: stats.map((s) => ({
        type: s.contentType,
        count: s._count.id,
      })),
      total: await prisma.searchIndex.count(),
    })
  } catch (error: any) {
    console.error("Stats error:", error)
    return NextResponse.json(
      {
        error: "Failed to get stats",
        message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

