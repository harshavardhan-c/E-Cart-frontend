"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import { ProductCardSkeleton } from "./loading-spinner"
import { productsApi, type Product } from "@/src/api/productsApi"

interface ProductGridProps {
  title: string
  category?: string
}

export default function ProductGrid({ title, category }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (category && category !== "all") {
      setLoading(true)
      setError(null)
      
      // Add a small delay to prevent too many concurrent requests
      const timer = setTimeout(() => {
        productsApi.getProductsByCategory(category)
          .then((response) => {
            if (response?.data?.products) {
              setProducts(response.data.products)
            } else {
              setProducts([])
            }
            setLoading(false)
          })
          .catch((err) => {
            console.warn(`Failed to load ${category} products:`, err.message)
            // Don't show error for network issues, just set empty products
            if (err.response?.status >= 500 || err.code === 'ECONNABORTED') {
              setProducts([])
            } else {
              setError(err.response?.data?.message || 'Failed to fetch products')
            }
            setLoading(false)
          })
      }, Math.random() * 500) // Random delay between 0-500ms to stagger requests
      
      return () => clearTimeout(timer)
    }
  }, [category])

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.h2 
              className="text-4xl font-bold text-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {title}
            </motion.h2>
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{title}</h2>
            <p className="text-red-600">Failed to load products: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  const displayProducts = products.slice(0, 8)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-foreground">{title}</h2>
          <motion.a 
            href={`/category/${category}`} 
            className="group flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            whileHover={{ x: 5 }}
          >
            View All 
            <motion.span
              className="inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        
        {displayProducts.length === 0 && !loading && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-xl text-muted-foreground mb-2">No products available</p>
            <p className="text-muted-foreground">Check back soon for new arrivals!</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
