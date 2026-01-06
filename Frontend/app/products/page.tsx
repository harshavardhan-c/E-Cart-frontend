"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { productsApi, type Product } from "@/src/api/productsApi"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const categories = [
    { id: "all", name: "All Products" },
    { id: "groceries", name: "Groceries" },
    { id: "snacks", name: "Snacks" },
    { id: "chocolates", name: "Chocolates" },
    { id: "utensils", name: "Utensils" },
    { id: "household", name: "Household" },
    { id: "cosmetics", name: "Cosmetics" },
    { id: "dry_fruits", name: "Dry Fruits" },
    { id: "plastic_items", name: "Plastic Items" },
    { id: "appliances", name: "Appliances" },
  ]

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getAllProducts(1, 100)
        if (response?.data?.products) {
          setProducts(response.data.products)
        } else {
          // Fallback: try search API
          try {
            const searchResponse = await productsApi.searchProducts("")
            if (searchResponse?.data?.products) {
              setProducts(searchResponse.data.products)
            }
          } catch (searchError) {
            console.warn('Search API also failed:', searchError)
            // Set empty products array to stop loading state
            setProducts([])
          }
        }
      } catch (error: any) {
        console.error('Error loading products:', error)
        // Don't show error toast for network issues, just log them
        if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
          console.warn('Server error or timeout, products will be empty')
        } else {
          toast({
            title: "Error loading products",
            description: "Failed to load products. Please try again.",
            variant: "destructive"
          })
        }
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered.reverse()
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy, priceRange])

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover our wide range of quality products</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-orange-600 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Min: ₹{priceRange[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max: ₹{priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
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
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {loading ? "Loading products..." : "No products found matching your filters."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onCloseAction={() => setIsCartOpen(false)} />
    </main>
  )
}
