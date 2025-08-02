"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdmin, type Admin, type Society } from "@/components/admin-context"

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  admin?: Admin | null
}

// Mock societies for selection
const availableSocieties: Society[] = [
  { id: 1, name: "Green Valley Residency", unitCount: 245, location: "North District" },
  { id: 2, name: "Sunshine Apartments", unitCount: 180, location: "Central Area" },
  { id: 3, name: "Royal Gardens", unitCount: 320, location: "South Zone" },
  { id: 4, name: "Blue Ridge Complex", unitCount: 156, location: "East Side" },
  { id: 5, name: "Golden Heights", unitCount: 280, location: "West End" },
  { id: 6, name: "Silver Oak Towers", unitCount: 195, location: "Downtown" },
  { id: 7, name: "Emerald Park", unitCount: 225, location: "Uptown" },
  { id: 8, name: "Crystal Bay", unitCount: 167, location: "Waterfront" },
]

export function AdminModal({ isOpen, onClose, admin }: AdminModalProps) {
  const { createAdmin, updateAdmin } = useAdmin()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "pending" as "active" | "inactive" | "pending",
    assignedSocieties: [] as Society[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status,
        assignedSocieties: admin.assignedSocieties,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "pending",
        assignedSocieties: [],
      })
    }
    setErrors({})
  }, [admin, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const adminData = {
      ...formData,
      lastActivity: new Date().toISOString(),
      createdAt: admin?.createdAt || new Date().toISOString(),
      loginCount: admin?.loginCount || 0,
      ticketsResolved: admin?.ticketsResolved || 0,
      recentActivities: admin?.recentActivities || [],
    }

    if (admin) {
      updateAdmin({ ...adminData, id: admin.id })
    } else {
      createAdmin(adminData)
    }

    onClose()
  }

  const handleAddSociety = (societyId: string) => {
    const society = availableSocieties.find((s) => s.id === Number.parseInt(societyId))
    if (society && !formData.assignedSocieties.find((s) => s.id === society.id)) {
      setFormData((prev) => ({
        ...prev,
        assignedSocieties: [...prev.assignedSocieties, society],
      }))
    }
  }

  const handleRemoveSociety = (societyId: number) => {
    setFormData((prev) => ({
      ...prev,
      assignedSocieties: prev.assignedSocieties.filter((s) => s.id !== societyId),
    }))
  }

  const unassignedSocieties = availableSocieties.filter(
    (society) => !formData.assignedSocieties.find((s) => s.id === society.id),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {admin ? "Edit Admin" : "Create New Admin"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={`mt-1 ${errors.name ? "border-red-300" : "border-slate-200"} bg-white/80`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`mt-1 ${errors.email ? "border-red-300" : "border-slate-200"} bg-white/80`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className={`mt-1 ${errors.phone ? "border-red-300" : "border-slate-200"} bg-white/80`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="mt-1 bg-white/80 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Society Assignments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Society Assignments</h3>

            {formData.assignedSocieties.length > 0 && (
              <div className="space-y-2">
                <Label>Assigned Societies</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {formData.assignedSocieties.map((society) => (
                    <div
                      key={society.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{society.name}</div>
                        <div className="text-sm text-slate-600">
                          {society.location} • {society.unitCount} units
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSociety(society.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unassignedSocieties.length > 0 && (
              <div>
                <Label>Add Society</Label>
                <Select onValueChange={handleAddSociety}>
                  <SelectTrigger className="mt-1 bg-white/80 border-slate-200">
                    <SelectValue placeholder="Select a society to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedSocieties.map((society) => (
                      <SelectItem key={society.id} value={society.id.toString()}>
                        <div>
                          <div className="font-medium">{society.name}</div>
                          <div className="text-sm text-slate-500">
                            {society.location} • {society.unitCount} units
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {admin ? "Update Admin" : "Create Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
