"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "white"
  text?: string
}

export default function LoadingSpinner({ 
  size = "md", 
  variant = "primary", 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  }

  const colorClasses = {
    primary: "text-orange-600",
    secondary: "text-gray-600",
    white: "text-white"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[variant]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset="31.416"
            className="opacity-25"
          />
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.416"
            initial={{ strokeDashoffset: 31.416 }}
            animate={{ strokeDashoffset: [31.416, 0, 31.416] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      
      {text && (
        <motion.p
          className={`text-sm font-medium ${colorClasses[variant]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Page Loading Component
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mb-4 mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">LM</span>
          </div>
        </motion.div>
        
        <motion.div
          className="flex gap-1 justify-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-orange-600 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
        
        <motion.p
          className="text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Loading your shopping experience...
        </motion.p>
      </div>
    </div>
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700">
      {/* Image Skeleton */}
      <div className="h-56 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 400] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.1 }}
          />
        </div>
        
        {/* Rating */}
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-50, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
            />
          </div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-50, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.3 }}
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
            />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-75, 225] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </div>
        </div>
        
        {/* Stock */}
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-50, 150] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.6 }}
          />
        </div>
        
        {/* Price */}
        <div className="flex gap-3 mb-5">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-50, 120] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.7 }}
            />
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-40, 96] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.8 }}
            />
          </div>
        </div>
        
        {/* Button */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mt-auto relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.9 }}
          />
        </div>
      </div>
    </div>
  )
}