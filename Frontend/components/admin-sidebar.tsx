"use client"

import { LayoutDashboard, Package, ShoppingBag, Ticket, Settings, BarChart3, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AdminSidebarProps {
  activeTab: string
  setActiveTabAction: (tab: string) => void
  isOpen: boolean
}

export default function AdminSidebar({ activeTab, setActiveTabAction, isOpen }: AdminSidebarProps) {
  const menuItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      description: "Overview & Analytics",
      badge: null
    },
    { 
      id: "products", 
      label: "Products", 
      icon: Package, 
      description: "Manage Inventory",
      badge: "24"
    },
    { 
      id: "orders", 
      label: "Orders", 
      icon: ShoppingBag, 
      description: "Order Management",
      badge: "12"
    },
    { 
      id: "coupons", 
      label: "Coupons", 
      icon: Ticket, 
      description: "Discount Codes",
      badge: null
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      description: "System Config",
      badge: null
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -256, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -256, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-64 bg-white shadow-xl border-r border-gray-200 fixed left-0 top-[73px] h-[calc(100vh-73px)] overflow-y-auto z-20"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Admin Tools</h3>
                <p className="text-xs text-gray-500">Management Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTabAction(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-orange-100"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive 
                        ? "text-white" 
                        : "text-gray-600 group-hover:text-orange-600"
                    }`} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${
                      isActive ? "text-white" : "text-gray-900 group-hover:text-orange-600"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}>
                      {item.description}
                    </div>
                  </div>

                  {item.badge && (
                    <motion.span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-orange-100 text-orange-600 group-hover:bg-orange-200"
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="p-4 mt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Sales</span>
                <span className="text-sm font-bold text-green-600">₹12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Orders</span>
                <span className="text-sm font-bold text-blue-600">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-bold text-orange-600">3</span>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="p-4 m-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Performance</span>
            </div>
            <p className="text-xs text-green-700">Sales up 23% this month</p>
            <div className="mt-2 bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
