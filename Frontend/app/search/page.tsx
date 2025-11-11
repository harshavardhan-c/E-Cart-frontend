"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { searchProducts } from "@/lib/dummy-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    if (query) {
      const searchResults = searchProducts(query)
      setResults(searchResults)
    }
  }, [query])

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} cartCount={cartCount} />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="flex items-center gap-2 text-orange-600 font-semibold mb-4 hover:text-orange-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {results.length} {results.length === 1 ? "result" : "results"} found for "{query}"
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product, index) => (
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
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No results found</h2>
            <p className="text-gray-600 mb-8">
              We couldn't find any products matching "{query}". Try searching for something else.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  )
}
