"use client"

import { motion } from "framer-motion"
import { ChevronRight, Truck, Shield, Headphones, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "On orders above ₹499"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer service"
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy"
    }
  ]

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="relative overflow-hidden bg-white min-h-[600px]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  const isDark = theme === 'dark'
  const heroClasses = isDark 
    ? "relative overflow-hidden bg-gray-900 hero-dark transition-colors duration-300"
    : "relative overflow-hidden bg-white hero-light transition-colors duration-300"

  return (
    <div className={heroClasses}>
      {/* Light theme gradient overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isDark 
          ? "bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-gray-900/50"
          : "bg-gradient-to-br from-orange-50/30 via-white/50 to-orange-50/30"
      }`}></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                isDark 
                  ? "bg-orange-900/30 text-orange-400"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              New arrivals every week
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl lg:text-6xl font-bold mb-6 leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Your Ultimate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                Shopping Destination
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-xl mb-8 leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Discover millions of products at unbeatable prices. From electronics to fashion, 
              we have everything you need with fast delivery and exceptional service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
              >
                View Deals
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 text-center lg:text-left"
            >
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">99%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Hero Image */}
              <motion.div
                className="relative z-10 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-3xl p-8 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Product showcase */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=400&auto=format&fit=crop"
                        alt="Electronics"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Electronics</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Latest gadgets</div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.1 }}
                  >
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop"
                        alt="Fashion"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Fashion</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Trendy styles</div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.2 }}
                  >
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"
                        alt="Home & Garden"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Home & Garden</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Comfort living</div>
                  </motion.div>
                  
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17, delay: 0.3 }}
                  >
                    <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
                        alt="Sports"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Sports</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Active lifestyle</div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200"
                whileHover={{ rotate: 5 }}
              >
                <feature.icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </motion.div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}