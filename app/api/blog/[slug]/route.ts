import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await auth()

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Only return unpublished posts if user is authenticated
    if (!post.published && !session) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await params
    const data = await request.json()
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...data,
        publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await params
    await prisma.blogPost.delete({
      where: { slug },
    })
    return NextResponse.json({ message: "Blog post deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    )
  }
}
