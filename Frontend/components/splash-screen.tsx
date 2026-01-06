"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    "Loading your shopping experience...",
    "Preparing amazing deals...",
    "Almost ready!"
  ]

  useEffect(() => {
    // Step through loading messages
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 600)

    // Hide splash screen after 2.5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => {
      clearInterval(stepTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 flex items-center justify-center z-50"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center relative z-10"
          >
            {/* Logo Container */}
            <motion.div
              className="relative mb-8"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo */}
              <motion.div
                className="relative w-28 h-28 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <span className="text-5xl font-bold bg-gradient-to-br from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  LM
                </span>
              </motion.div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                Lalitha Mega Mall
              </h1>
              <p className="text-xl text-orange-100 font-medium">
                Your Ultimate Shopping Destination
              </p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Loading Dots */}
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{ 
                      y: [0, -12, 0],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Loading Text */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-orange-100 font-medium text-lg"
                >
                  {steps[currentStep]}
                </motion.p>
              </AnimatePresence>

              {/* Progress Bar */}
              <div className="w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute -bottom-10 -right-10 w-16 h-16 bg-white/10 rounded-full"
              animate={{ 
                y: [0, 20, 0],
                x: [0, -10, 0],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
