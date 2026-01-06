"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import CategorySection from "@/components/category-section"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"
import CartDrawer from "@/components/cart-drawer"
import FloatingActionButton, { QuickCartFAB } from "@/components/floating-action-button"
import { useCart } from "@/hooks/use-cart"
import { motion } from "framer-motion"

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <motion.main 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />
      <HeroSection />
      
      {/* Modern spacing and background */}
      <div className="bg-muted">
        <CategorySection />
      </div>
      
      {/* Product Sections with alternating backgrounds */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <ProductGrid title="🔥 Today's Hot Deals" category="snacks" />
      </motion.div>
      
      <div className="bg-muted">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <ProductGrid title="🍫 Sweet Indulgence" category="chocolates" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ProductGrid title="🏠 Home Essentials" category="utensils" />
      </motion.div>
      
      <div className="bg-muted">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <ProductGrid title="✨ Beauty & Wellness" category="cosmetics" />
        </motion.div>
      </div>
      
      <Footer />
      <CartDrawer isOpen={isCartOpen} onCloseAction={() => setIsCartOpen(false)} />
      
      {/* Floating Action Buttons */}
      <FloatingActionButton />
      <QuickCartFAB cartCount={cartCount} onCartClickAction={() => setIsCartOpen(true)} />
    </motion.main>
  )
}
