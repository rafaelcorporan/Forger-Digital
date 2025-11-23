/**
 * RSS Feed Generator
 * Generates RSS 2.0 feed for blog posts
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

export async function GET() {
  try {
    // Fetch published posts
    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 20, // Latest 20 posts
    })

    // Generate RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Forger Digital Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Insights, updates, and articles about software development, digital transformation, and technology trends.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Forger Digital Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${posts
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.content.substring(0, 200)}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <author>${post.author.email} (${post.author.name || post.author.email})</author>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ""}
    </item>`
      )
      .join("\n")}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error: any) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate RSS feed",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

