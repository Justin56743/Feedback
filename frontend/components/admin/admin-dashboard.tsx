"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"

interface AdminDashboardProps {
  currentUser: any
}

type Complaint = {
  id: number
  title?: string
  description: string
  status: string
  category: string
  priority?: string
  userName?: string
  userDepartment?: string
  createdAt: string
  updatedAt?: string
  adminRemarks?: string
  assignedDepartment?: string
  remarks?: string
  department?: string
  user?: { username?: string }
}

export function AdminDashboard({ currentUser }: AdminDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter, categoryFilter, searchTerm])

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

  const filterComplaints = () => {
    let filtered = complaints

    if (statusFilter !== "All") {
      filtered = filtered.filter((c: any) => c.status === statusFilter)
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((c: any) => c.category === categoryFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (c: any) =>
          (c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
      )
    }

    setFilteredComplaints(filtered)
  }

  const updateComplaintStatus = async (
    complaintId: number,
    status: string,
    remarks?: string,
    department?: string
  ) => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await api.editFeedback(complaintId, { status, remarks, department }, token)
      loadComplaints()
    } catch (err) {
      // handle error
    }
  }

  const handleRemarksUpdate = async (
    complaintId: number,
    remarks: string,
    department: string
  ) => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await api.editFeedback(complaintId, { remarks, department }, token)
      loadComplaints()
    } catch (err) {
      // handle error
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <Clock className="h-4 w-4" />
      case "In Progress":
        return <FileText className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      case "Rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStats = () => {
    const total = complaints.length
    const open = complaints.filter((c: any) => c.status === "Open").length
    const inProgress = complaints.filter((c: any) => c.status === "In Progress").length
    const resolved = complaints.filter((c: any) => c.status === "Resolved").length
    const rejected = complaints.filter((c: any) => c.status === "Rejected").length

    return { total, open, inProgress, resolved, rejected }
  }

  const stats = getStats()
  const categories = [...new Set(complaints.map((c: any) => c.category))].filter(Boolean)
  const departments = ["IT", "HR", "Finance", "Operations", "Marketing", "Engineering", "Support"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <Button onClick={loadComplaints}>Refresh</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="grid gap-4">
        {filteredComplaints.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No complaints found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint: any) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onUpdate={updateComplaintStatus}
              onRemarksUpdate={handleRemarksUpdate}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              departments={departments}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ComplaintCard({ complaint, onUpdate, onRemarksUpdate, getStatusIcon, getStatusColor, getPriorityColor, departments }: any) {
  const [remarks, setRemarks] = useState(complaint.adminRemarks || complaint.remarks || "")
  const [selectedDepartment, setSelectedDepartment] = useState(complaint.assignedDepartment || complaint.department || "")

  const handleStatusUpdate = (newStatus: string) => {
    onUpdate(complaint.id, newStatus, remarks, selectedDepartment)
  }

  const handleRemarksUpdate = () => {
    onRemarksUpdate(complaint.id, remarks, selectedDepartment)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{complaint.title}</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>By: {complaint.user?.username || complaint.userName}</span>
              <span>Dept: {complaint.userDepartment}</span>
              <span>Category: {complaint.category}</span>
              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
            <Badge className={getStatusColor(complaint.status)}>
              {getStatusIcon(complaint.status)}
              <span className="ml-1">{complaint.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{complaint.description}</p>

        {complaint.assignedDepartment && (
          <p className="text-sm text-gray-600 mb-4">
            Assigned to: <span className="font-medium">{complaint.assignedDepartment}</span>
          </p>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor={`remarks-${complaint.id}`}>Admin Remarks</Label>
            <Textarea
              id={`remarks-${complaint.id}`}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks or feedback..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor={`department-${complaint.id}`}>Assign Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: string) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("Open")}
              disabled={complaint.status === "Open"}
            >
              Mark Open
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("In Progress")}
              disabled={complaint.status === "In Progress"}
            >
              In Progress
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("Resolved")}
              disabled={complaint.status === "Resolved"}
            >
              Resolve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("Rejected")}
              disabled={complaint.status === "Rejected"}
            >
              Reject
            </Button>
            <Button size="sm" onClick={handleRemarksUpdate}>
              Update Remarks
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
