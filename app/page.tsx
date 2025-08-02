"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminProvider } from "@/components/admin-context"

export default function Home() {
  return (
    <AdminProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
          <AppSidebar />
          <main className="flex-1">
            <AdminDashboard />
          </main>
        </div>
      </SidebarProvider>
    </AdminProvider>
  )
}
