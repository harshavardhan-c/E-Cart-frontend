"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, X, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { searchProducts } from "@/lib/dummy-data"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Popular searches
  const popularSearches = [
    "Chocolate", "Snacks", "Kitchen utensils", "Beauty products", "Dry fruits"
  ]

  // Recent searches (mock data)
  const recentSearches = [
    "Lays chips", "Face cream", "Steel plates"
  ]

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      const searchResults = searchProducts(value)
      setResults(searchResults.slice(0, 5))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(true) // Keep open to show suggestions
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setIsFocused(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setIsOpen(false)
    setIsFocused(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`relative transition-all duration-300 ${
            isFocused ? 'transform scale-105' : ''
          }`}
        >
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              setIsOpen(true)
            }}
            className={`w-full px-6 py-4 pl-14 pr-12 border-2 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-lg ${
              isFocused 
                ? 'border-orange-500 shadow-orange-200 dark:shadow-orange-900/30' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          />
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors ${
            isFocused ? 'text-orange-500' : 'text-gray-400'
          }`} />
          
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={() => {
                  setQuery("")
                  setResults([])
                  setIsOpen(false)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Enhanced Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Results
                  </h3>
                </div>
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setQuery("")
                        setResults([])
                        setIsOpen(false)
                        setIsFocused(false)
                      }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-b border-gray-50 dark:border-gray-700 last:border-b-0 transition-all duration-200 group"
                    >
                      {product.image ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
                          ₹{product.price}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setQuery("")
                    setResults([])
                    setIsOpen(false)
                    setIsFocused(false)
                  }}
                  className="block px-4 py-4 text-center text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 border-t border-gray-100 dark:border-gray-700 transition-colors"
                >
                  View all results for "{query}"
                </Link>
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No products found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Try searching with different keywords</p>
              </div>
            )}

            {/* Suggestions when no query */}
            {!query && (
              <div className="py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={search}
                          onClick={() => handleSuggestionClick(search)}
                          className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div className="px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <motion.button
                        key={search}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
