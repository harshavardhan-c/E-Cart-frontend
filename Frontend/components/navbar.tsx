"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Menu, X, User, LogOut, MapPin, ChevronDown } from "lucide-react"
import SearchBar from "./search-bar"
import { ThemeToggle } from "./theme-toggle"
import { useAuthContext } from "../src/context/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"

interface NavbarProps {
  onCartClickAction: () => void
  cartCount: number
}

export default function Navbar({ onCartClickAction, cartCount }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const { isAuthenticated, user, logoutUser, isAdminUser } = useAuthContext()

  const handleLogout = () => {
    logoutUser()
    setIsProfileOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports", "Beauty", "Toys", "Automotive"
  ]

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm py-2 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <span className="font-medium">🎉 Free delivery on orders above ₹499 | Use code: FREESHIP</span>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.nav 
        className={`bg-white dark:bg-gray-900 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg backdrop-blur-md bg-white/95 dark:bg-gray-900/95' : 'shadow-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-white font-bold text-xl">LM</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                  Lalitha Mega Mall
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">Your Shopping Destination</div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 mx-4 max-w-md lg:max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SearchBar />
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="relative text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm"
                >
                  Home
                </Link>
              </motion.div>
              
              <div className="relative group">
                <motion.button
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm"
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  Categories
                  <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </motion.button>
                
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {categories.map((category, index) => (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={`/category/${category.toLowerCase()}`}
                              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 rounded-lg transition-colors"
                            >
                              {category}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/products"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm"
                >
                  Products
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/deals"
                  className="text-orange-600 dark:text-orange-400 font-semibold transition-all duration-200 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm"
                >
                  Deals
                </Link>
              </motion.div>

              {isAdminUser() && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-sm"
                  >
                    Admin
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle - Hidden on small screens */}
              <motion.div 
                className="hidden md:block"
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Wishlist - Hidden on small screens */}
              <motion.div 
                className="hidden md:block"
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
              >
                <Link
                  href="/wishlist"
                  className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 transition-colors" />
                </Link>
              </motion.div>

              {/* Cart Icon */}
              <motion.button
                onClick={onCartClickAction}
                className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold min-w-[18px] h-4 rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block">
                  <motion.button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1 p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 group max-w-[120px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate hidden lg:block">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.phone}</p>
                              <span className="inline-block px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-medium mt-1">
                                {user?.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            My Wishlist
                          </Link>
                          {isAdminUser() && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/login"
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/register"
                      className="px-4 py-2 border border-orange-600 text-orange-600 bg-white dark:bg-gray-900 rounded-lg font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 text-sm"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 ml-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 py-4 space-y-3">
                  <div className="mb-4">
                    <SearchBar />
                  </div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      href="/deals"
                      className="flex items-center gap-3 px-4 py-3 text-orange-600 dark:text-orange-400 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Today's Deals
                    </Link>
                  </motion.div>

                  {/* Categories in Mobile */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <p className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.slice(0, 6).map((category, index) => (
                        <motion.div
                          key={category}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <Link
                            href={`/category/${category.toLowerCase()}`}
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400">{user?.role}</p>
                        </div>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        My Orders
                      </Link>
                      {isAdminUser() && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 space-y-3">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          href="/login"
                          className="block w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-medium text-center hover:from-orange-700 hover:to-orange-600 transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.45 }}
                      >
                        <Link
                          href="/register"
                          className="block w-full px-6 py-3 border-2 border-orange-600 text-orange-600 bg-white dark:bg-gray-900 rounded-xl font-medium text-center hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
      
      {/* Secondary Navigation Bar */}
      <div className="hidden lg:block bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Deliver to: <span className="font-medium text-gray-900 dark:text-white">Your Location</span></span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/customer-service" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Customer Service
              </Link>
              <Link href="/track-order" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Track Your Order
              </Link>
              <Link href="/gift-cards" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Gift Cards
              </Link>
              <Link href="/sell" className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors">
                Sell on LMM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}