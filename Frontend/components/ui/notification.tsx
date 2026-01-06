"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface NotificationProps {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message?: string
  duration?: number
  onCloseAction: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-800 dark:text-green-200",
    message: "text-green-700 dark:text-green-300"
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-800 dark:text-red-200",
    message: "text-red-700 dark:text-red-300"
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-800 dark:text-blue-200",
    message: "text-blue-700 dark:text-blue-300"
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-400",
    title: "text-yellow-800 dark:text-yellow-200",
    message: "text-yellow-700 dark:text-yellow-300"
  }
}

export function Notification({ id, type, title, message, duration = 5000, onCloseAction }: NotificationProps) {
  const [progress, setProgress] = useState(100)
  const Icon = icons[type]
  const colorScheme = colors[type]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100))
        if (newProgress <= 0) {
          onCloseAction(id)
          return 0
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration, id, onCloseAction])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm ${colorScheme.bg} ${colorScheme.border}`}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full">
        <motion.div
          className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 500, damping: 15 }}
          >
            <Icon className={`w-6 h-6 ${colorScheme.icon} flex-shrink-0`} />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={`font-semibold ${colorScheme.title}`}
            >
              {title}
            </motion.h4>
            {message && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`mt-1 text-sm ${colorScheme.message}`}
              >
                {message}
              </motion.p>
            )}
          </div>
          
          <motion.button
            onClick={() => onCloseAction(id)}
            className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${colorScheme.icon}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Notification Container
interface NotificationContainerProps {
  notifications: Array<{
    id: string
    type: "success" | "error" | "info" | "warning"
    title: string
    message?: string
    duration?: number
  }>
  onCloseAction: (id: string) => void
}

export function NotificationContainer({ notifications, onCloseAction }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onCloseAction={onCloseAction}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}