"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { 
  Plus, 
  MessageCircle, 
  Phone, 
  Mail, 
  ArrowUp,
  ShoppingCart
} from "lucide-react"

interface FloatingAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  color?: string
}

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const actions: FloatingAction[] = [
    {
      icon: ArrowUp,
      label: "Back to Top",
      onClick: scrollToTop,
      color: "bg-gray-600 hover:bg-gray-700"
    },
    {
      icon: MessageCircle,
      label: "Live Chat",
      onClick: () => console.log("Open chat"),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Phone,
      label: "Call Us",
      onClick: () => window.open("tel:+911800123456"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Mail,
      label: "Email Us",
      onClick: () => window.open("mailto:support@lalithamegamall.com"),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="flex items-center gap-3"
                >
                  {/* Label */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    {action.label}
                  </motion.div>
                  
                  {/* Button */}
                  <motion.button
                    onClick={action.onClick}
                    className={`w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center transition-colors ${action.color || 'bg-orange-600 hover:bg-orange-700'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-orange-700 hover:to-orange-600 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Quick Cart FAB (separate component for cart-specific actions)
export function QuickCartFAB({ cartCount, onCartClickAction }: { cartCount: number; onCartClickAction: () => void }) {
  return (
    <motion.button
      onClick={onCartClickAction}
      className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-orange-700 hover:to-orange-600 transition-all duration-200 z-40"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        boxShadow: cartCount > 0 
          ? ["0 10px 25px rgba(249, 115, 22, 0.3)", "0 10px 35px rgba(249, 115, 22, 0.5)", "0 10px 25px rgba(249, 115, 22, 0.3)"]
          : "0 10px 25px rgba(0, 0, 0, 0.2)"
      }}
      transition={{ 
        boxShadow: { duration: 2, repeat: Infinity },
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <ShoppingCart className="w-6 h-6" />
      
      {/* Cart Count Badge */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.2 }}
          >
            {cartCount > 99 ? '99+' : cartCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}