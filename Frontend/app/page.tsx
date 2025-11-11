"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import HeroBanner from "@/components/hero-banner"
import CategorySection from "@/components/category-section"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <main className="min-h-screen bg-white">
      <Navbar onCartClickAction={() => setIsCartOpen(true)} cartCount={cartCount} />
      <HeroBanner />
      <CategorySection />
      <ProductGrid title="Top Offers" category="snacks" />
      <ProductGrid title="Sweet Treats" category="chocolates" />
      <ProductGrid title="Kitchen Essentials" category="utensils" />
      <ProductGrid title="Beauty & Care" category="cosmetics" />
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  )
}
