"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag, Utensils, Home, Sparkles, Gift, Wind, Heart, Zap } from "lucide-react"

const categories = [
  { 
    id: "snacks", 
    name: "Snacks", 
    icon: Gift, 
    gradient: "from-yellow-400 to-orange-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-400"
  },
  { 
    id: "chocolates", 
    name: "Chocolates", 
    icon: Heart, 
    gradient: "from-pink-400 to-rose-400",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-600 dark:text-pink-400"
  },
  { 
    id: "cosmetics", 
    name: "Cosmetics", 
    icon: Sparkles, 
    gradient: "from-purple-400 to-pink-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  { 
    id: "dry_fruits", 
    name: "Dry Fruits", 
    icon: ShoppingBag, 
    gradient: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400"
  },
  { 
    id: "plastic_items", 
    name: "Plastic Items", 
    icon: Home, 
    gradient: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  { 
    id: "utensils", 
    name: "Utensils", 
    icon: Utensils, 
    gradient: "from-gray-400 to-slate-400",
    bgColor: "bg-gray-50 dark:bg-gray-700",
    iconColor: "text-gray-600 dark:text-gray-300"
  },
  { 
    id: "appliances", 
    name: "Appliances", 
    icon: Wind, 
    gradient: "from-orange-400 to-red-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400"
  },
]

export default function CategorySection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our wide range of products across different categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/category/${category.id}`}>
                  <div className="group cursor-pointer">
                    <motion.div
                      className={`${category.bgColor} rounded-2xl p-6 flex flex-col items-center justify-center h-36 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      {/* Icon with animation */}
                      <motion.div
                        className="relative z-10"
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={`w-14 h-14 ${category.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                      </motion.div>
                      
                      {/* Sparkle effect on hover */}
                      <motion.div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0, rotate: 0 }}
                        whileHover={{ scale: 1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Zap className="w-4 h-4 text-orange-500" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.p 
                      className="text-center mt-4 font-semibold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category.name}
                    </motion.p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white text-center shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="mb-6 text-orange-100">Browse all products or use our search feature</p>
          <Link
            href="/products"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
