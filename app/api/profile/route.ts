import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
    })
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Get the first profile or create one if none exists
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data,
      })
    } else {
      profile = await prisma.profile.create({
        data,
      })
    }

    // Revalidate the homepage to show updated profile data
    revalidatePath('/')
    revalidatePath('/admin/profile')

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
