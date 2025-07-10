"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

interface ComplaintFormProps {
  complaint?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function ComplaintForm({ complaint, onSubmit, onCancel }: ComplaintFormProps) {
  const [formData, setFormData] = useState({
    title: complaint?.title || "",
    category: complaint?.category || "",
    description: complaint?.description || "",
    priority: complaint?.priority || "Medium",
  })
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)

  const categories = [
    "Infrastructure",
    "IT Systems",
    "HR Services",
    "Facilities",
    "Security",
    "Equipment",
    "Software",
    "Network",
    "Other",
  ]

  const priorities = ["Low", "Medium", "High", "Critical"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append("title", formData.title)
    data.append("category", formData.category)
    data.append("description", formData.description)
    data.append("priority", formData.priority)
    if (evidenceFile) {
      data.append("evidence", evidenceFile)
    }
    onSubmit(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{complaint ? "Edit Complaint" : "Submit New Complaint"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about your complaint or feedback"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence (optional)</Label>
              <Input
                id="evidence"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)}
              />
              {evidenceFile && <div className="text-xs text-gray-500">Selected: {evidenceFile.name}</div>}
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                {complaint ? "Update Complaint" : "Submit Complaint"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
