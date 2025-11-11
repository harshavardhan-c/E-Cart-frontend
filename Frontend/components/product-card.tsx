"use client"

import type React from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Product } from "@/src/api/productsApi"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()
  const isWishlisted = wishlist.some((item) => item.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // addToCart already shows a toast, so we don't need to show it again
    addToCart(product)
  }

  const calculateDiscountedPrice = () => {
    const discount = product.discount || product.discount_percent
    if (discount && discount > 0) {
      return product.price - (product.price * discount / 100)
    }
    return product.price
  }

  const discountedPrice = calculateDiscountedPrice()
  const hasDiscount = (product.discount && product.discount > 0) || (product.discount_percent && product.discount_percent > 0)

  // Decide which image to show for this product
  let resolvedImage = product.image_url;
  if (!resolvedImage) {
    if (product.name.toLowerCase() === 'lays classic') {
      resolvedImage = '/lays-potato-chips-classic-salted-500x500.webp';
    } else {
      resolvedImage = '/placeholder.jpg';
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 h-48">
          {resolvedImage && (
            <img
              src={resolvedImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          )}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {product.discount}% OFF
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product)
            }}
            className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-3">
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mt-auto ${
              product.stock === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
