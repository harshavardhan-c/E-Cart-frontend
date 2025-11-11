"use client"

import { useState, useEffect } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (product: any) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id)
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id)
      }
      return [
        ...prevWishlist,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      ]
    })
  }

  return {
    wishlist,
    toggleWishlist,
  }
}
