"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import AdminNavbar from "@/components/admin-navbar"
import AdminSidebar from "@/components/admin-sidebar"
import DashboardOverview from "@/components/admin/dashboard-overview"
import ProductManagement from "@/components/admin/product-management"
import OrderManagement from "@/components/admin/order-management"
import CouponManagement from "@/components/admin/coupon-management"
import LoadingSpinner from "@/components/loading-spinner"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuth")
    const accessToken = localStorage.getItem("accessToken")
    
    setTimeout(() => {
      if (!adminAuth || !accessToken) {
        router.push("/admin-login")
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }, 1000)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingSpinner />
          <motion.p 
            className="mt-4 text-orange-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Admin Panel...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavbar onMenuClickAction={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTabAction={setActiveTab} isOpen={isSidebarOpen} />
        <motion.main 
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'
          }`}
          layout
        >
          <div className="p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "dashboard" && <DashboardOverview />}
                {activeTab === "products" && <ProductManagement />}
                {activeTab === "orders" && <OrderManagement />}
                {activeTab === "coupons" && <CouponManagement />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  )
}
