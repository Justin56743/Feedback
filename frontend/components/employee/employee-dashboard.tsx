"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import { ComplaintForm } from "./complaint-form"
import { api } from "@/lib/api"

interface EmployeeDashboardProps {
  currentUser: any
}

type Complaint = {
  id: number
  category: string
  description: string
  status: string
  createdAt: string
  updatedAt?: string
  remarks?: string
  department?: string
  user?: { username: string }
}

export function EmployeeDashboard({ currentUser }: EmployeeDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null)

  useEffect(() => {
    loadComplaints()
  }, [currentUser])

  const loadComplaints = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await api.getFeedbacks(token)
      setComplaints(res.data)
    } catch (err) {
      setComplaints([])
    }
  }

  const handleComplaintSubmit = async (complaintData: any) => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      if (editingComplaint) {
        await api.editFeedback(editingComplaint.id, {
          category: complaintData.category,
          description: complaintData.description
        }, token)
      } else {
        await api.createFeedback({
          category: complaintData.category,
          description: complaintData.description
        }, token)
      }
      await loadComplaints()
      setShowForm(false)
      setEditingComplaint(null)
    } catch (err) {
      // handle error
    }
  }

  const handleEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint)
    setShowForm(true)
  }

  const handleDelete = async (complaintId: number) => {
    const token = localStorage.getItem("token")
    if (!token) return
    if (confirm("Are you sure you want to delete this complaint?")) {
      try {
        await api.deleteFeedback(complaintId, token)
        await loadComplaints()
      } catch (err) {
        // handle error
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
      case "Open":
        return <Clock className="h-4 w-4" />
      case "in-progress":
      case "In Progress":
        return <FileText className="h-4 w-4" />
      case "resolved":
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
      case "Rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
      case "Open":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (showForm) {
    return (
      <ComplaintForm
        complaint={editingComplaint}
        onSubmit={handleComplaintSubmit}
        onCancel={() => {
          setShowForm(false)
          setEditingComplaint(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Complaints & Feedback</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No complaints submitted yet.</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                Submit Your First Complaint
              </Button>
            </CardContent>
          </Card>
        ) : (
          complaints.map((complaint: Complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{complaint.category}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(complaint.status)}>
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{complaint.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{complaint.description}</p>

                {complaint.remarks && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-900">Admin Remarks:</p>
                    <p className="text-sm text-blue-800">{complaint.remarks}</p>
                  </div>
                )}

                {complaint.department && (
                  <p className="text-sm text-gray-600 mb-4">
                    Assigned to: <span className="font-medium">{complaint.department}</span>
                  </p>
                )}

                {complaint.status === "open" && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(complaint)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(complaint.id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
