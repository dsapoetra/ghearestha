import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface MediumPost {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail?: string
  categories: string[]
}

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    })
    return posts
  } catch (error) {
    return []
  }
}

async function getMediumPosts(): Promise<MediumPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/blog/medium-rss`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.posts || data
  } catch (error) {
    console.error("Error fetching Medium posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const [posts, mediumPosts] = await Promise.all([
    getBlogPosts(),
    getMediumPosts(),
  ])

  const hasAnyPosts = posts.length > 0 || mediumPosts.length > 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Articles & Insights
          </h1>
          <p className="text-lg text-gray-600">
            Thoughts and insights on HR, leadership, and organizational development
          </p>
        </div>

        {!hasAnyPosts ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts published yet.</p>
          </div>
        ) : (
          <>
            {/* Database Posts */}
            {posts.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {post.coverImage && (
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <p className="text-sm text-gray-500">
                          {post.publishedAt &&
                            new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Medium Posts */}
            {mediumPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  From Medium
                  <span className="ml-3 text-sm font-normal text-gray-500">
                    (External posts)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mediumPosts.map((post, index) => (
                    <a
                      key={index}
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {post.thumbnail && (
                        <div className="aspect-video bg-gray-200 overflow-hidden">
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition flex-1">
                            {post.title}
                          </h3>
                          <svg
                            className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-4">{post.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.pubDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        {post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.categories.slice(0, 3).map((category, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
