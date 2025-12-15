import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
    })
    return NextResponse.json(certifications)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch certifications" },
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
    const certification = await prisma.certification.create({
      data,
    })

    // Revalidate the homepage to show updated certifications
    revalidatePath('/')
    revalidatePath('/admin/certifications')

    return NextResponse.json(certification)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create certification" },
      { status: 500 }
    )
  }
}
