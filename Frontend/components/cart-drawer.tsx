"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { type CartItem } from "@/src/api/cartApi"
import Link from "next/link"

interface CartDrawerProps {
  isOpen: boolean
  onCloseAction: () => void
}

export default function CartDrawer({ isOpen, onCloseAction }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, total, isAuthenticated, cartCount } = useCart()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    onCloseAction()
    window.location.href = '/checkout'
  }

  const deliveryFee = total > 499 ? 0 : 49
  const finalTotal = total + deliveryFee

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <motion.button 
                onClick={onCloseAction} 
                className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </motion.div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/products"
                      onClick={onCloseAction}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg"
                    >
                      Continue Shopping
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Free delivery banner */}
                  {total < 499 && (
                    <motion.div
                      className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Add ₹{(499 - total).toFixed(2)} more for FREE delivery!
                          </p>
                          <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((total / 499) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {cart.map((item: CartItem, index: number) => {
                    const product = item.products || item;
                    const productName = product.name || 'Product';
                    const productPrice = product.price || 0;
                    const productImage = product.image_url || product.image || '';
                    
                    return (
                      <motion.div 
                        key={item.id} 
                        className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        layout
                      >
                        <div className="flex gap-4">
                          {productImage ? (
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{productName}</h3>
                            <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">₹{productPrice.toFixed(2)}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                                <motion.button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-l-xl transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </motion.button>
                                <span className="px-4 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-r-xl transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </motion.button>
                              </div>
                              
                              <motion.button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div 
                className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Order Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery:</span>
                    <span className={deliveryFee === 0 ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total:</span>
                      <span className="text-orange-600 dark:text-orange-400">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Fast Delivery
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
