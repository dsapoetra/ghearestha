import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button
                type="submit"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Edit Profile
            </h2>
            <p className="text-gray-600">
              Update your profile information, photo, and contact details
            </p>
          </Link>

          <Link
            href="/admin/job-history"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Job History
            </h2>
            <p className="text-gray-600">
              Manage your professional experience and work history
            </p>
          </Link>

          <Link
            href="/admin/certifications"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Certifications
            </h2>
            <p className="text-gray-600">
              Add or edit your professional certifications
            </p>
          </Link>

          <Link
            href="/admin/blog"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Blog Posts
            </h2>
            <p className="text-gray-600">
              Create, edit, and manage your blog articles
            </p>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 hover:border-blue-300 transition"
          >
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              View Website
            </h2>
            <p className="text-blue-700">
              Preview your public website in a new tab
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
