"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag, Utensils, Home, Sparkles, Gift, Wind, Heart } from "lucide-react"

const categories = [
  { id: "snacks", name: "Snacks", icon: Gift, color: "bg-yellow-100" },
  { id: "chocolates", name: "Chocolates", icon: Heart, color: "bg-pink-100" },
  { id: "cosmetics", name: "Cosmetics", icon: Sparkles, color: "bg-purple-100" },
  { id: "dry_fruits", name: "Dry Fruits", icon: ShoppingBag, color: "bg-green-100" },
  { id: "plastic_items", name: "Plastic Items", icon: Home, color: "bg-blue-100" },
  { id: "utensils", name: "Utensils", icon: Utensils, color: "bg-gray-100" },
  { id: "appliances", name: "Appliances", icon: Wind, color: "bg-orange-100" },
]

export default function CategorySection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/category/${category.id}`}>
                  <div className="group cursor-pointer">
                    <div
                      className={`${category.color} rounded-lg p-6 flex items-center justify-center h-32 group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105`}
                    >
                      <Icon className="w-12 h-12 text-gray-700" />
                    </div>
                    <p className="text-center mt-3 font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
