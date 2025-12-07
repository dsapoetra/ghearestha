import { NextRequest, NextResponse } from "next/server"
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
    return NextResponse.json({ message: "Certification deleted" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete certification" },
      { status: 500 }
    )
  }
}
