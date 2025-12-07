"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialId: string | null
  credentialUrl: string | null
  description: string
  order: number
}

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchCertifications()
  }, [])

  async function fetchCertifications() {
    try {
      const res = await fetch("/api/certifications")
      if (res.ok) {
        const data = await res.json()
        setCertifications(data)
      }
    } catch (error) {
      console.error("Failed to fetch certifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      issueDate: new Date(formData.get("issueDate") as string).toISOString(),
      expiryDate: formData.get("expiryDate")
        ? new Date(formData.get("expiryDate") as string).toISOString()
        : null,
      credentialId: formData.get("credentialId") as string || null,
      credentialUrl: formData.get("credentialUrl") as string || null,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string) || 0,
    }

    try {
      const url = editingCert
        ? `/api/certifications/${editingCert.id}`
        : "/api/certifications"
      const method = editingCert ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        fetchCertifications()
        setShowForm(false)
        setEditingCert(null)
      }
    } catch (error) {
      console.error("Failed to save certification:", error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return
    }

    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        fetchCertifications()
      }
    } catch (error) {
      console.error("Failed to delete certification:", error)
    }
  }

  function handleEdit(cert: Certification) {
    setEditingCert(cert)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingCert(null)
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
          <h1 className="text-3xl font-bold text-gray-900">Certifications</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Add Certification
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCert ? "Edit Certification" : "Add New Certification"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingCert?.name}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    defaultValue={editingCert?.issuer}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    name="issueDate"
                    defaultValue={
                      editingCert?.issueDate
                        ? new Date(editingCert.issueDate).toISOString().split("T")[0]
                        : ""
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={
                      editingCert?.expiryDate
                        ? new Date(editingCert.expiryDate).toISOString().split("T")[0]
                        : ""
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingCert?.order || 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    name="credentialId"
                    defaultValue={editingCert?.credentialId || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    name="credentialUrl"
                    defaultValue={editingCert?.credentialUrl || ""}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingCert?.description}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingCert ? "Update" : "Add"} Certification
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
        ) : certifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No certifications added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cert)}
                      className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-blue-600 mb-2">{cert.issuer}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </p>
                {cert.expiryDate && (
                  <p className="text-sm text-gray-500 mb-2">
                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
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
        )}
      </div>
    </div>
  )
}
