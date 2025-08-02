"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdminListView } from "@/components/admin-list-view"
import { AdminDetailView } from "@/components/admin-detail-view"
import { useAdmin } from "@/components/admin-context"

export function AdminDashboard() {
  const { selectedAdmin } = useAdmin()

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-4 p-6 border-b border-slate-200/60 backdrop-blur-xl bg-white/80">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {selectedAdmin ? "Admin Profile" : "Platform Administrators"}
          </h1>
          <p className="text-slate-600">
            {selectedAdmin
              ? `Manage ${selectedAdmin.name}'s profile and permissions`
              : "Manage platform administrators and their society assignments"}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">{selectedAdmin ? <AdminDetailView /> : <AdminListView />}</div>
    </div>
  )
}
