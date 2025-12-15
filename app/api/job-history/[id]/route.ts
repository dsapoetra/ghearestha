import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const data = await request.json()
    const job = await prisma.jobHistory.update({
      where: { id },
      data,
    })

    // Revalidate the homepage to show updated job history
    revalidatePath('/')
    revalidatePath('/admin/job-history')

    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update job history" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.jobHistory.delete({
      where: { id },
    })

    // Revalidate the homepage to show updated job history
    revalidatePath('/')
    revalidatePath('/admin/job-history')

    return NextResponse.json({ message: "Job history deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete job history" },
      { status: 500 }
    )
  }
}
