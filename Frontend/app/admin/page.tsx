"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminNavbar from "@/components/admin-navbar"
import AdminSidebar from "@/components/admin-sidebar"
import DashboardOverview from "@/components/admin/dashboard-overview"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"
import CouponManagement from "@/components/admin/coupon-management"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuth")
    if (!adminAuth) {
      router.push("/admin-login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} />
        <main className="flex-1 p-8 ml-0 md:ml-64">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "products" && <ProductManagement />}
          {activeTab === "orders" && <OrderManagement />}
          {activeTab === "coupons" && <CouponManagement />}
        </main>
      </div>
    </div>
  )
}
