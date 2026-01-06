"use client"

import { ShoppingBag, Users, TrendingUp, Package, ArrowUpRight, ArrowDownRight, Eye, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const salesData = [
  { month: "Jan", sales: 4000, orders: 240, customers: 120 },
  { month: "Feb", sales: 3000, orders: 221, customers: 110 },
  { month: "Mar", sales: 2000, orders: 229, customers: 115 },
  { month: "Apr", sales: 2780, orders: 200, customers: 100 },
  { month: "May", sales: 1890, orders: 229, customers: 125 },
  { month: "Jun", sales: 2390, orders: 200, customers: 105 },
]

const categoryData = [
  { name: 'Electronics', value: 35, color: '#f97316' },
  { name: 'Fashion', value: 25, color: '#3b82f6' },
  { name: 'Home & Kitchen', value: 20, color: '#10b981' },
  { name: 'Books', value: 10, color: '#8b5cf6' },
  { name: 'Others', value: 10, color: '#f59e0b' },
]

export default function DashboardOverview() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const stats = [
    { 
      label: "Total Orders", 
      value: "1,234", 
      change: "+12.5%", 
      trend: "up",
      icon: ShoppingBag, 
      color: "from-blue-600 to-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      label: "Total Revenue", 
      value: "₹45,678", 
      change: "+23.1%", 
      trend: "up",
      icon: TrendingUp, 
      color: "from-green-600 to-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    { 
      label: "Total Products", 
      value: "24", 
      change: "+2", 
      trend: "up",
      icon: Package, 
      color: "from-orange-600 to-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    { 
      label: "Total Customers", 
      value: "567", 
      change: "-2.3%", 
      trend: "down",
      icon: Users, 
      color: "from-purple-600 to-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
  ]

  const recentOrders = [
    { id: 1001, customer: "John Doe", amount: 2500, status: "delivered", time: "2 hours ago" },
    { id: 1002, customer: "Jane Smith", amount: 3200, status: "processing", time: "4 hours ago" },
    { id: 1003, customer: "Mike Johnson", amount: 1800, status: "shipped", time: "6 hours ago" },
    { id: 1004, customer: "Sarah Williams", amount: 4100, status: "pending", time: "8 hours ago" },
    { id: 1005, customer: "Tom Brown", amount: 2900, status: "delivered", time: "1 day ago" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />
      case "processing": return <AlertCircle className="w-4 h-4" />
      case "shipped": return <Package className="w-4 h-4" />
      case "delivered": return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-orange-100">Here's what's happening with your store today.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">₹12,450</div>
              <div className="text-sm text-orange-100">Today's Sales</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight
          
          return (
            <motion.div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <motion.div 
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium">6M</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">1Y</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {isClient ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3 text-gray-500">
                  <BarChart3 className="w-8 h-8" />
                  <span>Chart functionality temporarily disabled</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3 text-gray-500">
                  <BarChart3 className="w-8 h-8 animate-pulse" />
                  <span>Loading chart...</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Category Sales</h2>
          
          {/* Custom Progress Bars */}
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <motion.div 
                key={index} 
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Total Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Categories</span>
              <span className="text-lg font-bold text-orange-600">{categoryData.length}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
              <Eye className="w-4 h-4" />
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <motion.tr 
                  key={order.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <td className="py-4 px-6 font-semibold text-gray-900">#{order.id}</td>
                  <td className="py-4 px-6 text-gray-600">{order.customer}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">₹{order.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">{order.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
