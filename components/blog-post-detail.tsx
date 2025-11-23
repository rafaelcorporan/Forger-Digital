"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, User, Clock, Eye, MessageSquare, ArrowLeft, Send } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { ArticleSchema } from "@/components/seo-schema"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  publishedAt: string | null
  readingTime: number | null
  views: number
  author: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  comments: Array<{
    id: string
    content: string
    authorName: string
    authorEmail: string
    createdAt: string
    author: {
      id: string
      name: string | null
      image: string | null
    } | null
    replies: Array<{
      id: string
      content: string
      authorName: string
      createdAt: string
      author: {
        id: string
        name: string | null
        image: string | null
      } | null
    }>
  }>
  _count: {
    comments: number
  }
}

interface BlogPostDetailProps {
  slug: string
}

export function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${slug}`)
      const result = await response.json()

      if (result.success) {
        setPost(result.data)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!post) return

    if (!session && (!authorName || !authorEmail)) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    if (!commentContent.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: commentContent,
          authorName: session?.user?.name || authorName,
          authorEmail: session?.user?.email || authorEmail,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Comment submitted successfully",
        })
        setCommentContent("")
        setAuthorName("")
        setAuthorEmail("")
        fetchPost() // Refresh comments
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forgerdigital.com"

  return (
    <>
      <ArticleSchema
        headline={post.title}
        description={post.excerpt || post.content.substring(0, 200)}
        image={post.featuredImage || `${baseUrl}/og-image.jpg`}
        datePublished={post.publishedAt || new Date().toISOString()}
        author={post.author.name || post.author.email}
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <article>
          {post.category && (
            <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">
              {post.category.name}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-400 mb-8">{post.excerpt}</p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-700">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author.name || post.author.email.split("@")[0]}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.readingTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
            )}
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {post.views} views
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {post._count.comments} comments
            </span>
          </div>

          {post.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12 pt-12 border-t border-gray-700">
            <h2 className="text-2xl font-bold mb-6">
              Comments ({post._count.comments})
            </h2>

            {/* Comment Form */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  {!session && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={authorEmail}
                          onChange={(e) => setAuthorEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Comment</Label>
                    <Textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Comment"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <Card key={comment.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">
                            {comment.author?.name || comment.authorName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{comment.content}</p>
                        {comment.replies.length > 0 && (
                          <div className="ml-4 space-y-4 border-l-2 border-gray-700 pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                  <User className="w-4 h-4 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-white">
                                      {reply.author?.name || reply.authorName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {post.comments.length === 0 && (
                <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

