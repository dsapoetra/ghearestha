import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ContactForm from "@/components/ContactForm"

async function getProfile() {
  try {
    const profile = await prisma.profile.findFirst()
    return profile
  } catch (error) {
    return null
  }
}

async function getJobHistory() {
  try {
    const jobs = await prisma.jobHistory.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    })
    return jobs
  } catch (error) {
    return []
  }
}

async function getCertifications() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
    })
    return certifications
  } catch (error) {
    return []
  }
}

async function getRecentBlogPosts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blog/medium-rss`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      return []
    }

    const posts = await response.json()
    // Return only the first 3 posts
    return Array.isArray(posts) ? posts.slice(0, 3) : []
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const [profile, jobs, certifications, recentPosts] = await Promise.all([
    getProfile(),
    getJobHistory(),
    getCertifications(),
    getRecentBlogPosts(),
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {profile?.name || "Professional Name"}
              </h1>
              <h2 className="text-xl sm:text-2xl text-gray-700 mb-6">
                {profile?.title || "Professional Title"}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {profile?.summary || "Professional summary"}
              </p>
              <div className="flex flex-wrap gap-4">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    Contact Me
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              {profile?.profileImage ? (
                <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-xl">
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-xl flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {profile?.name?.charAt(0) || "P"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {profile?.bio && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        </section>
      )}

      {/* Job History Section */}
      {jobs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {job.position}
                  </h3>
                  <p className="text-lg text-blue-600 mb-2">{job.company}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(job.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {job.current
                      ? "Present"
                      : job.endDate
                      ? new Date(job.endDate).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Present"}
                  </p>
                  {job.description && (
                    <p className="text-gray-700">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-blue-600 mb-2">{cert.issuer}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Issued:{" "}
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  {cert.expiryDate && (
                    <p className="text-sm text-gray-500 mb-2">
                      Expires:{" "}
                      {new Date(cert.expiryDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {cert.description && (
                    <p className="text-gray-700 text-sm mt-2">{cert.description}</p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                    >
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts Section - From Medium RSS */}
      {recentPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post: any) => (
                <a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  {post.thumbnail && (
                    <div className="mb-4 w-full h-40 relative overflow-hidden rounded">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.pubDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Get In Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {profile?.name || "Professional Name"}. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
