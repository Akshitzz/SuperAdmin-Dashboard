"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Society {
  id: number
  name: string
  unitCount: number
  location: string
}

export interface Activity {
  id: number
  action: string
  society: string
  timestamp: string
  type: "approval" | "creation" | "update" | "deletion" | "login"
  details?: string
}

export interface Admin {
  id: number
  name: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
  assignedSocieties: Society[]
  lastActivity: string
  createdAt: string
  loginCount: number
  ticketsResolved: number
  recentActivities: Activity[]
  avatar?: string
}

interface AdminContextType {
  admins: Admin[]
  selectedAdmin: Admin | null
  setSelectedAdmin: (admin: Admin | null) => void
  updateAdmin: (admin: Admin) => void
  deleteAdmin: (id: number) => void
  createAdmin: (admin: Omit<Admin, "id">) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
  currentPage: number
  setCurrentPage: (page: number) => void
  selectedAdmins: number[]
  setSelectedAdmins: (ids: number[]) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Mock data
const mockSocieties: Society[] = [
  { id: 1, name: "Green Valley Residency", unitCount: 245, location: "North District" },
  { id: 2, name: "Sunshine Apartments", unitCount: 180, location: "Central Area" },
  { id: 3, name: "Royal Gardens", unitCount: 320, location: "South Zone" },
  { id: 4, name: "Blue Ridge Complex", unitCount: 156, location: "East Side" },
  { id: 5, name: "Golden Heights", unitCount: 280, location: "West End" },
  { id: 6, name: "Silver Oak Towers", unitCount: 195, location: "Downtown" },
  { id: 7, name: "Emerald Park", unitCount: 225, location: "Uptown" },
  { id: 8, name: "Crystal Bay", unitCount: 167, location: "Waterfront" },
]

const generateMockActivities = (adminName: string): Activity[] => [
  {
    id: 1,
    action: "Approved resident registration",
    society: "Green Valley Residency",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: "approval",
    details: "Approved new resident John Doe for Unit 245A",
  },
  {
    id: 2,
    action: "Updated society maintenance schedule",
    society: "Sunshine Apartments",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    type: "update",
    details: "Modified weekly cleaning schedule",
  },
  {
    id: 3,
    action: "Resolved parking complaint",
    society: "Royal Gardens",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    type: "approval",
    details: "Mediated parking dispute between residents",
  },
  {
    id: 4,
    action: "Created new announcement",
    society: "Green Valley Residency",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    type: "creation",
    details: "Posted water maintenance notice",
  },
  {
    id: 5,
    action: "System login",
    society: "Platform",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: "login",
    details: "Logged in from mobile device",
  },
]

const mockAdmins: Admin[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@platform.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    assignedSocieties: [mockSocieties[0], mockSocieties[1], mockSocieties[2]],
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: "2024-08-15T09:00:00Z",
    loginCount: 156,
    ticketsResolved: 89,
    recentActivities: generateMockActivities("Sarah Johnson"),
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@platform.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    assignedSocieties: [mockSocieties[3], mockSocieties[4]],
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: "2024-07-20T14:30:00Z",
    loginCount: 203,
    ticketsResolved: 124,
    recentActivities: generateMockActivities("Michael Chen"),
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@platform.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    assignedSocieties: [mockSocieties[5]],
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: "2024-09-10T11:15:00Z",
    loginCount: 78,
    ticketsResolved: 45,
    recentActivities: generateMockActivities("Emily Rodriguez"),
  },
  {
    id: 4,
    name: "David Kumar",
    email: "david.kumar@platform.com",
    phone: "+1 (555) 456-7890",
    status: "pending",
    assignedSocieties: [],
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: "2025-01-20T16:45:00Z",
    loginCount: 12,
    ticketsResolved: 3,
    recentActivities: generateMockActivities("David Kumar"),
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.thompson@platform.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    assignedSocieties: [mockSocieties[6], mockSocieties[7]],
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: "2024-06-05T08:20:00Z",
    loginCount: 289,
    ticketsResolved: 167,
    recentActivities: generateMockActivities("Lisa Thompson"),
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.wilson@platform.com",
    phone: "+1 (555) 678-9012",
    status: "active",
    assignedSocieties: [mockSocieties[1], mockSocieties[3]],
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: "2024-05-12T13:10:00Z",
    loginCount: 198,
    ticketsResolved: 112,
    recentActivities: generateMockActivities("James Wilson"),
  },
]

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([])

  const updateAdmin = useCallback(
    (updatedAdmin: Admin) => {
      setAdmins((prev) => prev.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin)))
      if (selectedAdmin?.id === updatedAdmin.id) {
        setSelectedAdmin(updatedAdmin)
      }
    },
    [selectedAdmin],
  )

  const deleteAdmin = useCallback(
    (id: number) => {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id))
      if (selectedAdmin?.id === id) {
        setSelectedAdmin(null)
      }
    },
    [selectedAdmin],
  )

  const createAdmin = useCallback(
    (newAdmin: Omit<Admin, "id">) => {
      const admin: Admin = {
        ...newAdmin,
        id: Math.max(...admins.map((a) => a.id)) + 1,
      }
      setAdmins((prev) => [...prev, admin])
    },
    [admins],
  )

  const value: AdminContextType = {
    admins,
    selectedAdmin,
    setSelectedAdmin,
    updateAdmin,
    deleteAdmin,
    createAdmin,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    selectedAdmins,
    setSelectedAdmins,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
