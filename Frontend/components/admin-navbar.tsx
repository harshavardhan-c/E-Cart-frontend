"use client"

import { Menu, Bell, Search, Settings, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface AdminNavbarProps {
  onMenuClickAction: () => void
}

export default function AdminNavbar({ onMenuClickAction }: AdminNavbarProps) {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [notifications] = useState(3) // Mock notification count

  useEffect(() => {
    // Get admin user info from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setAdminUser(JSON.parse(userData))
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-30 border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={onMenuClickAction} 
              className="p-2 hover:bg-orange-50 rounded-lg transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6 text-gray-700 group-hover:text-orange-600" />
            </motion.button>
            
            <Link href="/admin" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">LM</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors">
                  Admin Panel
                </span>
                <div className="text-xs text-gray-500">Lalitha Mega Mall</div>
              </div>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <motion.button 
              className="relative p-2 hover:bg-orange-50 rounded-lg transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-6 h-6 text-gray-700 group-hover:text-orange-600" />
              {notifications > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[18px] h-4 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button 
              className="p-2 hover:bg-orange-50 rounded-lg transition-colors group hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-6 h-6 text-gray-700 group-hover:text-orange-600" />
            </motion.button>

            {/* Admin User Profile */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {adminUser?.name || 'Admin User'}
                </p>
                <p className="text-xs text-orange-600 font-medium">Administrator</p>
              </div>
            </div>

            {/* Exit Admin */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Admin</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
