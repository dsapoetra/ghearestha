"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import RichTextEditor from "@/components/RichTextEditor"
import ImageUpload from "@/components/ImageUpload"

export default function BlogPostEditor() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const isNew = slug === "new"

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  })

  useEffect(() => {
    if (!isNew) {
      fetchPost()
    }
  }, [isNew, slug])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      }
    } catch (error) {
      console.error("Failed to fetch post:", error)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Auto-generate slug from title if creating new post
    const postData = {
      ...post,
      slug: isNew && !post.slug ? generateSlug(post.title) : post.slug,
    }

    try {
      const url = isNew ? "/api/blog" : `/api/blog/${slug}`
      const method = isNew ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      if (res.ok) {
        const data = await res.json()
        setMessage({
          type: "success",
          text: `Post ${isNew ? "created" : "updated"} successfully!`,
        })
        if (isNew) {
          router.push(`/admin/blog/${data.slug}`)
        }
      } else {
        setMessage({
          type: "error",
          text: `Failed to ${isNew ? "create" : "update"} post`,
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin/blog" className="text-blue-600 hover:text-blue-700">
            ← Back to Posts
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isNew ? "Create New Post" : "Edit Post"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) =>
                    setPost({ ...post, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={post.slug}
                  onChange={(e) =>
                    setPost({ ...post, slug: e.target.value })
                  }
                  placeholder="Auto-generated from title if left empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!isNew}
                />
                {!isNew && (
                  <p className="text-sm text-gray-500 mt-1">
                    Slug cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={post.excerpt}
                  onChange={(e) =>
                    setPost({ ...post, excerpt: e.target.value })
                  }
                  rows={3}
                  placeholder="Brief summary of the post"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <ImageUpload
                currentImage={post.coverImage}
                onImageChange={(url) =>
                  setPost({ ...post, coverImage: url })
                }
                uploadEndpoint="/api/upload/cover-image"
                label="Cover Image"
                aspectRatio="wide"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <RichTextEditor
                  content={post.content}
                  onChange={(content) => setPost({ ...post, content })}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={post.published}
                  onChange={(e) =>
                    setPost({ ...post, published: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Publish this post
                </label>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-4">
            {!isNew && (
              <Link
                href={`/blog/${slug}`}
                target="_blank"
                className="bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition"
              >
                Preview
              </Link>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : isNew ? "Create Post" : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
