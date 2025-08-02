"use client"

import {
  ArrowLeft,
  Edit,
  Power,
  PowerOff,
  Mail,
  Phone,
  Calendar,
  Activity,
  Building,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/components/admin-context"
import { formatDistanceToNow, format } from "date-fns"

export function AdminDetailView() {
  const { selectedAdmin, setSelectedAdmin, updateAdmin } = useAdmin()

  if (!selectedAdmin) return null

  const handleToggleStatus = () => {
    const newStatus = selectedAdmin.status === "active" ? "inactive" : "active"
    updateAdmin({ ...selectedAdmin, status: newStatus })
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "approval":
        return "✅"
      case "creation":
        return "➕"
      case "update":
        return "✏️"
      case "deletion":
        return "🗑️"
      case "login":
        return "🔐"
      default:
        return "📝"
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAdmin(null)} className="hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {selectedAdmin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedAdmin.name}</h3>
                    {getStatusBadge(selectedAdmin.status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span>{selectedAdmin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="h-4 w-4" />
                  <span>{selectedAdmin.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(selectedAdmin.createdAt), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Last active {formatDistanceToNow(new Date(selectedAdmin.lastActivity), { addSuffix: true })}
                  </span>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleToggleStatus}>
                    {selectedAdmin.status === "active" ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-2" />
                        Disable Account
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Enable Account
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Dashboard */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-2xl font-bold text-blue-700">{selectedAdmin.loginCount}</div>
                    <div className="text-sm text-blue-600">Total Logins</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-700">{selectedAdmin.ticketsResolved}</div>
                    <div className="text-sm text-green-600">Tickets Resolved</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-2xl font-bold text-purple-700">{selectedAdmin.assignedSocieties.length}</div>
                    <div className="text-sm text-purple-600">Societies Managed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Societies */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Assigned Societies ({selectedAdmin.assignedSocieties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAdmin.assignedSocieties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAdmin.assignedSocieties.map((society) => (
                      <div key={society.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <h4 className="font-semibold text-slate-900">{society.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{society.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {society.unitCount} units
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No societies assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAdmin.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg bg-slate-50/50 border border-slate-100"
                    >
                      <div className="text-lg">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-600">{activity.society}</p>
                        {activity.details && <p className="text-xs text-slate-500 mt-1">{activity.details}</p>}
                      </div>
                      <div className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
