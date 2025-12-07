"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch("/api/blog?includeUnpublished=true")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link
            href="/admin/blog/new"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            New Post
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No blog posts yet</p>
            <Link
              href="/admin/blog/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
