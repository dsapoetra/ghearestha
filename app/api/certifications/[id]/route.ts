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
    const certification = await prisma.certification.update({
      where: { id },
      data,
    })

    // Revalidate the homepage to show updated certifications
    revalidatePath('/')
    revalidatePath('/admin/certifications')

    return NextResponse.json(certification)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update certification" },
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
    await prisma.certification.delete({
      where: { id },
    })

    // Revalidate the homepage to show updated certifications
    revalidatePath('/')
    revalidatePath('/admin/certifications')

    return NextResponse.json({ message: "Certification deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    )
  }
}
