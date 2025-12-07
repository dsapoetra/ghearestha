"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Job {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  order: number
}

export default function JobHistoryManager() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const res = await fetch("/api/job-history")
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string).toISOString()
        : null,
      current: formData.get("current") === "on",
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string) || 0,
    }

    try {
      const url = editingJob ? `/api/job-history/${editingJob.id}` : "/api/job-history"
      const method = editingJob ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        fetchJobs()
        setShowForm(false)
        setEditingJob(null)
      }
    } catch (error) {
      console.error("Failed to save job:", error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this job?")) {
      return
    }

    try {
      const res = await fetch(`/api/job-history/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchJobs()
      }
    } catch (error) {
      console.error("Failed to delete job:", error)
    }
  }

  function handleEdit(job: Job) {
    setEditingJob(job)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingJob(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job History</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Add Job
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingJob ? "Edit Job" : "Add New Job"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingJob?.company}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    defaultValue={editingJob?.position}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={
                      editingJob?.startDate
                        ? new Date(editingJob.startDate).toISOString().split("T")[0]
                        : ""
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={
                      editingJob?.endDate && !editingJob.current
                        ? new Date(editingJob.endDate).toISOString().split("T")[0]
                        : ""
                    }
                    disabled={editingJob?.current}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingJob?.order || 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="current"
                  id="current"
                  defaultChecked={editingJob?.current}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                  Current Position
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingJob?.description}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingJob ? "Update" : "Add"} Job
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No job history added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.position}
                    </h3>
                    <p className="text-blue-600 mb-2">{job.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(job.startDate).toLocaleDateString()} -{" "}
                      {job.current
                        ? "Present"
                        : job.endDate
                        ? new Date(job.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    {job.description && (
                      <p className="text-gray-700">{job.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(job)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
