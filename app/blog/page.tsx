import Link from "next/link"
import { prisma } from "@/lib/prisma"

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

export default async function BlogPage() {
  const posts = await getBlogPosts()

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

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts published yet.</p>
          </div>
        ) : (
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>
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
        )}
      </div>
    </div>
  )
}
