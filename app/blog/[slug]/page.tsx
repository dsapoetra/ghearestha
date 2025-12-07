import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    })
    return post
  } catch (error) {
    return null
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-700 font-medium mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {post.coverImage && (
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          {post.publishedAt && (
            <time className="text-gray-600">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          )}
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}
