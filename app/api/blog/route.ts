import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const includeUnpublished = searchParams.get("includeUnpublished") === "true"

  try {
    const session = await auth()
    const where = includeUnpublished && session ? {} : { published: true }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const post = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
