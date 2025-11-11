"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { productsApi } from "@/src/api/productsApi"
import { Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import ProductCard from "@/components/product-card"
import { motion } from "framer-motion"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const { addToCart, cartCount } = useCart()
  const { wishlist, toggleWishlist } = useWishlist()

  const isWishlisted = wishlist.some((item) => item.id === productId)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        // Try to get product from API - need category
        // For now, fetch by searching products or use a default category
        const response = await productsApi.searchProducts(productId)
        
        if (response.data.products && response.data.products.length > 0) {
          const foundProduct = response.data.products.find((p: any) => p.id === productId)
          if (foundProduct) {
            setProduct(foundProduct)
            // Fetch related products
            if (foundProduct.category) {
              const relatedResponse = await productsApi.getProductsByCategory(foundProduct.category)
              const related = relatedResponse.data.products
                .filter((p: any) => p.id !== productId)
                .slice(0, 4)
              setRelatedProducts(related)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/') // Redirect to home if product not found
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setIsCartOpen(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading product...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />
        <div className="flex items-center justify-center h-96 flex-col gap-4">
          <p className="text-gray-600 text-xl">Product not found</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
          >
            Go to Home
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-96">
            {product.image_url ? (
              <img 
                src={product.image_url}
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ) : null}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-600 font-semibold text-sm mb-2">Category: {product.category}</p>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                </div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                </button>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4 mb-6">
                <span className={product.stock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.mrp.toFixed(2)}</span>
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8">{product.description}</p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Truck className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% safe transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-semibold">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "details" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 font-semibold">Category</p>
                  <p className="text-gray-900 capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Price</p>
                  <p className="text-gray-900">₹{product.price}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Rating</p>
                  <p className="text-gray-900">{product.rating} / 5</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Availability</p>
                  <p className="text-green-600 font-semibold">In Stock</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">Customer {i}</p>
                      <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                    </div>
                    <p className="text-gray-600">Great product! Highly recommended for quality and value.</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  )
}
