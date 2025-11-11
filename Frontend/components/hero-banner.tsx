"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-orange-50 to-orange-100 py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fresh Groceries & Household Essentials
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Shop quality groceries, kitchen items, steel products, and household accessories at unbeatable prices.
              Delivered fresh to your doorstep.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/offers"
                className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                View Offers
              </Link>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-80 md:h-96"
          >
            <img
              src="/fresh-groceries-and-household-items-display.jpg"
              alt="Fresh groceries and household items"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
