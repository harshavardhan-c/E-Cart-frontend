"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ProductCard from "./product-card"
import { Skeleton } from "./ui/skeleton"
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
      productsApi.getProductsByCategory(category)
        .then((response) => {
          setProducts(response.data.products)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to fetch products')
          setLoading(false)
        })
    }
  }, [category])

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-red-600">Failed to load products: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  const displayProducts = products.slice(0, 8)

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <a href={`/category/${category}`} className="text-orange-600 font-semibold hover:text-orange-700">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        {displayProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
