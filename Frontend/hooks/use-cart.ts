"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useToast } from "@/hooks/use-toast"
import { 
  fetchCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  resetCart
} from "@/store/slices/cartSlice"
// We no longer depend on Supabase auth for cart logic; use JWT/user slice

export function useCart() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [guestItems, setGuestItems] = useState<any[]>([])
  const [guestCount, setGuestCount] = useState(0)
  const [guestTotal, setGuestTotal] = useState(0)
  
  // Get cart state from Redux
  const { items, total, itemCount, loading, error, isAuthenticated } = useAppSelector(
    (state) => state.cart
  )

  const readGuestCart = (): any[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('guestCart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const writeGuestCart = (items: any[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('guestCart', JSON.stringify(items))
  }

  const recalcGuest = (items: any[]) => {
    setGuestItems(items)
    setGuestCount(items.reduce((n, it) => n + (it.quantity || 1), 0))
    setGuestTotal(items.reduce((sum, it) => sum + (it.products?.price || 0) * (it.quantity || 1), 0))
  }

  // Fetch cart on mount and when auth changes
  useEffect(() => {
    // Determine auth by presence of accessToken in localStorage (aligned with backend)
    const hasJwt = typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    if (hasJwt) {
      dispatch(fetchCart())
    } else {
      dispatch(resetCart())
      const items = readGuestCart()
      recalcGuest(items)
    }

    // Sync guest cart across components/tabs
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'guestCart') {
        const items = readGuestCart()
        recalcGuest(items)
      }
    }
    const handleGuestCartUpdated = () => {
      const items = readGuestCart()
      recalcGuest(items)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage)
      window.addEventListener('guestCartUpdated', handleGuestCartUpdated as EventListener)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage)
        window.removeEventListener('guestCartUpdated', handleGuestCartUpdated as EventListener)
      }
    }
  }, [dispatch])

  /**
   * Add product to cart
   * Requires authentication
   */
  const handleAddToCart = async (product: any) => {
    try {
      // Check if user is authenticated via JWT
      const hasJwt = typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
      if (!hasJwt) {
        // Guest path: write to localStorage immediately (no reload, instant UI)
        const items = readGuestCart()
        const idx = items.findIndex((it: any) => (it.product_id || it.id) === product.id)
        if (idx >= 0) {
          items[idx].quantity = (items[idx].quantity || 1) + 1
        } else {
          items.push({
            id: product.id,
            product_id: product.id,
            quantity: 1,
            // embed essential product fields for UI
            products: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url || product.image || '/placeholder.svg',
              category: product.category
            }
          })
        }
        writeGuestCart(items)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('guestCartUpdated'))
        }
        recalcGuest(items)
        toast({ title: "Item added to cart", description: `${product.name} has been added to your cart` })
        return
      }

      // Dispatch add to cart action
      const result = await dispatch(addToCart({ 
        productId: product.id, 
        quantity: 1 
      }))

      if (addToCart.fulfilled.match(result)) {
        // Fetch cart to get updated state
        dispatch(fetchCart())
        
        toast({
          title: "Item added to cart",
          description: `${product.name} has been added to your cart`,
        })
      } else if (addToCart.rejected.match(result)) {
        const errorMsg = result.payload as string
        
        // Handle authentication error specially
        if (errorMsg === 'USER_NOT_AUTHENTICATED') {
          toast({
            title: "Please login to continue shopping",
            description: "You need to login to add items to your cart",
            variant: "destructive"
          })
          
          const currentPath = window.location.pathname
          setTimeout(() => {
            router.push(`/login?redirect=${currentPath}`)
          }, 500)
        } else {
          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive"
          })
        }
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      
      // Check for authentication errors
      if (error.message?.includes('not authenticated') || error.message?.includes('USER_NOT_AUTHENTICATED')) {
        toast({
          title: "Please login to continue shopping",
          description: "You need to login to add items to your cart",
          variant: "destructive"
        })
        
        const currentPath = window.location.pathname
        setTimeout(() => {
          router.push(`/login?redirect=${currentPath}`)
        }, 500)
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to add to cart",
          variant: "destructive"
        })
      }
    }
  }

  /**
   * Update quantity
   */
  const handleUpdateQuantity = async (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveFromCart(cartId)
      return
    }

    try {
      const result = await dispatch(updateCartItem({ cartId, quantity }))
      
      if (updateCartItem.fulfilled.match(result)) {
        dispatch(fetchCart()) // Refresh cart
      } else if (updateCartItem.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Error updating quantity:', error)
    }
  }

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = async (cartId: string) => {
    try {
      const result = await dispatch(removeFromCart(cartId))
      
      if (removeFromCart.fulfilled.match(result)) {
        dispatch(fetchCart()) // Refresh cart
        
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        })
      } else if (removeFromCart.rejected.match(result)) {
        toast({
          title: "Error",
          description: result.payload as string,
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error)
    }
  }

  /**
   * Get total amount
   */
  const getTotal = () => {
    return total
  }

  /**
   * Clear entire cart
   */
  const handleClearCart = async () => {
    try {
      const result = await dispatch(clearCart())
      
      if (clearCart.fulfilled.match(result)) {
        dispatch(fetchCart())
        
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared",
        })
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error)
    }
  }

  return {
    cart: isAuthenticated ? items : guestItems,
    cartCount: isAuthenticated ? itemCount : guestCount,
    total: isAuthenticated ? getTotal() : guestTotal,
    loading,
    error,
    isAuthenticated,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  }
}
