import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst()
    if (existingUser) {
      return NextResponse.json(
        { message: "Database already seeded" },
        { status: 400 }
      )
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin",
      },
    })

    // Create sample profile
    await prisma.profile.create({
      data: {
        name: "Jane Doe",
        title: "Senior HR Professional",
        summary: "Experienced HR professional with 10+ years in talent acquisition and organizational development",
        bio: "Passionate about building inclusive workplaces and developing strategic HR initiatives that drive business success.",
        email: "jane.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        linkedin: "https://linkedin.com/in/janedoe",
      },
    })

    // Create sample job history
    await prisma.jobHistory.createMany({
      data: [
        {
          company: "Tech Corp",
          position: "Senior HR Manager",
          startDate: new Date("2020-01-01"),
          current: true,
          description: "Leading HR operations for a team of 500+ employees",
          order: 0,
        },
        {
          company: "StartupXYZ",
          position: "HR Business Partner",
          startDate: new Date("2017-06-01"),
          endDate: new Date("2019-12-31"),
          current: false,
          description: "Managed recruitment and employee relations",
          order: 1,
        },
      ],
    })

    // Create sample certifications
    await prisma.certification.createMany({
      data: [
        {
          name: "SHRM-SCP",
          issuer: "Society for Human Resource Management",
          issueDate: new Date("2019-05-01"),
          description: "Senior Certified Professional",
          order: 0,
        },
        {
          name: "PHR",
          issuer: "HR Certification Institute",
          issueDate: new Date("2016-03-01"),
          description: "Professional in Human Resources",
          order: 1,
        },
      ],
    })

    return NextResponse.json({
      message: "Database seeded successfully",
      credentials: {
        email: "admin@example.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    )
  }
}
