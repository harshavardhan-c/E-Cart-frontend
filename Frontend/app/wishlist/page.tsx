"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { Heart, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

interface WishlistItem {
  id: string
  product_id?: string
  products?: {
    id: string
    name: string
    price: number
    image_url?: string
    image?: string
  }
  name?: string
  price?: number
  image_url?: string
  image?: string
}

export default function WishlistPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount, addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()

  const handleAddToCart = async (product: any) => {
    await addToCart(product)
    setIsCartOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Start adding items to your wishlist to save them for later</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item: WishlistItem, index: number) => {
              // Extract product data from nested structure
              const product = item.products || item
              const productId = product?.id || item.product_id
              const productName = product?.name || 'Product'
              const productPrice = product?.price || 0
              const productImage = product?.image_url || product?.image || null
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 h-64">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <Link href={`/product/${productId}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-orange-600 transition-colors">
                        {productName}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-2xl font-bold text-gray-900">₹{productPrice.toFixed(2)}</span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="w-full border-2 border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onCloseAction={() => setIsCartOpen(false)} />
    </main>
  )
}
