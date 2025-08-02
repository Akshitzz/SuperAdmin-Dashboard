"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdmin, type Admin } from "@/components/admin-context"
import { AdminModal } from "@/components/admin-modal"
import { formatDistanceToNow } from "date-fns"

const ITEMS_PER_PAGE = 12

export function AdminListView() {
  const {
    admins,
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
    setSelectedAdmin,
    updateAdmin,
    deleteAdmin,
  } = useAdmin()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)

  // Filter and sort admins
  const filteredAndSortedAdmins = useMemo(() => {
    const filtered = admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || admin.status === statusFilter
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "lastActivity":
          aValue = new Date(a.lastActivity).getTime()
          bValue = new Date(b.lastActivity).getTime()
          break
        case "societies":
          aValue = a.assignedSocieties.length
          bValue = b.assignedSocieties.length
          break
        case "performance":
          aValue = a.ticketsResolved
          bValue = b.ticketsResolved
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [admins, searchTerm, statusFilter, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAdmins.length / ITEMS_PER_PAGE)
  const paginatedAdmins = filteredAndSortedAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdmins(paginatedAdmins.map((admin) => admin.id))
    } else {
      setSelectedAdmins([])
    }
  }

  const handleSelectAdmin = (adminId: number, checked: boolean) => {
    if (checked) {
      setSelectedAdmins([...selectedAdmins, adminId])
    } else {
      setSelectedAdmins(selectedAdmins.filter((id) => id !== adminId))
    }
  }

  const handleToggleStatus = (admin: Admin) => {
    const newStatus = admin.status === "active" ? "inactive" : "active"
    updateAdmin({ ...admin, status: newStatus })
  }

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingAdmin(null)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-orange-100 text-orange-800 border-orange-200",
    }

    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            status === "active" ? "bg-green-500" : status === "inactive" ? "bg-red-500" : "bg-orange-500"
          }`}
        />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-slate-200"
            />
          </div>

          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/80 border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>

            <Button variant="outline" className="bg-white/80 border-slate-200">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {selectedAdmins.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedAdmins.length} admin{selectedAdmins.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-transparent">
                  Bulk Enable
                </Button>
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-transparent">
                  Bulk Disable
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block flex-1 overflow-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedAdmins.length === paginatedAdmins.length && paginatedAdmins.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Admin Details
                    {sortBy === "name" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort("societies")}
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Societies
                    {sortBy === "societies" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort("lastActivity")}
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Last Activity
                    {sortBy === "lastActivity" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
                <th className="p-4 text-left">
                  <button
                    onClick={() => handleSort("performance")}
                    className="flex items-center gap-2 font-medium text-slate-700 hover:text-slate-900"
                  >
                    Performance
                    {sortBy === "performance" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.map((admin) => (
                <tr key={admin.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedAdmins.includes(admin.id)}
                      onCheckedChange={(checked) => handleSelectAdmin(admin.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                        {admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{admin.name}</div>
                        <div className="text-sm text-slate-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(admin.status)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{admin.assignedSocieties.length}</span>
                      <span className="text-slate-500">societies</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-900">
                      {formatDistanceToNow(new Date(admin.lastActivity), { addSuffix: true })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-900">{admin.loginCount}</span>
                        <span className="text-slate-500 ml-1">logins</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-900">{admin.ticketsResolved}</span>
                        <span className="text-slate-500 ml-1">tickets</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedAdmin(admin)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(admin)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                          {admin.status === "active" ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-2" />
                              Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteAdmin(admin.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {paginatedAdmins.map((admin) => (
            <Card key={admin.id} className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedAdmins.includes(admin.id)}
                      onCheckedChange={(checked) => handleSelectAdmin(admin.id, checked as boolean)}
                    />
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium">
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{admin.name}</div>
                      <div className="text-sm text-slate-500">{admin.email}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAdmin(admin)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(admin)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(admin)}>
                        {admin.status === "active" ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-2" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteAdmin(admin.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Status:</span>
                    <div className="mt-1">{getStatusBadge(admin.status)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Societies:</span>
                    <div className="mt-1 font-medium">{admin.assignedSocieties.length}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Last Activity:</span>
                    <div className="mt-1 font-medium">
                      {formatDistanceToNow(new Date(admin.lastActivity), { addSuffix: true })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Performance:</span>
                    <div className="mt-1 font-medium">{admin.ticketsResolved} tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedAdmins.length)} of{" "}
              {filteredAndSortedAdmins.length} admins
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-white/80 border-slate-200"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-white/80 border-slate-200"
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-white/80 border-slate-200"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} admin={editingAdmin} />
    </div>
  )
}
