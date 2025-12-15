import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const jobs = await prisma.jobHistory.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    })
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job history" },
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
    const job = await prisma.jobHistory.create({
      data,
    })

    // Revalidate the homepage to show updated job history
    revalidatePath('/')
    revalidatePath('/admin/job-history')

    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job history" },
      { status: 500 }
    )
  }
}
