"use client"

import type React from "react"
import { Heart, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Product } from "@/src/api/productsApi"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const isWishlisted = wishlist.some((item: any) => item.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const calculateDiscountedPrice = () => {
    const discount = (product as any).discount || (product as any).discount_percent
    if (discount && discount > 0) {
      return product.price - (product.price * discount / 100)
    }
    return product.price
  }

  const discountedPrice = calculateDiscountedPrice()
  const hasDiscount = ((product as any).discount && (product as any).discount > 0) || ((product as any).discount_percent && (product as any).discount_percent > 0)

  // Decide which image to show for this product with better fallback handling
  const getImageSrc = () => {
    if (product.image_url) {
      // Add referrerPolicy to handle tracking prevention
      return product.image_url;
    }
    if (product.name.toLowerCase() === 'lays classic') {
      return '/lays-potato-chips-classic-salted-500x500.webp';
    }
    return '/placeholder.jpg';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== '/placeholder.jpg') {
      target.src = '/placeholder.jpg';
    } else {
      target.style.display = 'none';
    }
  };

  return (
    <motion.div
      className="group cursor-pointer h-full"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col relative border border-gray-100 dark:border-gray-700">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 h-56">
            <motion.img
              src={getImageSrc()}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
              referrerPolicy="no-referrer"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {hasDiscount && (
                <motion.div
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {(product as any).discount || (product as any).discount_percent}% OFF
                  </div>
                </motion.div>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Only {product.stock} left
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Wishlist Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault()
                toggleWishlist(product)
              }}
              className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"}`} />
            </motion.button>
            
            {/* Quick View Button - appears on hover */}
            <motion.div
              className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
            >
              <button className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white py-2 rounded-xl font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg">
                Quick View
              </button>
            </motion.div>
          </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">(4.2)</span>
            <span className="text-sm text-gray-500 dark:text-gray-500">• 127 reviews</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                  Save ₹{(product.price - discountedPrice).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-auto shadow-lg ${
              product.stock === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 hover:shadow-xl'
            }`}
            whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
            whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>
          
          {/* Prime-like delivery info */}
          {product.stock > 0 && (
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
              <span className="text-orange-600 dark:text-orange-400 font-semibold">FREE</span> delivery by tomorrow
            </div>
          )}
        </div>
      </div>
    </Link>
    </motion.div>
  )
}
