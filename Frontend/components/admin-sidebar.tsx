"use client"

import { LayoutDashboard, Package, ShoppingBag, Ticket, Settings } from "lucide-react"
import { motion } from "framer-motion"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "coupons", label: "Coupons", icon: Ticket },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <motion.aside
      initial={{ x: isOpen ? 0 : -256 }}
      animate={{ x: isOpen ? 0 : -256 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-gray-900 text-white p-6 fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto z-20"
    >
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </motion.aside>
  )
}
